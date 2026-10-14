window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    const fotoOriginal = document.getElementById('photo-container');
    const displayGuardado = fotoOriginal ? fotoOriginal.style.display : '';

    // Oculta solo para el PDF si el usuario no quiere foto
    if (fotoOriginal && !conFoto) {
      fotoOriginal.style.display = 'none';
    }

    const textoBtn = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    try {
      // Sin windowWidth, sin clases, sin cambiar tamaños
      // Fluye natural hacia abajo
      await html2pdf().set({
        margin: 10,
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();
    } finally {
      if (fotoOriginal) fotoOriginal.style.display = displayGuardado;
      btn.innerHTML = textoBtn;
      btn.disabled = false;
    }
  });
});window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    const fotoOriginal = document.getElementById('photo-container');
    const displayGuardado = fotoOriginal ? fotoOriginal.style.display : '';

    // Oculta solo para el PDF si el usuario no quiere foto
    if (fotoOriginal && !conFoto) {
      fotoOriginal.style.display = 'none';
    }

    const textoBtn = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    try {
      // Sin windowWidth, sin clases, sin cambiar tamaños
      // Fluye natural hacia abajo
      await html2pdf().set({
        margin: 10,
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();
    } finally {
      if (fotoOriginal) fotoOriginal.style.display = displayGuardado;
      btn.innerHTML = textoBtn;
      btn.disabled = false;
    }
  });
});window.addEventListener('load', () => {
  const btn = document.getElementById('btn-descargar');
  const cv = document.getElementById('hoja-vida');
  const checkFoto = document.getElementById('check-foto');

  if (!btn || !cv) return;

  btn.addEventListener('click', async () => {
    const conFoto = checkFoto ? checkFoto.checked : true;
    const fotoOriginal = document.getElementById('photo-container');
    const displayGuardado = fotoOriginal ? fotoOriginal.style.display : '';

    // Oculta solo para el PDF si el usuario no quiere foto
    if (fotoOriginal && !conFoto) {
      fotoOriginal.style.display = 'none';
    }

    const textoBtn = btn.innerHTML;
    btn.innerHTML = 'Generando...';
    btn.disabled = true;

    try {
      // Sin windowWidth, sin clases, sin cambiar tamaños
      // Fluye natural hacia abajo
      await html2pdf().set({
        margin: 10,
        filename: `HV_Juliet_Fonseca_${conFoto ? 'con' : 'sin'}_foto.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(cv).save();
    } finally {
      if (fotoOriginal) fotoOriginal.style.display = displayGuardado;
      btn.innerHTML = textoBtn;
      btn.disabled = false;
    }
  });
});'portrait' }
      }).from(cv).save();
    } finally {
      if (foto) foto.style.display = displayOriginal;
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
    }
  });
});
