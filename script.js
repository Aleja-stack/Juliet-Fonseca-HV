document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('download-pdf');
  const element = document.getElementById('cv-content');
  const checkFoto = document.getElementById('check-foto');
  const fotoContainer = document.querySelector('.photo-container');

  if (!btn || !element) {
    console.log("No encontré el botón o el cv-content");
    return;
  }

  btn.addEventListener('click', async () => {
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    // Manejo de la foto según el switch
    const incluirFoto = checkFoto ? checkFoto.checked : true;
    if (fotoContainer) {
      fotoContainer.style.display = incluirFoto ? '' : 'none';
    }

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
    } catch (e) {
      console.error(e);
      alert("Error generando PDF");
    } finally {
      element.classList.remove('pdf-generating');
      if (fotoContainer) fotoContainer.style.display = '';
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
});
