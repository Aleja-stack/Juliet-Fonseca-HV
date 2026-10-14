window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    const displayOriginal = foto ? foto.style.display : '';

    if (foto && !conFoto) foto.style.display = 'none';

    const textoOriginal = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    try {
      await html2pdf().set({
        margin: 10,
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();
    } finally {
      if (foto) foto.style.display = displayOriginal;
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
    }
  });
});
