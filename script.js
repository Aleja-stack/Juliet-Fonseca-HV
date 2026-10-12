document.getElementById('btn-descargar').addEventListener('click', function () {
  // Aquí llamamos la hoja donde está guardada la hoja de vida
  const hoja = document.getElementById('hoja-vida');

  // Configuración del PDF
  const opciones = {
    margin: 10,
    filename: 'HojaDeVida-Juliet-Fonseca.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generar y descargar
  html2pdf().set(opciones).from(hoja).save();
});
