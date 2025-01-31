document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const qrContainer = document.getElementById("qrcode");
    const inputData = document.getElementById("qr-data");
    const dotColor = document.getElementById("dot-color");
    const cornerColor = document.getElementById("corner-color");
    const bgColor = document.getElementById("bg-color");
    const dotStyle = document.getElementById("dot-style");
    const cornerStyle = document.getElementById("corner-style");
    const logoUpload = document.getElementById("logo-upload");
    document.getElementById("year").textContent = new Date().getFullYear();

    let qrCode;

    generateBtn.addEventListener("click", () => {
        const data = inputData.value.trim();
        if (!data) {
            alert("Please enter some text or a URL!");
            return;
        }

        // Clear previous QR Code
        qrContainer.innerHTML = "";

        // Read the uploaded logo
        let logo = null;
        if (logoUpload.files.length > 0) {
            const file = logoUpload.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                logo = e.target.result;
                generateQRCode(data, logo);
            };
            reader.readAsDataURL(file);
        } else {
            generateQRCode(data, null);
        }
    });

    function generateQRCode(data, logo) {
        qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            type: "svg",
            data: data,
            image: logo,
            dotsOptions: {
                color: dotColor.value,
                type: dotStyle.value,
            },
            cornersSquareOptions: {
                color: cornerColor.value,
                type: cornerStyle.value,
            },
            cornersDotOptions: {
                color: cornerColor.value,
                type: cornerStyle.value,
            },
            backgroundOptions: {
                color: bgColor.value,
            },
        });

        qrCode.append(qrContainer);
        downloadBtn.style.display = "block";
    }

    downloadBtn.addEventListener("click", () => {
        if (!qrCode) return;
        qrCode.download({ name: "qrcode", extension: "png" });
    });
});
