

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonDescargar = document.getElementById("btn-descargar");
    const contenedorCV = document.getElementById("hoja-vida");
    const estadoDescarga = document.getElementById("estado-descarga");

    if (!botonDescargar || !contenedorCV) {
        console.error("No se encontró el botón o el contenedor del CV.");
        return;
    }

    const nombreArchivo = "HojaDeVida-Juliet-Fonseca.pdf";

    function mostrarEstado(mensaje) {
        if (estadoDescarga) {
            estadoDescarga.textContent = mensaje;
        }
    }

    botonDescargar.addEventListener("click", async () => {
        if (typeof window.html2pdf !== "function") {
            mostrarEstado(
                "No se pudo cargar la librería PDF. Verifica tu conexión a internet."
            );
            console.error("html2pdf.js no está disponible.");
            return;
        }

        botonDescargar.disabled = true;
        mostrarEstado("Preparando tu hoja de vida...");

        contenedorCV.classList.add("pdf-generating");

        try {
            // Permite que el navegador aplique los estilos del PDF.
            await new Promise(resolve => requestAnimationFrame(resolve));

            const opciones = {
                margin: [8, 8, 8, 8],
                filename: nombreArchivo,

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0,
                    logging: false
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                },

                pagebreak: {
                    mode: ["css", "legacy"],
                    avoid: [
                        ".education-item"
                    ]
                }
            };

            mostrarEstado("Generando el PDF...");

            await window.html2pdf()
                .set(opciones)
                .from(contenedorCV)
                .save();

            mostrarEstado("¡Tu hoja de vida se descargó correctamente!");

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            mostrarEstado(
                "No se pudo generar el PDF. Revisa la consola e inténtalo nuevamente."
            );

        } finally {
            contenedorCV.classList.remove("pdf-generating");
            botonDescargar.disabled = false;
        }
    });
});
