window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    
    if (foto) foto.style.display = (checkFoto && !checkFoto.checked) ? 'none' : '';

    await html2pdf().set({
      margin: [10, 10, 10, 10],
      filename: 'HV_Juliet_Fonseca_2027.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(cv).save();

    if (foto) foto.style.display = '';
    btn.innerHTML = original;
    btn.disabled = false;
  });
});
