window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    // 1. Lógica con foto / sin foto - solo para exportación
    const conFoto = checkFoto ? checkFoto.checked : true;
    const prevFotoDisplay = foto ? foto.style.display : '';
    const prevOverflow = document.body.style.overflow;

    // 2. Activa modo PDF - NO afecta la vista normal, solo durante la captura
    cv.classList.add('pdf-exporting');
    if (foto && !conFoto) foto.style.display = 'none';
    document.body.style.overflow = 'visible';

    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generando PDF...';
    btn.disabled = true;

    try {
      await html2pdf().set({
        margin: [8, 8, 8, 8], // margen natural A4
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          windowWidth: 794 // ancho A4 para que no se agrande la letra
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] } // respeta break-inside: avoid
      }).from(cv).save();
    } finally {
      // 3. Restaura todo - la vista queda intacta
      cv.classList.remove('pdf-exporting');
      if (foto) foto.style.display = prevFotoDisplay;
      document.body.style.overflow = prevOverflow;
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
});
