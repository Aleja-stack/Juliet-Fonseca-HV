
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonDescargar = document.getElementById("btn-descargar");
    const contenedorCV = document.getElementById("hoja-vida");
    const estadoDescarga = document.getElementById("estado-descarga");

    if (!botonDescargar || !contenedorCV) {
        console.error("No se encontró el botón o el contenedor del CV.");
        return;
    }

    function mostrarEstado(mensaje) {
        if (estadoDescarga) {
            estadoDescarga.textContent = mensaje;
        }
    }

    botonDescargar.addEventListener("click", async () => {
        if (typeof window.html2pdf !== "function") {
            mostrarEstado(
                "No se pudo cargar la librería PDF. Revisa tu conexión a internet."
            );
            console.error("html2pdf.js no está disponible.");
            return;
        }

        botonDescargar.disabled = true;
        mostrarEstado("Generando tu hoja de vida en PDF...");

        try {
            const opciones = {
                margin: [8, 8, 8, 8],
                filename: "HojaDeVida-Juliet-Fonseca.pdf",

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                },

                pagebreak: {
                    mode: ["css", "legacy"],
                    avoid: [
                        ".experience-item",
                        ".education-item"
                    ]
                }
            };

            await window.html2pdf()
                .set(opciones)
                .from(contenedorCV)
                .save();

            mostrarEstado("¡PDF descargado correctamente!");

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            mostrarEstado(
                "No se pudo generar el PDF. Inténtalo nuevamente."
            );
        } finally {
            botonDescargar.disabled = false;
        }
    });
});

