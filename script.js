"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-descargar");
    const cv = document.getElementById("hoja-vida");
    const estado = document.getElementById("estado-descarga");
    const checkFoto = document.getElementById("check-foto");
    const photoContainer = document.getElementById("photo-container");

    checkFoto?.addEventListener("change", () => {
        photoContainer?.classList.toggle("show", checkFoto.checked);
        document.querySelector(".header-inner")?.classList.toggle("has-photo", checkFoto.checked);
    });

    boton.addEventListener("click", async () => {
        const conFoto = checkFoto?.checked;
        if(conFoto) cv.classList.add("with-photo");
        
        boton.disabled = true;
        estado.textContent = "Generando...";
        cv.classList.add("pdf-generating");
        await new Promise(r => setTimeout(r, 300));

        const opciones = {
            margin: 0,
            filename: conFoto ? "HojaDeVida-Juliet-Fonseca-CON-FOTO.pdf" : "HojaDeVida-Juliet-Fonseca.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff", scrollY: 0 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] }
        };
        try{
            await window.html2pdf().set(opciones).from(cv).save();
            estado.textContent = "¡Descargado!";
        }catch(e){ 
            console.error(e);
            estado.textContent="Error al generar PDF"; 
        }
        finally{
            cv.classList.remove("pdf-generating","with-photo");
            boton.disabled = false;
        }
    });
});
