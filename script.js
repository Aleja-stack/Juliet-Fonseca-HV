document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');
  const estado = document.getElementById('estado-descarga');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Generando PDF...';
    btn.disabled = true;
    if (estado) estado.textContent = 'Preparando tu hoja de vida...';

    // Foto según el switch
    const incluirFoto = checkFoto ? checkFoto.checked : true;
    if (foto) foto.style.display = incluirFoto ? '' : 'none';

    cv.classList.add('pdf-generating');

    const opt = {
      margin: 0,
      filename: 'HV_Juliet_Fonseca.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(cv).save();
      if (estado) estado.textContent = '¡Listo! PDF descargado.';
    } catch (err) {
      console.error(err);
      if (estado) estado.textContent = 'Error al generar el PDF.';
    } finally {
      cv.classList.remove('pdf-generating');
      if (foto) foto.style.display = '';
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
      setTimeout(() => { if (estado) estado.textContent = ''; }, 3000);
    }
  });
});
