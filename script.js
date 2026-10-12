document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-descargar");
  const cv = document.getElementById("hoja-vida");
  const check = document.getElementById("check-foto");
  const photo = document.getElementById("photo-container");
  const headerInner = document.querySelector(".header-inner");

  check.addEventListener("change", () => {
    const on = check.checked;
    photo.classList.toggle("show", on);
    headerInner.classList.toggle("has-photo", on);
  });

  btn.addEventListener("click", async () => {
    const conFoto = check.checked;
    if (conFoto) {
      photo.classList.add("show");
      headerInner.classList.add("has-photo");
      cv.classList.add("with-photo");
    }
    cv.classList.add("pdf-generating");
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 400));

    const opt = {
      margin: 0,
      filename: conFoto ? "HojaDeVida-Juliet-Fonseca-CON-FOTO.pdf" : "HojaDeVida-Juliet-Fonseca.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    try { await html2pdf().set(opt).from(cv).save(); } 
    finally {
      cv.classList.remove("pdf-generating", "with-photo");
      if (!check.checked) {
        photo.classList.remove("show");
        headerInner.classList.remove("has-photo");
      }
      btn.disabled = false;
    }
  });
});
