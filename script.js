window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');
  const estado = document.getElementById('estado-descarga');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    const prevFotoDisplay = foto ? foto.style.display : '';

    // 1. Activar modo exportación - NO toca la vista, solo el clon para PDF
    cv.classList.add('pdf-exporting');
    if (foto && !conFoto) {
      foto.style.display = 'none';
    }

    const txtOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Generando...';
    btn.disabled = true;
    if (estado) estado.textContent = conFoto ? 'Generando con foto...' : 'Generando sin foto...';

    try {
      await html2pdf().set({
        margin: [8, 8, 8, 8],
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          windowWidth: 794 // evita que la letra se vea gigante en A4
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] } // respeta tus break-inside
      }).from(cv).save();
      
      if (estado) estado.textContent = '¡PDF descargado!';
    } catch (e) {
      if (estado) estado.textContent = 'Error al generar PDF';
      console.error(e);
    } finally {
      // 2. Restaurar - la vista web queda 100% intacta
      cv.classList.remove('pdf-exporting');
      if (foto) foto.style.display = prevFotoDisplay;
      btn.innerHTML = txtOriginal;
      btn.disabled = false;
      setTimeout(() => { if (estado) estado.textContent = ''; }, 3000);
    }
  });
});
