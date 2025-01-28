// Load the QRCode library (use QRCode.js or CDN alternative)
document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const downloadBtn = document.getElementById("download-btn");
    const qrContainer = document.getElementById("qrcode");
    const inputData = document.getElementById("qr-data");
  
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
  
      // Convert QR code to image
      const img = qrContainer.querySelector("img") || qrContainer.querySelector("canvas");
      if (!img) return;
  
      // Create a download link
      const link = document.createElement("a");
      link.href = img.src;
      link.download = "qrcode.png";
      link.click();
    });
  });
  