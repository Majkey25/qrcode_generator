// Load the QRCode library (use QRCode.js or CDN alternative)
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

  // Convert canvas to data URL (PNG format)
  const dataURL = canvas.toDataURL("image/png");

  // Create a download link
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "qrcode.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
});
  