window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const fotoContainer = document.getElementById('photo-container');
  const estado = document.getElementById('estado-descarga');

  if (!btn || !cv) return;

  // Por defecto marcado con foto
  if (checkFoto) checkFoto.checked = true;

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    
    // Guardamos el display original
    const displayOriginal = fotoContainer ? fotoContainer.style.display : '';
    
    // Si es sin foto, lo ocultamos SOLO para la foto del PDF
    if (fotoContainer && !conFoto) {
      fotoContainer.style.display = 'none';
    }

    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Generando...';
    btn.disabled = true;
    if (estado) estado.textContent = conFoto ? 'Descargando con foto...' : 'Descargando sin foto...';

    try {
      // Flujo natural: sin windowWidth, sin clases que cambien letras
      // La info fluye las páginas que necesite hacia abajo
      await html2pdf().set({
        margin: 8,
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();

      if (estado) estado.textContent = '¡PDF listo!';
    } catch (e) {
      console.error(e);
      if (estado) estado.textContent = 'Error al generar';
    } finally {
      // Restauramos todo para que tu web quede igual
      if (fotoContainer) fotoContainer.style.display = displayOriginal;
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
      setTimeout(() => { if (estado) estado.textContent = ''; }, 2500);
    }
  });
});
