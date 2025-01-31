document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const qrContainer = document.getElementById("qrcode");
    const inputData = document.getElementById("qr-data");
    document.getElementById("year").textContent = new Date().getFullYear();

    let qrCode;

    generateBtn.addEventListener("click", () => {
        const data = inputData.value.trim();

        if (!data) {
            alert("Please enter some text or a URL!");
            return;
        }

        // Clear existing QR code
        qrContainer.innerHTML = "";

        // Generate new QR code
        qrCode = new QRCode(qrContainer, {
            text: data,
            width: 200,
            height: 200,
        });

        // Show the download button
        downloadBtn.style.display = "block";
    });

    downloadBtn.addEventListener("click", () => {
        if (!qrCode) return;

        const canvas = qrContainer.querySelector("canvas");
        if (!canvas) return;

        // Create a new canvas with a white background
        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        // Fill the new canvas with a white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Draw the original QR code onto the new canvas
        ctx.drawImage(canvas, 0, 0);

        // Convert the new canvas to an image and download
        newCanvas.toBlob((blob) => {
            if (!blob) return;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "qrcode.png";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup the object URL to free memory
            URL.revokeObjectURL(url);
        }, "image/png");
    });
});
