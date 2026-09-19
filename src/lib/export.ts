import pptxgen from 'pptxgenjs';
import { PitchSlide, Venture } from '../types';

export async function exportPitchToPptx(venture: Venture): Promise<void> {
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9';
  pres.title = `${venture.name} — Investor Pitch`;
  pres.company = 'Venture Wicks';

  venture.slides.forEach((slide) => {
    const pSlide = pres.addSlide();
    pSlide.background = { color: 'FAF8F5' };

    // Brand header
    pSlide.addText('VENTURE WICKS  |  INVESTOR PITCH', {
      x: 0.8,
      y: 0.4,
      w: 8.0,
      h: 0.3,
      fontSize: 9,
      color: '883607',
      fontFace: 'Arial',
      bold: true
    });

    // Category / Slide count
    pSlide.addText(`SLIDE ${slide.slideNumber} OF 11  •  ${slide.category.toUpperCase().replace('_', ' ')}`, {
      x: 9.0,
      y: 0.4,
      w: 3.5,
      h: 0.3,
      fontSize: 9,
      align: 'right',
      color: '7D756C',
      fontFace: 'Arial'
    });

    // Slide Title
    pSlide.addText(slide.title, {
      x: 0.8,
      y: 0.9,
      w: 11.5,
      h: 0.6,
      fontSize: 26,
      color: '191716',
      fontFace: 'Georgia',
      bold: true
    });

    // Subtitle / Headline
    pSlide.addText(slide.headline || slide.subtitle, {
      x: 0.8,
      y: 1.5,
      w: 11.5,
      h: 0.5,
      fontSize: 14,
      color: 'D96B27',
      fontFace: 'Arial',
      italic: true
    });

    // Bullet points / Content
    const bulletItems = (slide.keyPoints || []).map((pt) => ({
      text: pt,
      options: { fontSize: 13, color: '2D2825', breakLine: true }
    }));

    if (bulletItems.length > 0) {
      pSlide.addText(bulletItems, {
        x: 0.8,
        y: 2.2,
        w: 6.8,
        h: 3.5,
        bullet: { code: '2022' },
        lineSpacing: 24,
        fontFace: 'Arial'
      });
    }

    // Right sidebar: Facts & Assumptions audit box
    pSlide.addShape(pres.ShapeType.rect, {
      x: 8.0,
      y: 2.2,
      w: 4.5,
      h: 3.8,
      fill: { color: 'F5F2EB' },
      line: { color: 'E2DCD4', width: 1 }
    });

    pSlide.addText('FACTS & VALIDATION AUDIT', {
      x: 8.2,
      y: 2.35,
      w: 4.1,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: '191716',
      fontFace: 'Arial'
    });

    let rightContent = '';
    if (slide.facts && slide.facts.length > 0) {
      rightContent += `[FACTS]:\n• ${slide.facts.join('\n• ')}\n\n`;
    }
    if (slide.assumptions && slide.assumptions.length > 0) {
      rightContent += `[ASSUMPTIONS]:\n• ${slide.assumptions.join('\n• ')}\n\n`;
    }
    if (slide.evidenceNeeded && slide.evidenceNeeded.length > 0) {
      rightContent += `[EVIDENCE NEEDED]:\n• ${slide.evidenceNeeded.join('\n• ')}`;
    }

    pSlide.addText(rightContent.trim() || 'All stated claims derived from founder questionnaire.', {
      x: 8.2,
      y: 2.7,
      w: 4.1,
      h: 3.2,
      fontSize: 10,
      color: '5C544E',
      fontFace: 'Arial'
    });

    // Speaker notes
    if (slide.speakerNotes) {
      pSlide.addNotes(slide.speakerNotes);
    }
  });

  await pres.writeFile({ fileName: `${venture.name.toLowerCase().replace(/\s+/g, '_')}_pitch_deck.pptx` });
}

export function exportPitchToPdf(venture: Venture): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF.');
    return;
  }

  const slidesHtml = venture.slides
    .map(
      (slide) => `
    <div style="page-break-after: always; padding: 48px; min-height: 95vh; background: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; border-bottom: 2px solid #E5DFD7;">
      <div>
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #E5DFD7; padding-bottom: 12px; margin-bottom: 24px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #883607; font-weight: 600;">
          <span>Venture Wicks &bull; ${venture.name}</span>
          <span style="color: #6E675F;">Slide ${slide.slideNumber} of 11 &bull; ${slide.category.replace('_', ' ')}</span>
        </div>
        <h1 style="font-family: Georgia, serif; font-size: 34px; color: #191716; margin: 0 0 8px 0;">${slide.title}</h1>
        <h3 style="font-size: 16px; color: #D96B27; font-weight: normal; font-style: italic; margin: 0 0 28px 0;">${slide.headline || slide.subtitle}</h3>
        
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
          <div>
            <h4 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: #5C544E; margin-bottom: 14px;">Core Thesis</h4>
            <ul style="line-height: 1.8; font-size: 14px; color: #2D2825; padding-left: 20px;">
              ${slide.keyPoints.map((pt) => `<li style="margin-bottom: 10px;">${pt}</li>`).join('')}
            </ul>
          </div>
          <div style="background: #F4EFE7; padding: 18px; border: 1px solid #E2DCD4; border-radius: 6px;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #191716; margin-bottom: 10px; border-bottom: 1px solid #DCD4C8; padding-bottom: 4px;">Factual Integrity Audit</div>
            ${slide.facts && slide.facts.length > 0 ? `<div style="margin-bottom: 10px;"><strong style="font-size: 10px; color: #166534;">PROVEN FACTS:</strong><div style="font-size: 11px; color: #3A3531;">${slide.facts.join('; ')}</div></div>` : ''}
            ${slide.assumptions && slide.assumptions.length > 0 ? `<div style="margin-bottom: 10px;"><strong style="font-size: 10px; color: #9A3412;">ASSUMPTIONS:</strong><div style="font-size: 11px; color: #3A3531;">${slide.assumptions.join('; ')}</div></div>` : ''}
            ${slide.evidenceNeeded && slide.evidenceNeeded.length > 0 ? `<div><strong style="font-size: 10px; color: #B91C1C;">EVIDENCE NEEDED:</strong><div style="font-size: 11px; color: #3A3531;">${slide.evidenceNeeded.join('; ')}</div></div>` : ''}
          </div>
        </div>
      </div>
      <div style="border-top: 1px solid #E5DFD7; padding-top: 12px; font-size: 11px; color: #7D756C; display: flex; justify-content: space-between;">
        <span>Prepared for investor presentation &bull; Confidential</span>
        <span>Generated by Venture Wicks</span>
      </div>
    </div>
  `
    )
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${venture.name} — Pitch Deck (Venture Wicks)</title>
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            @page { size: landscape; margin: 0; }
          }
        </style>
      </head>
      <body>
        ${slidesHtml}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
