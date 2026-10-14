window.addEventListener('load', () => {
  console.log("script cargado");
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  
  if (!btn) { alert("No encuentro el botón btn-descargar"); return; }
  if (!cv) { alert("No encuentro hoja-vida"); return; }
  if (typeof html2pdf === 'undefined') { alert("No cargó html2pdf, revisa internet"); return; }

  console.log("Todo listo, botón activo");

  btn.onclick = async () => {
    btn.disabled = true;
    btn.innerHTML = 'Generando...';
    
    const checkFoto = document.getElementById('check-foto');
    const foto = document.getElementById('photo-container');
    if (foto) foto.style.display = (checkFoto && !checkFoto.checked) ? 'none' : '';

    cv.classList.add('pdf-generating');

    try {
      await html2pdf().set({
        margin: 0,
        filename: 'HV_Juliet_Fonseca_2027.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();
    } catch(e) {
      alert("Error: " + e.message);
      console.error(e);
    }
    
    cv.classList.remove('pdf-generating');
    if (foto) foto.style.display = '';
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-file-earmark-pdf me-2"></i> Descargar hoja de vida en PDF';
  };
});
