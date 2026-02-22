

async function downloadPDF() {
  const btn = document.querySelector('.btn');
  btn.classList.add('loading');

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const W   = doc.internal.pageSize.getWidth();
    const PAD = 18;
    const CW  = W - PAD * 2;

    // ── Color palette ──────────────────────────────────────────────────
    const C = {
      green:    [78, 135, 80],
      greenLt:  [237, 245, 238],
      dark:     [55, 58, 55],
      gray:     [245, 245, 245],
      border:   [225, 225, 225],
      textGray: [150, 150, 150],
      white:    [255, 255, 255],
    };

    // ── Utilities ──────────────────────────────────────────────────────
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
      const {
        size   = 9,
        bold   = false,
        color  = C.dark,
        align  = 'left',
        spacing = 0
      } = opts;
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.text(String(text), x, y, { align, charSpace: spacing });
    };

    // ─────────────────────────────────────────────────────────────────
    // 1. BRAND BAR
    // ─────────────────────────────────────────────────────────────────
    fill(0, 0, W, 20, C.white);

    txt('RENTIFY', PAD + 0, 13, { size: 14, bold: true, color: C.dark });
    const rentifW = (() => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      return doc.getTextWidth('RENTIFY');
    })();

    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.25);
    doc.line(0, 20, W, 20);

    // ─────────────────────────────────────────────────────────────────
    // 2. DARK HEADER
    // ─────────────────────────────────────────────────────────────────
    fill(0, 20, W, 28, C.dark);

    txt('COMPROBANTE DE ALQUILER', PAD, 29, { size: 7, color: [140, 140, 140], spacing: 0.8 });
    txt('C-2026-0001', PAD, 41, { size: 18, bold: true, color: C.white });

    // Badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);


    let Y = 58;

    // ─────────────────────────────────────────────────────────────────
    // 3. CLIENT DATA
    // ─────────────────────────────────────────────────────────────────
    fill(0, 48, W, 200, C.white);

    txt('DATOS DEL CLIENTE', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    [
      ['Nombre completo',    'Carlos Mendoza'],
      ['Correo electrónico', 'carlos@email.com'],
      ['Número de contacto', '+51 987 654 321'],
    ].forEach(([k, v]) => {
      txt(k, PAD, Y, { size: 8, color: C.textGray });
      txt(v, W - PAD, Y, { size: 9, bold: true, color: C.dark, align: 'right' });
      Y += 8;
    });

    Y += 2; hLine(Y); Y += 9;

    // ─────────────────────────────────────────────────────────────────
    // 4. VEHICLE
    // ─────────────────────────────────────────────────────────────────
    txt('VEHÍCULO ASIGNADO', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    txt('KIA Sportage 2023', PAD + 0, Y + 6, { size: 12, bold: true, color: C.dark });
    txt('Placa: TST-120    ·    Color: Gris', PAD + 0, Y + 13, { size: 8, color: C.textGray });

    Y += 20; hLine(Y); Y += 9;

    // ─────────────────────────────────────────────────────────────────
    // 5. DATES
    // ─────────────────────────────────────────────────────────────────
    txt('PERÍODO DE ALQUILER', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    const boxW = (CW - 12) / 2;

    rRect(PAD, Y, boxW, 16, 2, C.gray, C.border);
    txt('FECHA DE INICIO', PAD + 5, Y + 6, { size: 7, color: C.textGray, spacing: 0.5 });
    txt('15 de Febrero, 2026', PAD + 5, Y + 13, { size: 9.5, bold: true, color: C.dark });

    const fx = PAD + boxW + 14;
    rRect(fx, Y, boxW, 16, 2, C.gray, C.border);
    txt('FECHA FINAL', fx + 5, Y + 6, { size: 7, color: C.textGray, spacing: 0.5 });
    txt('22 de Febrero, 2026', fx + 5, Y + 13, { size: 9.5, bold: true, color: C.dark });

    Y += 23; hLine(Y); Y += 9;

    // ─────────────────────────────────────────────────────────────────
    // 6. TOTAL
    // ─────────────────────────────────────────────────────────────────
    txt('RESUMEN DE PAGO', PAD, Y, { size: 7, bold: true, color: C.green, spacing: 1.2 });
    Y += 2; hLine(Y, C.border, 0.2); Y += 7;

    rRect(PAD, Y, CW, 18, 2, C.gray);
    rRect(PAD, Y, 4, 18, 1, C.green);

    txt('TOTAL', PAD + 9, Y + 8, { size: 7.5, color: C.textGray, spacing: 0.5 });

    // S/ prefix
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...C.green);
    const totalStr = '980.00';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    const totalW2 = doc.getTextWidth(totalStr);
    doc.setFontSize(11);
    doc.text('S/', W - PAD - totalW2 - 5, Y + 14);

    txt(totalStr, W - PAD, Y + 14, { size: 20, bold: true, color: C.dark, align: 'right' });

    Y += 24;

    // Payment date
    rRect(PAD, Y, CW, 13, 2, C.greenLt);

    txt('FECHA DE PAGO', PAD + 10, Y + 7, { size: 7, bold: true, color: C.green, spacing: 0.8 });
    txt('14 de Febrero, 2026  —  10:45 AM', W - PAD - 10, Y + 7, { size: 9, bold: true, color: C.dark, align: 'right' });

    Y += 20;

    // ─────────────────────────────────────────────────────────────────
    // 7. FOOTER
    // ─────────────────────────────────────────────────────────────────
    hLine(Y, C.border, 0.25);
    Y += 7;

    txt('Documento válido como comprobante oficial de alquiler.', PAD, Y, { size: 7.5, color: [200, 200, 200] });
    txt('Rentify', W - PAD, Y, { size: 9, bold: true, color: C.green, align: 'right' });

    // ─────────────────────────────────────────────────────────────────
    doc.save('Comprobante-Rentify-C-2026-0001.pdf');

  } catch (err) {
    console.error(err);
    alert('No se pudo generar el PDF. ' + err.message);
  }

  btn.classList.remove('loading');
}