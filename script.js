
window.addEventListener("load", () => {
    const btn = document.getElementById("btn-descargar");
    const cv = document.getElementById("hoja-vida");
    const checkFoto = document.getElementById("check-foto");
    const fotoContainer = document.getElementById("photo-container");
    const foto = document.getElementById("foto-perfil");
    const estado = document.getElementById("estado-descarga");

    if (!btn || !cv) return;

    // Por defecto, ofrecer la descarga con foto.
    if (checkFoto) checkFoto.checked = true;

    // Espera a que la foto esté cargada antes de crear el PDF.
    async function esperarFoto(img) {
        if (!img) return;

        if (img.complete) {
            if (img.naturalWidth === 0) {
                throw new Error("No se pudo cargar la foto.");
            }
            return;
        }

        await new Promise((resolve, reject) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener(
                "error",
                () => reject(new Error("No se pudo cargar la foto.")),
                { once: true }
            );
        });
    }

    btn.addEventListener("click", async () => {
        if (typeof html2pdf === "undefined") {
            if (estado) {
                estado.textContent =
                    "No se pudo cargar el generador de PDF. Recarga la página.";
            }
            return;
        }

        const conFoto = checkFoto ? checkFoto.checked : true;
        const textoOriginal = btn.innerHTML;

        // Guardar los estilos para restaurarlos después.
        const displayOriginal = fotoContainer
            ? fotoContainer.style.display
            : "";

        const yaTeniaClase = document.body.classList.contains("pdf-export");

        btn.disabled = true;
        btn.innerHTML =
            '<i class="bi bi-hourglass-split me-2"></i>Generando PDF...';

        if (estado) {
            estado.textContent = conFoto
                ? "Preparando tu hoja de vida con foto..."
                : "Preparando tu hoja de vida sin foto...";
        }

        try {
            if (conFoto) {
                await esperarFoto(foto);
            }

            // Activa temporalmente los estilos exclusivos del PDF.
            document.body.classList.add("pdf-export");

            if (fotoContainer && !conFoto) {
                fotoContainer.style.display = "none";
            }

            // Esperar a que el navegador aplique los estilos.
            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(resolve)
                )
            );

            const opciones = {
                margin: [10, 10, 10, 10],
                filename: `HV_Juliet_Fonseca_${
                    conFoto ? "con" : "sin"
                }_foto.pdf`,

                image: {
                    type: "jpeg",
                    quality: 0.98
                },

                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
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
                    before: [],
                    after: [],
                    avoid: [
                        ".experience-item",
                        ".education-item",
                        ".cv-item",
                        ".timeline-item",
                        ".education-card"
                    ]
                }

            };

            await html2pdf()
                .set(opciones)
                .from(cv)
                .save();

            if (estado) {
                estado.textContent = "¡Tu PDF se generó correctamente!";
            }
        } catch (error) {
            console.error("Error al generar el PDF:", error);

            if (estado) {
                estado.textContent =
                    "No se pudo generar el PDF. Verifica que la foto cargue correctamente e inténtalo de nuevo.";
            }
        } finally {
            // Restaurar la apariencia original de la página.
            if (fotoContainer) {
                fotoContainer.style.display = displayOriginal;
            }

            if (!yaTeniaClase) {
                document.body.classList.remove("pdf-export");
            }

            btn.innerHTML = textoOriginal;
            btn.disabled = false;

            // Quitar el mensaje después de unos segundos.
            setTimeout(() => {
                if (estado) estado.textContent = "";
            }, 4000);
        }
    });
});
