document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("qr-form");
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const qrContainer = document.getElementById("qrcode");
    const emptyState = document.getElementById("empty-state");
    const statusMessage = document.getElementById("status-message");
    const errorMessage = document.getElementById("form-error");
    const inputData = document.getElementById("qr-data");
    const dotColor = document.getElementById("dot-color");
    const cornerColor = document.getElementById("corner-color");
    const bgColor = document.getElementById("bg-color");
    const dotStyle = document.getElementById("dot-style");
    const cornerStyle = document.getElementById("corner-style");
    const logoUpload = document.getElementById("logo-upload");
    const logoControl = document.querySelector(".file-control");
    const logoFileName = document.getElementById("logo-file-name");
    const colorInputs = [dotColor, cornerColor, bgColor];
    document.getElementById("year").textContent = new Date().getFullYear();

    let generationId = 0;
    let invalidControl;
    let qrCode;

    const showError = (message, control, anchor = generateBtn) => {
        invalidControl = control;
        if (invalidControl) {
            invalidControl.setAttribute("aria-describedby", "form-error");
            invalidControl.setAttribute("aria-invalid", "true");
        }
        anchor.insertAdjacentElement("afterend", errorMessage);
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    };

    const clearError = () => {
        if (invalidControl) {
            invalidControl.removeAttribute("aria-describedby");
            invalidControl.removeAttribute("aria-invalid");
            invalidControl = undefined;
        }
        errorMessage.textContent = "";
        errorMessage.hidden = true;
    };

    const resetPreview = () => {
        qrCode = undefined;
        qrContainer.replaceChildren(emptyState);
        qrContainer.setAttribute("aria-label", "QR code preview. No QR code generated yet.");
        downloadBtn.disabled = true;
        statusMessage.textContent = "";
    };

    const readLogo = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Logo could not be read."));
            }
        }, { once: true });
        reader.addEventListener("error", () => reject(new Error("Logo could not be read.")), { once: true });
        reader.addEventListener("abort", () => reject(new Error("Logo selection was cancelled.")), { once: true });
        reader.readAsDataURL(file);
    });

    const validateLogo = (source) => new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", () => reject(new Error("Logo is not a valid image.")), { once: true });
        image.src = source;
    });

    colorInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.nextElementSibling.value = input.value.toUpperCase();
        });
    });

    logoUpload.addEventListener("change", () => {
        logoFileName.textContent = logoUpload.files[0]?.name || "No file chosen";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearError();
        const requestId = ++generationId;
        resetPreview();
        generateBtn.disabled = true;

        const data = inputData.value.trim();
        if (!data) {
            showError("Enter text or a URL to generate a QR code.", inputData, inputData);
            inputData.focus();
            generateBtn.disabled = false;
            return;
        }

        const file = logoUpload.files[0];
        if (file && (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)) {
            showError("Choose an image smaller than 2 MB.", logoUpload, logoControl);
            logoUpload.focus();
            generateBtn.disabled = false;
            return;
        }

        const options = {
            dotColor: dotColor.value,
            cornerColor: cornerColor.value,
            backgroundColor: bgColor.value,
            dotStyle: dotStyle.value,
            cornerStyle: cornerStyle.value,
        };

        try {
            if (typeof QRCodeStyling !== "function") {
                throw new Error("QR library failed to load.");
            }
            let logo;
            try {
                logo = file ? await readLogo(file) : undefined;
                if (logo) await validateLogo(logo);
            } catch {
                if (requestId !== generationId) return;
                resetPreview();
                showError("Choose a valid image file.", logoUpload, logoControl);
                logoUpload.focus();
                return;
            }
            if (requestId !== generationId) return;

            const nextQrCode = new QRCodeStyling({
                width: 300,
                height: 300,
                type: "svg",
                data,
                image: logo,
                margin: 20,
                dotsOptions: {
                    color: options.dotColor,
                    type: options.dotStyle,
                },
                cornersSquareOptions: {
                    color: options.cornerColor,
                    type: options.cornerStyle,
                },
                cornersDotOptions: {
                    color: options.cornerColor,
                    type: options.cornerStyle,
                },
                backgroundOptions: {
                    color: options.backgroundColor,
                },
            });

            qrContainer.replaceChildren();
            nextQrCode.append(qrContainer);
            if (!await nextQrCode.getRawData("svg")) {
                throw new Error("QR preview could not be rendered.");
            }
            if (requestId !== generationId) return;
            qrCode = nextQrCode;
            qrContainer.setAttribute("aria-label", "Generated QR code preview.");
            downloadBtn.disabled = false;
            statusMessage.textContent = "QR code generated. Download is ready.";
        } catch (error) {
            if (requestId !== generationId) return;
            resetPreview();
            showError("QR code could not be generated. Try again.");
            console.error(error);
        } finally {
            if (requestId === generationId) {
                generateBtn.disabled = false;
            }
        }
    });

    downloadBtn.addEventListener("click", async () => {
        if (!qrCode) return;

        clearError();
        try {
            await qrCode.download({ name: "qrcode", extension: "png" });
        } catch (error) {
            showError("QR code could not be downloaded. Try again.", undefined, downloadBtn);
            console.error(error);
        }
    });
});
