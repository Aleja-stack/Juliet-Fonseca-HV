window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');
  const foto = document.getElementById('photo-container');
  const estado = document.getElementById('estado-descarga');

  if (!btn || !cv) {
    console.error("Falta btn-descargar o hoja-vida");
    return;
  }

  btn.addEventListener('click', async () => {
    const original = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;
    if (estado) estado.textContent = '';

    // Foto según switch
    if (foto) {
      foto.style.display = (checkFoto && !checkFoto.checked) ? 'none' : '';
    }

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'HV_Juliet_Fonseca_2027.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(cv).save();
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    } finally {
      if (foto) foto.style.display = '';
      btn.innerHTML = original;
      btn.disabled = false;
    }
  });
});
