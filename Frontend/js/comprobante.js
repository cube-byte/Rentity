async function downloadPDF() {
  const btn = document.querySelector('.btn');
  btn.classList.add('loading');

  try {
    // Leer datos desde el html
    const leer = (id) => document.getElementById(id)?.textContent?.trim() || '—';

    const codigo       = document.querySelector('.header-code')?.textContent?.trim() || '—';
    const nombre       = leer('clienteNombre');
    const correo       = leer('clienteCorreo');
    const telefono     = leer('clienteTelefono');
    const vehiculoNom  = leer('vehiculoNombre');
    const vehiculoPlaca= leer('vehiculoPlaca');
    const vehiculoColor= document.querySelector('#vehiculoColor, .vehicle-meta strong:last-child')?.textContent?.trim() || '—';
    const fechaInicio  = leer('fechaInicio');
    const fechaFin     = leer('fechaFin');
    const total        = leer('totalPago');
    const fechaPago    = leer('fechaPago');

    // Volver pdf o algo asi
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W   = doc.internal.pageSize.getWidth();
    const PAD = 18;
    const CW  = W - PAD * 2;

    const C = {
      green:   [78, 135, 80],
      greenLt: [237, 245, 238],
      dark:    [55, 58, 55],
      gray:    [245, 245, 245],
      border:  [225, 225, 225],
      muted:   [150, 150, 150],
      white:   [255, 255, 255],
    };

    const fill = (x, y, w, h, col) => {
      doc.setFillColor(...col);
      doc.rect(x, y, w, h, 'F');
    };

    const rRect = (x, y, w, h, r, col, strokeCol) => {
      doc.setFillColor(...col);
      if (strokeCol) {
        doc.setDrawColor(...strokeCol);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, w, h, r, r, 'FD');
      } else {
        doc.setDrawColor(...col);
        doc.roundedRect(x, y, w, h, r, r, 'F');
      }
    };

    const hLine = (y, col = C.border, lw = 0.25) => {
      doc.setDrawColor(...col);
      doc.setLineWidth(lw);
      doc.line(PAD, y, W - PAD, y);
    };

    const txt = (text, x, y, opts = {}) => {
      const { size = 9, bold = false, color = C.dark, align = 'left', spacing = 0 } = opts;
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(String(text), x, y, { align, charSpace: spacing });
    };

    // HEADERR ─────────────────────────────────────────────────
    fill(0, 0, W, 20, C.white);

    txt('RENTIFY', PAD + 0, 13, { size: 14, bold: true, color: C.dark });
    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.25);
    doc.line(0, 22, W, 22);
    fill(0, 22, W, 28, C.dark);

    txt('COMPROBANTE DE ALQUILER', PAD, 31, { size: 7, color: [140, 140, 140], spacing: 0.8 });
    txt(codigo, PAD, 43, { size: 18, bold: true, color: C.white });
    let Y = 60;

    // CLIENTE ─────────────────────────────────────────
    fill(0, 50, W, 210, C.white);

    txt('DATOS DEL CLIENTE', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    [
      ['Nombre completo',    nombre],
      ['Correo electrónico', correo],
      ['Número de contacto', telefono],
    ].forEach(([k, v]) => {
      txt(k, PAD, Y, { size: 8, color: C.muted });
      txt(v, W - PAD, Y, { size: 9, bold: true, color: C.dark, align: 'right' });
      Y += 8;
    });

    Y += 2; hLine(Y); Y += 9;

    // VEHÍCULO ───────────────────────────────────────────────────
    txt('VEHÍCULO ASIGNADO', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    txt(vehiculoNom, PAD + 0, Y + 6, { size: 12, bold: true, color: C.dark });
    txt(
      `Placa: ${vehiculoPlaca}    ·    Color: ${vehiculoColor}`,
      PAD + 0, Y + 13,
      { size: 8, color: C.muted }
    );

    Y += 20; hLine(Y); Y += 9;

    // FECHAS ────────────────────────────────────────────────────
    txt('PERÍODO DE ALQUILER', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    const boxW = (CW - 6) / 2;

    rRect(PAD, Y, boxW, 16, 2, C.gray, C.border);
    txt('FECHA DE INICIO', PAD + 5, Y + 6, { size: 7, color: C.muted, spacing: 0.5 });
    txt(fechaInicio, PAD + 5, Y + 13, { size: 9.5, bold: true, color: C.dark });

    const fx = PAD + boxW + 6;
    rRect(fx, Y, boxW, 16, 2, C.gray, C.border);
    txt('FECHA FINAL', fx + 5, Y + 6, { size: 7, color: C.muted, spacing: 0.5 });
    txt(fechaFin, fx + 5, Y + 13, { size: 9.5, bold: true, color: C.dark });

    Y += 23; hLine(Y); Y += 9;

    // TOTAL ─────────────────────────────────────────────────────
    txt('RESUMEN DE PAGO', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    rRect(PAD, Y, CW, 18, 2, C.gray);
    rRect(PAD, Y, 4, 18, 1, C.green);

    txt('TOTAL', PAD + 9, Y + 8, { size: 7.5, color: C.muted, spacing: 0.5 });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const totalW = doc.getTextWidth(total);
    doc.setFontSize(11);
    doc.setTextColor(...C.green);
    doc.text('$', W - PAD - totalW - 5, Y + 14);
    txt(total, W - PAD, Y + 14, { size: 20, bold: true, color: C.dark, align: 'right' });
    Y += 24;
    rRect(PAD, Y, CW, 13, 2, C.greenLt);
    txt('FECHA DE PAGO', PAD + 10, Y + 7.5, { size: 7, bold: true, color: C.green, spacing: 0.8 });
    txt(fechaPago, W - PAD - 10, Y + 7.5, { size: 9, bold: true, color: C.dark, align: 'right' });
    Y += 20;

    // FOOTER ────────────────────────────────────────────────────
    hLine(Y, C.border, 0.25);
    Y += 7;
    txt('Documento válido como comprobante oficial de alquiler.', PAD, Y, { size: 7.5, color: [200, 200, 200] });
    txt('RENTIFY', W - PAD, Y, { size: 9, bold: true, color: C.green, align: 'right' });




    doc.save(`Comprobante-Rentify-${codigo}.pdf`);

  } catch (err) {
    console.error(err);
    alert('No se pudo generar el PDF: ' + err.message);
  }

  btn.classList.remove('loading');
}