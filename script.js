document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('download-pdf');
  const element = document.getElementById('cv-content');

  if (!btn || !element) return;

  btn.addEventListener('click', async () => {
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Generando...';
    btn.disabled = true;

    // Agrega clase para ocultar botón en el PDF
    element.classList.add('pdf-generating');

    const opt = {
      margin: 0,
      filename: 'HV_Juliet_Fonseca.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      element.classList.remove('pdf-generating');
      btn.innerHTML = '<i class="bi bi-download me-2"></i> Descargar PDF';
      btn.disabled = false;
    }
  });
});
