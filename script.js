document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-descargar');
    const cv = document.getElementById('hoja-vida');
    const checkFoto = document.getElementById('check-foto');
    const estado = document.getElementById('estado-descarga');

    if (!btn || !cv) return;

    btn.addEventListener('click', async () => {
        const incluirFoto = checkFoto ? checkFoto.checked : false;
        
        // Prepara el modo PDF
        cv.classList.add('pdf-generating');
        if (incluirFoto) {
            cv.classList.add('with-photo');
        } else {
            cv.classList.remove('with-photo');
        }

        estado.textContent = 'Generando PDF...';
        btn.disabled = true;

        const opt = {
            margin: [10, 10, 10, 10], // 10mm arriba, derecha, abajo, izquierda
            filename: 'HV Juliet Fonseca 2027-1.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                scrollY: 0 
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { 
                mode: ['css', 'legacy'] // ESTA LINEA ES LA QUE ARREGLA TU ERROR
            }
        };

        try {
            await html2pdf().set(opt).from(cv).save();
            estado.textContent = '¡PDF descargado correctamente!';
        } catch (e) {
            console.error(e);
            estado.textContent = 'Error al generar el PDF';
        } finally {
            cv.classList.remove('pdf-generating', 'with-photo');
            btn.disabled = false;
            setTimeout(() => estado.textContent = '', 3000);
        }
    });
});
