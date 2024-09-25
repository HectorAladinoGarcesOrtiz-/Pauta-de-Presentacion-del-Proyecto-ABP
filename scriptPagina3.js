document.addEventListener("DOMContentLoaded", function() {
    generateQRCode('qrGoogleForms', 'https://forms.gle/vVZv4si73mGZrV7h8');
    generateQRCode('qrSurveyMonkey', 'https://es.surveymonkey.com/r/FJTGW9Y');
});

// Función para generar el QR
function generateQRCode(canvasId, url) {
    const canvas = document.getElementById(canvasId);
    const qr = new QRious({
        element: canvas,
        value: url,
        size: 150
    });
}

// Función para descargar el QR como PDF
function downloadQR(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Código QR", 70, 20);
    doc.addImage(imgData, 'PNG', 30, 30, 150, 150);
    doc.save(filename);
}

// Función para regresar a la página principal
function goBack() {
    window.location.href = "index.htm";
}
