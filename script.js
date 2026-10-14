
/* =========================================================
   HOJA DE VIDA - JULIET FONSECA
   Generación de PDF con html2pdf.js.
   Compatible con navegadores modernos y JavaScript vanilla.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const btnDescargar = document.getElementById("btn-descargar");
  const checkboxFoto = document.getElementById("check-foto");
  const estadoDescarga = document.getElementById("estado-descarga");
  const hojaVida = document.getElementById("hoja-vida");
  const fotoPerfil = document.getElementById("foto-perfil");
  const contenedorFoto = document.getElementById("photo-container");

  // Verifica que los elementos principales del HTML existan.
  if (!btnDescargar || !hojaVida || !estadoDescarga) {
    console.error(
      "No se encontraron los elementos necesarios para generar el PDF."
    );
    return;
  }

  /**
   * Muestra mensajes accesibles para el usuario.
   */
  function mostrarEstado(mensaje, tipo = "info") {
    estadoDescarga.textContent = mensaje;
    estadoDescarga.setAttribute("role", "status");
    estadoDescarga.setAttribute("aria-live", "polite");

    // Se conservan las clases existentes y se actualizan
    // únicamente las clases de estado conocidas.
    estadoDescarga.classList.remove(
      "text-success",
      "text-danger",
      "text-muted"
    );

    if (tipo === "exito") {
      estadoDescarga.classList.add("text-success");
    } else if (tipo === "error") {
      estadoDescarga.classList.add("text-danger");
    } else {
      estadoDescarga.classList.add("text-muted");
    }
  }

  /**
   * Espera a que la imagen termine de cargar para evitar
   * exportar una fotografía vacía o incompleta.
   */
  async function esperarImagen(img) {
    if (!img || !img.getAttribute("src")) {
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      return;
    }

    if (typeof img.decode === "function") {
      try {
        await img.decode();
        return;
      } catch {
        // Si decode falla, se comprueba el evento de carga.
      }
    }

    await new Promise((resolve, reject) => {
      const alCargar = () => {
        limpiar();
        resolve();
      };

      const alFallar = () => {
        limpiar();
        reject(new Error("No fue posible cargar la fotografía."));
      };

      const limpiar = () => {
        img.removeEventListener("load", alCargar);
        img.removeEventListener("error", alFallar);
      };

      img.addEventListener("load", alCargar, { once: true });
      img.addEventListener("error", alFallar, { once: true });
    });
  }

  /**
   * Espera a que el navegador termine de aplicar los estilos
   * y calcular el diseño antes de capturar el documento.
   */
  async function esperarRenderizado() {
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
  }

  /**
   * Genera el nombre de archivo según la opción de fotografía.
   */
  function obtenerNombreArchivo(incluirFoto) {
    const sufijo = incluirFoto ? "con_foto" : "sin_foto";
    return `Hoja_de_vida_Juliet_Fonseca_${sufijo}.pdf`;
  }

  /**
   * Genera el PDF.
   */
  async function descargarPDF() {
    if (btnDescargar.disabled) {
      return;
    }

    // Confirma que la librería esté disponible.
    if (typeof html2pdf !== "function") {
      mostrarEstado(
        "No se pudo generar el PDF. Verifica que html2pdf.js esté cargado.",
        "error"
      );
      return;
    }

    const incluirFoto = Boolean(checkboxFoto?.checked);

    // Guarda los estilos originales para restaurarlos exactamente.
    const estilosOriginales = {
      fotoDisplay: contenedorFoto?.style.display ?? "",
      imagenDisplay: fotoPerfil?.style.display ?? "",
      claseBody: document.body.classList.contains("cv-generating-pdf"),
      claseEncabezado: null,
      claseContenedorFoto: null
    };

    const headerInner = hojaVida.querySelector(".header-inner");

    if (headerInner) {
      estilosOriginales.claseEncabezado =
        headerInner.classList.contains("pdf-no-photo");
    }

    if (contenedorFoto) {
      estilosOriginales.claseContenedorFoto =
        contenedorFoto.classList.contains("pdf-no-photo");
    }

    btnDescargar.disabled = true;
    btnDescargar.setAttribute("aria-busy", "true");
    mostrarEstado("Generando PDF…", "info");

    try {
      // La foto se carga antes de capturar el documento.
      if (incluirFoto && fotoPerfil) {
        await esperarImagen(fotoPerfil);
      }

      // Activa los estilos temporales de exportación.
      document.body.classList.add("cv-generating-pdf");

      // Oculta la foto únicamente durante esta generación.
      if (!incluirFoto && contenedorFoto) {
        contenedorFoto.classList.add("pdf-no-photo");
        contenedorFoto.style.display = "none";

        if (headerInner) {
          headerInner.classList.add("pdf-no-photo");
        }
      }

      await esperarRenderizado();

      // Márgenes en milímetros para papel A4.
      const opcionesPDF = {
        margin: [12, 12, 12, 12],
        filename: obtenerNombreArchivo(incluirFoto),
        image: {
          type: "jpeg",
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: 0,
          windowWidth: Math.max(
            document.documentElement.clientWidth,
            794
          )
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
            ".cv-section",
            ".experience-item",
            ".education-item",
            ".skill-tags",
            ".entry-heading",
            ".timeline li"
          ]
        }
      };

      await html2pdf()
        .set(opcionesPDF)
        .from(hojaVida)
        .save();

      mostrarEstado(
        `PDF descargado correctamente (${incluirFoto ? "con fotografía" : "sin fotografía"}).`,
        "exito"
      );
    } catch (error) {
      console.error("Error al generar el PDF:", error);

      mostrarEstado(
        "Ocurrió un error al generar el PDF. Inténtalo nuevamente.",
        "error"
      );
    } finally {
      // Restaura los estilos originales, incluso si hay un error.
      if (contenedorFoto) {
        contenedorFoto.style.display = estilosOriginales.fotoDisplay;

        if (estilosOriginales.claseContenedorFoto === false) {
          contenedorFoto.classList.remove("pdf-no-photo");
        } else if (estilosOriginales.claseContenedorFoto === true) {
          contenedorFoto.classList.add("pdf-no-photo");
        }
      }

      if (fotoPerfil) {
        fotoPerfil.style.display = estilosOriginales.imagenDisplay;
      }

      if (headerInner) {
        if (estilosOriginales.claseEncabezado === false) {
          headerInner.classList.remove("pdf-no-photo");
        } else if (estilosOriginales.claseEncabezado === true) {
          headerInner.classList.add("pdf-no-photo");
        }
      }

      if (!estilosOriginales.claseBody) {
        document.body.classList.remove("cv-generating-pdf");
      }

      btnDescargar.disabled = false;
      btnDescargar.removeAttribute("aria-busy");
    }
  }

  // Evita descargas duplicadas durante la generación.
  btnDescargar.addEventListener("click", (evento) => {
    evento.preventDefault();
    descargarPDF();
  });
});

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
