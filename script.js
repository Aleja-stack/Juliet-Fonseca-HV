
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const botonDescargar = document.getElementById("btn-descargar");
    const contenedorCV = document.getElementById("hoja-vida");
    const estadoDescarga = document.getElementById("estado-descarga");

    if (!botonDescargar || !contenedorCV) {
        console.error(
            "No se encontró el botón de descarga o el contenedor del CV."
        );
        return;
    }

    const nombreArchivo = "HojaDeVida-Juliet-Fonseca.pdf";

    botonDescargar.addEventListener("click", async () => {
        // Verificar que html2pdf.js se haya cargado correctamente.
        if (typeof window.html2pdf !== "function") {
            mostrarEstado(
                "No se pudo cargar la librería PDF. Verifica tu conexión a internet e inténtalo de nuevo."
            );
            console.error("html2pdf.js no está disponible.");
            return;
        }

        const textoOriginal = botonDescargar.textContent;
        const botonEstabaOculto =
            window.getComputedStyle(botonDescargar).display === "none";

        try {
            botonDescargar.disabled = true;
            botonDescargar.textContent = "Generando PDF...";
            mostrarEstado("Preparando la hoja de vida...");

            // El botón está fuera del CV, pero se oculta preventivamente.
            botonDescargar.style.setProperty("display", "none", "important");
            botonDescargar.setAttribute("aria-hidden", "true");

            // Esperar al siguiente ciclo para aplicar los estilos antes de renderizar.
            await new Promise((resolve) => requestAnimationFrame(resolve));

            const opciones = {
                margin: [10, 10, 10, 10],
                filename: nombreArchivo,

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    logging: false,
                    scrollX: 0,
                    scrollY: 0
                },

                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                    compress: true
                },

                pagebreak: {
                    mode: ["css", "legacy"],
                    avoid: [
                        ".experience-item",
                        ".education-item",
                        ".section-title"
                    ]
                }
            };

            // Solo se exporta el contenedor del CV, nunca la interfaz externa.
            await window.html2pdf()
                .set(opciones)
                .from(contenedorCV)
                .save();

            mostrarEstado("PDF generado correctamente.");
        } catch (error) {
            console.error("Error al generar el PDF:", error);

            mostrarEstado(
                "No fue posible generar el PDF. Recarga la página e inténtalo de nuevo."
            );
        } finally {
            // Restaurar el botón y su estado aunque la generación falle.
            if (!botonEstabaOculto) {
                botonDescargar.style.removeProperty("display");
            }

            botonDescargar.removeAttribute("aria-hidden");
            botonDescargar.disabled = false;
            botonDescargar.textContent = textoOriginal;
        }
    });

    function mostrarEstado(mensaje) {
        if (estadoDescarga) {
            estadoDescarga.textContent = mensaje;
        }
    }
});

