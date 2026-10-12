"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("btn-descargar");
    const cv = document.getElementById("hoja-vida");
    const estado = document.getElementById("estado-descarga");
    const checkFoto = document.getElementById("check-foto");
    const photoContainer = document.getElementById("photo-container");

    // Mostrar/ocultar foto en la web al marcar el switch
    checkFoto?.addEventListener("change", () => {
        photoContainer?.classList.toggle("show", checkFoto.checked);
    });

    boton.addEventListener("click", async () => {
        const conFoto = checkFoto?.checked;
        if(conFoto) cv.classList.add("with-photo");
        
        boton.disabled = true;
        estado.textContent = conFoto ? "Generando PDF con foto..." : "Generando PDF sin foto...";
        cv.classList.add("pdf-generating");
        await new Promise(r => requestAnimationFrame(r));

        const opciones = {
            margin:[8,8,8,8],
            filename: conFoto ? "HojaDeVida-Juliet-Fonseca-CON-FOTO.pdf" : "HojaDeVida-Juliet-Fonseca.pdf",
            image:{type:"jpeg", quality:0.98},
            html2canvas:{scale:2, useCORS:true, backgroundColor:"#ffffff"},
            jsPDF:{unit:"mm", format:"a4", orientation:"portrait"},
            pagebreak:{mode:["css","legacy"], avoid:[".experience-item",".education-item"]}
        };
        try{
            await window.html2pdf().set(opciones).from(cv).save();
            estado.textContent = "¡Descargado!";
        }catch(e){ estado.textContent="Error al generar PDF"; }
        finally{
            cv.classList.remove("pdf-generating","with-photo");
            boton.disabled = false;
            setTimeout(()=>estado.textContent="",3000);
        }
    });
});
