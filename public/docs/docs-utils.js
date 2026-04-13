/* ─── Doxa & Co — Document Utilities ───────────────────────────────────────
   Provides: signature insertion (saved + draw), Save as Word, Save as PDF
   Injected into every doc via <script src="docs-utils.js"></script>
─────────────────────────────────────────────────────────────────────────── */

const DOXA_ACCENT   = '#059669';
const SIG_IMAGE_URL = '../assets/images/enam-signature.png';

/* ── Inject modal HTML once ─────────────────────────────────────────────── */
(function injectModal() {
  const html = `
  <div id="sig-overlay" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);align-items:center;justify-content:center;">
    <div style="background:#fff;border-radius:16px;width:480px;max-width:95vw;box-shadow:0 8px 40px rgba(0,0,0,.2);overflow:hidden;font-family:'Helvetica Neue',Arial,sans-serif;">

      <!-- Header -->
      <div style="background:${DOXA_ACCENT};color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:800;font-size:16px;">✍️ Sign Document</span>
        <button onclick="closeSigModal()" style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Tabs -->
      <div style="display:flex;border-bottom:2px solid #e7e5e4;">
        <button id="tab-saved" onclick="switchTab('saved')"
          style="flex:1;padding:12px;border:none;background:#f0fdf4;font-weight:700;font-size:13px;cursor:pointer;color:${DOXA_ACCENT};">
          Use Saved Signature
        </button>
        <button id="tab-draw" onclick="switchTab('draw')"
          style="flex:1;padding:12px;border:none;background:#fafaf9;font-weight:700;font-size:13px;cursor:pointer;color:#78716c;">
          Draw Signature
        </button>
      </div>

      <!-- Saved signature panel -->
      <div id="panel-saved" style="padding:24px;text-align:center;">
        <p style="font-size:12px;color:#78716c;margin-bottom:12px;">Your saved signature — select a size then click Insert</p>
        <div style="border:2px dashed #d6d3d1;border-radius:8px;padding:20px;background:#fafaf9;margin-bottom:16px;">
          <img id="sig-preview" src="${SIG_IMAGE_URL}" style="max-height:80px;object-fit:contain;" />
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px;">
          <button onclick="setSigSize('small')"  id="sz-small"  class="sz-btn" style="padding:6px 14px;border:2px solid ${DOXA_ACCENT};border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#f0fdf4;color:${DOXA_ACCENT};">Small</button>
          <button onclick="setSigSize('medium')" id="sz-medium" class="sz-btn" style="padding:6px 14px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Medium</button>
          <button onclick="setSigSize('large')"  id="sz-large"  class="sz-btn" style="padding:6px 14px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Large</button>
        </div>
        <button onclick="insertSavedSig()"
          style="background:${DOXA_ACCENT};color:#fff;border:none;padding:10px 28px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;">
          Insert Signature
        </button>
      </div>

      <!-- Draw signature panel -->
      <div id="panel-draw" style="display:none;padding:24px;text-align:center;">
        <p style="font-size:12px;color:#78716c;margin-bottom:10px;">Draw your signature below using mouse or finger</p>
        <canvas id="sig-canvas" width="420" height="130"
          style="border:2px solid #d6d3d1;border-radius:8px;background:#fff;cursor:crosshair;touch-action:none;max-width:100%;"></canvas>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;margin-bottom:16px;">
          <button onclick="clearCanvas()" style="padding:7px 18px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Clear</button>
          <button onclick="insertDrawnSig()"
            style="background:${DOXA_ACCENT};color:#fff;border:none;padding:8px 22px;border-radius:20px;font-weight:700;font-size:13px;cursor:pointer;">
            Insert Drawn Signature
          </button>
        </div>
      </div>

    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  initCanvas();
})();

/* ── State ──────────────────────────────────────────────────────────────── */
let _savedRange  = null;   // cursor position before modal opened
let _sigSize     = 'small';
const SIG_SIZES  = { small: 80, medium: 130, large: 200 };

/* ── Signature modal open/close ─────────────────────────────────────────── */
function openSignatureModal() {
  // Save cursor position
  const sel = window.getSelection();
  if (sel && sel.rangeCount) _savedRange = sel.getRangeAt(0).cloneRange();
  document.getElementById('sig-overlay').style.display = 'flex';
  switchTab('saved');
}

function closeSigModal() {
  document.getElementById('sig-overlay').style.display = 'none';
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */
function switchTab(tab) {
  const isSaved = tab === 'saved';
  document.getElementById('panel-saved').style.display = isSaved ? 'block' : 'none';
  document.getElementById('panel-draw').style.display  = isSaved ? 'none'  : 'block';
  document.getElementById('tab-saved').style.background = isSaved ? '#f0fdf4' : '#fafaf9';
  document.getElementById('tab-saved').style.color      = isSaved ? DOXA_ACCENT : '#78716c';
  document.getElementById('tab-draw').style.background  = isSaved ? '#fafaf9' : '#f0fdf4';
  document.getElementById('tab-draw').style.color       = isSaved ? '#78716c' : DOXA_ACCENT;
}

/* ── Size selector ───────────────────────────────────────────────────────── */
function setSigSize(size) {
  _sigSize = size;
  ['small','medium','large'].forEach(function(s) {
    const btn = document.getElementById('sz-' + s);
    const active = s === size;
    btn.style.borderColor = active ? DOXA_ACCENT : '#d6d3d1';
    btn.style.background  = active ? '#f0fdf4'   : '#fff';
    btn.style.color       = active ? DOXA_ACCENT : '#78716c';
  });
  document.getElementById('sig-preview').style.maxHeight = SIG_SIZES[size] + 'px';
}

/* ── Insert saved signature ──────────────────────────────────────────────── */
function insertSavedSig() {
  const h = SIG_SIZES[_sigSize];
  const imgHtml = '<img src="' + SIG_IMAGE_URL + '" style="height:' + h + 'px;vertical-align:middle;display:inline-block;" />';
  insertAtCursor(imgHtml);
  closeSigModal();
}

/* ── Canvas drawing ──────────────────────────────────────────────────────── */
function initCanvas() {
  const canvas = document.getElementById('sig-canvas');
  const ctx    = canvas.getContext('2d');
  let drawing  = false;

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) };
  }

  canvas.addEventListener('mousedown',  function(e) { drawing = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('mousemove',  function(e) { if (!drawing) return; ctx.lineWidth = 2; ctx.strokeStyle = '#1c1917'; ctx.lineCap = 'round'; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup',    function() { drawing = false; });
  canvas.addEventListener('mouseleave', function() { drawing = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); drawing = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove',  function(e) { e.preventDefault(); if (!drawing) return; ctx.lineWidth = 2; ctx.strokeStyle = '#1c1917'; ctx.lineCap = 'round'; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
  canvas.addEventListener('touchend',   function() { drawing = false; });
}

function clearCanvas() {
  const canvas = document.getElementById('sig-canvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function insertDrawnSig() {
  const canvas = document.getElementById('sig-canvas');
  const dataUrl = canvas.toDataURL('image/png');
  const h = SIG_SIZES[_sigSize];
  const imgHtml = '<img src="' + dataUrl + '" style="height:' + h + 'px;vertical-align:middle;display:inline-block;" />';
  insertAtCursor(imgHtml);
  closeSigModal();
}

/* ── Insert HTML at saved cursor position ────────────────────────────────── */
function insertAtCursor(html) {
  const sel = window.getSelection();
  if (_savedRange) {
    sel.removeAllRanges();
    sel.addRange(_savedRange);
  }
  document.execCommand('insertHTML', false, html);
}

/* ── Save as Word (.doc) ─────────────────────────────────────────────────── */
function saveAsWord() {
  const body   = document.querySelector('.doc-body');
  const title  = document.title || 'Doxa-Document';
  const header = '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>' + title + '</title><style>body{font-family:Georgia,serif;font-size:11pt;line-height:1.75;color:#1c1917;}table{border-collapse:collapse;width:100%;}td,th{border:1px solid #ccc;padding:6pt 10pt;}</style></head><body>';
  const footer = '</body></html>';
  const content = body ? body.innerHTML : '';
  const blob  = new Blob([header + content + footer], { type: 'application/msword' });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement('a');
  a.href      = url;
  a.download  = title.replace(/[^a-z0-9]/gi, '_') + '.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Close modal on overlay click ────────────────────────────────────────── */
document.addEventListener('click', function(e) {
  const overlay = document.getElementById('sig-overlay');
  if (e.target === overlay) closeSigModal();
});
