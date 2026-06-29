/**
 * Doxa & Co — Document Editor
 * Injected into all consulting document HTML files.
 * Provides: editable fields, signature pad, print-to-PDF, Word download, localStorage persistence.
 */
(function () {
  'use strict';

  const DOC_KEY = 'doxadoc_' + location.pathname;
  const DOCX_MAP = {
    '08_Session_Fee_Agreement':      '08_Session_Fee_Agreement.docx',
    '09_Retainer_Agreement':         '09_Retainer_Agreement.docx',
    '10_Change_Order_Form':          '10_Change_Order_Form.docx',
    '11_Client_Intake_Form':         '11_Client_Intake_Form.docx',
    '12_Onboarding_Welcome_And_Kickoff': '12_Onboarding_Welcome_And_Kickoff.docx',
    '13_Project_Closeout_Report':    '13_Project_Closeout_Report.docx',
  };

  // ── Derive filename key from URL ───────────────────────────────────────
  function getDocKey() {
    const parts = location.pathname.split('/');
    const fname = parts[parts.length - 1].replace('.html', '');
    return fname;
  }

  // ── Inject print-hide styles ───────────────────────────────────────────
  function injectPrintStyles() {
    const s = document.createElement('style');
    s.textContent = `
      #doxa-action-bar, #doxa-sig-modal, #doxa-toast { display: none !important; }
      [contenteditable="true"] { outline: none !important; border: none !important; }
    `;
    s.media = 'print';
    document.head.appendChild(s);

    // Also style editable areas visually (screen only)
    const s2 = document.createElement('style');
    s2.textContent = `
      @media screen {
        [contenteditable="true"]:not([data-sig]) {
          outline: 1.5px dashed #C9A44A !important;
          border-radius: 3px;
          min-height: 1em;
          cursor: text;
          transition: outline-color 0.15s;
        }
        [contenteditable="true"]:not([data-sig]):focus {
          outline: 2px solid #059669 !important;
          background: #f0fdf4 !important;
        }
        [data-sig] {
          cursor: pointer !important;
          border: 1.5px dashed #a8a29e;
          border-radius: 6px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 4px 8px;
          transition: border-color 0.15s, background 0.15s;
        }
        [data-sig]:hover {
          border-color: #1c1917;
          background: #fafaf9;
        }
        [data-sig] img { max-height: 44px; max-width: 240px; display: block; }
        #doxa-action-bar {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 9999;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        #doxa-action-bar button, #doxa-action-bar a {
          padding: 9px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: opacity 0.15s, transform 0.1s;
        }
        #doxa-action-bar button:hover, #doxa-action-bar a:hover { opacity: 0.85; transform: translateY(-1px); }
        #btn-print { background: #1c1917; color: white; }
        #btn-docx  { background: #059669; color: white; }
        #btn-clear { background: white; color: #78716c; border: 1px solid #e7e5e0 !important; }
        #btn-back  { background: white; color: #78716c; border: 1px solid #e7e5e0 !important; }

        #doxa-sig-modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #doxa-sig-inner {
          background: white;
          border-radius: 18px;
          padding: 28px 28px 24px;
          max-width: 500px;
          width: 92%;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2);
        }
        #doxa-sig-inner h3 {
          font-family: Georgia, serif;
          font-size: 17px;
          color: #1c1917;
          margin: 0 0 14px;
        }
        #doxa-sig-canvas {
          display: block;
          border: 1px solid #e7e5e0;
          border-radius: 10px;
          cursor: crosshair;
          width: 100%;
          touch-action: none;
          background: #fafaf9;
        }
        #doxa-sig-hint {
          font-size: 11px;
          color: #a8a29e;
          margin: 6px 0 16px;
          font-style: italic;
        }
        .sig-btn-row { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
        .sig-btn-row button {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        #sig-btn-clear  { background: white; border: 1px solid #e7e5e0; color: #78716c; }
        #sig-btn-cancel { background: white; border: 1px solid #e7e5e0; color: #78716c; }
        #sig-btn-apply  { background: #1c1917; border: none; color: white; }

        #doxa-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #1c1917;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          z-index: 10001;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
      }
    `;
    document.head.appendChild(s2);
  }

  // ── Make text-input areas editable ────────────────────────────────────
  function makeEditable() {
    // Writein boxes and write-boxes
    document.querySelectorAll('.writein, .write-box').forEach(el => {
      if (el.innerHTML.trim() === '&nbsp;' || el.innerHTML.trim() === '\u00a0') {
        el.innerHTML = '';
      }
      el.contentEditable = 'true';
      el.setAttribute('placeholder', 'Click to type…');
    });

    // Fill table value cells (second column)
    document.querySelectorAll('.fill-table tr').forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const last = cells[cells.length - 1];
        if (last.innerHTML.trim() === '&nbsp;' || last.innerHTML.trim() === '\u00a0') {
          last.innerHTML = '';
        }
        last.contentEditable = 'true';
      }
    });

    // Impact box write-in lines
    document.querySelectorAll('.writein-sm').forEach(el => {
      el.contentEditable = 'true';
    });
  }

  // ── Convert sig-line / pre-sign into clickable signature targets ──────
  function makeSignatureAreas(sigPad) {
    document.querySelectorAll('.pre-sign').forEach(el => {
      el.setAttribute('data-sig', '1');
      el.title = 'Click to add signature';
      el.addEventListener('click', () => sigPad.open(el));
    });
  }

  // ── Signature Pad ─────────────────────────────────────────────────────
  function createSignaturePad() {
    const modal = document.createElement('div');
    modal.id = 'doxa-sig-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div id="doxa-sig-inner">
        <h3>Draw Your Signature</h3>
        <canvas id="doxa-sig-canvas" width="440" height="140"></canvas>
        <p id="doxa-sig-hint">Draw with mouse or finger. Click Apply when done.</p>
        <div class="sig-btn-row">
          <button id="sig-btn-clear">Clear</button>
          <button id="sig-btn-cancel">Cancel</button>
          <button id="sig-btn-apply">Apply Signature</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const canvas = document.getElementById('doxa-sig-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let activeTarget = null;

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / rect.width;
      const sy = canvas.height / rect.height;
      const src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      ctx.beginPath();
      const p = getPos(e);
      ctx.moveTo(p.x, p.y);
    }
    function draw(e) {
      e.preventDefault();
      if (!drawing) return;
      const p = getPos(e);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    function stopDraw() { drawing = false; }

    canvas.addEventListener('mousedown',  startDraw);
    canvas.addEventListener('mousemove',  draw);
    canvas.addEventListener('mouseup',    stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove',  draw,      { passive: false });
    canvas.addEventListener('touchend',   stopDraw);

    document.getElementById('sig-btn-clear').onclick  = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('sig-btn-cancel').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('sig-btn-apply').onclick  = () => {
      const dataUrl = canvas.toDataURL('image/png');
      if (activeTarget) {
        activeTarget.innerHTML = `<img src="${dataUrl}" alt="Signature" style="max-height:44px;max-width:220px;display:block;">`;
        saveToStorage();
        showToast('Signature applied');
      }
      modal.style.display = 'none';
    };

    return {
      open(target) {
        activeTarget = target;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        modal.style.display = 'flex';
      }
    };
  }

  // ── Action Bar ────────────────────────────────────────────────────────
  function createActionBar() {
    const bar = document.createElement('div');
    bar.id = 'doxa-action-bar';

    const docName = getDocKey();
    const docxFile = DOCX_MAP[docName] || (docName + '.docx');

    bar.innerHTML = `
      <button id="btn-print">🖨 Print / PDF</button>
      <a id="btn-docx" href="/docs/${docxFile}" download>⬇ Word (.docx)</a>
      <button id="btn-clear">↺ Reset</button>
      <button id="btn-back">← Back to Tools</button>`;
    document.body.appendChild(bar);

    document.getElementById('btn-print').onclick = () => window.print();
    document.getElementById('btn-clear').onclick = () => {
      if (!confirm('Clear all entered data and signatures? This cannot be undone.')) return;
      localStorage.removeItem(DOC_KEY);
      location.reload();
    };
    document.getElementById('btn-back').onclick = () => { window.location.href = '/tools'; };
  }

  // ── Toast notification ────────────────────────────────────────────────
  function createToast() {
    const t = document.createElement('div');
    t.id = 'doxa-toast';
    document.body.appendChild(t);
  }

  function showToast(msg) {
    const t = document.getElementById('doxa-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    t.style.opacity = '1';
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => { t.style.display = 'none'; }, 300); }, 2200);
  }

  // ── localStorage persistence ──────────────────────────────────────────
  function saveToStorage() {
    const data = {};
    document.querySelectorAll('[contenteditable="true"]').forEach((el, i) => {
      data['e' + i] = el.innerHTML;
    });
    document.querySelectorAll('[data-sig]').forEach((el, i) => {
      data['s' + i] = el.innerHTML;
    });
    try { localStorage.setItem(DOC_KEY, JSON.stringify(data)); } catch (e) {}
    showToast('Saved');
  }

  function restoreFromStorage() {
    let saved;
    try { saved = localStorage.getItem(DOC_KEY); } catch (e) {}
    if (!saved) return;
    const data = JSON.parse(saved);
    document.querySelectorAll('[contenteditable="true"]').forEach((el, i) => {
      if (data['e' + i] !== undefined) el.innerHTML = data['e' + i];
    });
    document.querySelectorAll('[data-sig]').forEach((el, i) => {
      if (data['s' + i] !== undefined) el.innerHTML = data['s' + i];
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────
  function init() {
    injectPrintStyles();
    makeEditable();

    const sigPad = createSignaturePad();
    makeSignatureAreas(sigPad);
    createActionBar();
    createToast();
    restoreFromStorage();

    // Auto-save on input (debounced)
    let saveTimer;
    document.addEventListener('input', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(saveToStorage, 1200);
    });

    showToast('Click any field to edit · Click signature lines to sign');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
