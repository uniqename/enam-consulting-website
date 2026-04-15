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
          style="flex:1;padding:12px;border:none;background:#f0fdf4;font-weight:700;font-size:12px;cursor:pointer;color:${DOXA_ACCENT};">
          Saved
        </button>
        <button id="tab-draw" onclick="switchTab('draw')"
          style="flex:1;padding:12px;border:none;background:#fafaf9;font-weight:700;font-size:12px;cursor:pointer;color:#78716c;">
          Draw
        </button>
        <button id="tab-upload" onclick="switchTab('upload')"
          style="flex:1;padding:12px;border:none;background:#fafaf9;font-weight:700;font-size:12px;cursor:pointer;color:#78716c;">
          Upload
        </button>
      </div>

      <!-- Insert confirmation bar -->
      <div id="sig-confirm" style="display:none;background:#f0fdf4;border-bottom:1px solid #d1fae5;padding:10px 20px;font-size:12px;color:#059669;font-weight:600;align-items:center;gap:8px;flex-wrap:wrap;justify-content:center;">
        <span>✓ Signature placed!</span>
        <button onclick="startNewSigner()" style="padding:3px 12px;border:1px solid #059669;border-radius:20px;background:#fff;color:#059669;font-size:11px;font-weight:700;cursor:pointer;">+ New signer</button>
        <button onclick="closeSigModal()" style="padding:3px 12px;border:1px solid #059669;border-radius:20px;background:#059669;color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Done</button>
      </div>

      <!-- Saved signature panel -->
      <div id="panel-saved" style="padding:24px;text-align:center;">
        <p style="font-size:12px;color:#78716c;margin-bottom:12px;">Your saved signature — select a size then click Insert. Drag the green handle to resize after placing.</p>
        <div style="border:2px dashed #d6d3d1;border-radius:8px;padding:20px;background:#fafaf9;margin-bottom:16px;min-height:60px;display:flex;align-items:center;justify-content:center;">
          <p id="no-saved-sig-msg" style="font-size:12px;color:#a8a29e;margin:0;">No saved signature yet — Draw or Upload one, then click "Save as default".</p>
          <img id="sig-preview" src="" style="max-height:80px;object-fit:contain;display:none;" />
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
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;margin-bottom:8px;">
          <button onclick="clearCanvas()" style="padding:7px 18px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Clear</button>
          <button onclick="insertDrawnSig()"
            style="background:${DOXA_ACCENT};color:#fff;border:none;padding:8px 22px;border-radius:20px;font-weight:700;font-size:13px;cursor:pointer;">
            Insert Drawn Signature
          </button>
        </div>
        <button id="save-drawn-btn" onclick="saveDrawnAsDefault()" style="display:none;padding:6px 18px;border:2px dashed #d6d3d1;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;margin-bottom:8px;">
          ⭐ Save as my default signature
        </button>
      </div>

      <!-- Upload signature panel -->
      <div id="panel-upload" style="display:none;padding:24px;text-align:center;">
        <p style="font-size:12px;color:#78716c;margin-bottom:12px;">Upload a PNG or JPG of your signature</p>
        <label style="display:inline-block;padding:10px 24px;border:2px dashed #d6d3d1;border-radius:12px;cursor:pointer;background:#fafaf9;font-size:13px;font-weight:700;color:#78716c;margin-bottom:12px;">
          Choose image
          <input id="sig-upload-input" type="file" accept="image/*" onchange="handleSigUpload(event)" style="display:none;" />
        </label>
        <div id="sig-upload-preview" style="display:none;margin-bottom:16px;">
          <img id="sig-upload-img" style="max-height:100px;max-width:100%;object-fit:contain;border:1px solid #e7e5e4;border-radius:8px;padding:8px;" />
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:8px;">
          <button onclick="setSigSize('small')"  id="sz-small-u"  style="padding:6px 14px;border:2px solid ${DOXA_ACCENT};border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#f0fdf4;color:${DOXA_ACCENT};">Small</button>
          <button onclick="setSigSize('medium')" id="sz-medium-u" style="padding:6px 14px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Medium</button>
          <button onclick="setSigSize('large')"  id="sz-large-u"  style="padding:6px 14px;border:2px solid #d6d3d1;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">Large</button>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          <button id="sig-upload-btn" onclick="insertUploadedSig()" style="display:none;background:${DOXA_ACCENT};color:#fff;border:none;padding:10px 28px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;">
            Insert Signature
          </button>
          <button id="save-upload-btn" onclick="saveUploadedAsDefault()" style="display:none;padding:6px 18px;border:2px dashed #d6d3d1;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;background:#fff;color:#78716c;">
            ⭐ Save as my default
          </button>
        </div>
      </div>

    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  initCanvas();
})();

/* ── State ──────────────────────────────────────────────────────────────── */
let _savedRange   = null;   // cursor position before modal opened
let _sigSize      = 'small';
let _uploadedSrc  = null;   // data URL of uploaded signature image
const SIG_SIZES   = { small: 40, medium: 65, large: 100 };

/* ── Signature modal open/close ─────────────────────────────────────────── */
function openSignatureModal() {
  var sel = window.getSelection();
  if (sel && sel.rangeCount) _savedRange = sel.getRangeAt(0).cloneRange();

  // Refresh saved-sig preview from localStorage
  var localSig  = localStorage.getItem('doxa_saved_signature');
  var preview   = document.getElementById('sig-preview');
  var noSigMsg  = document.getElementById('no-saved-sig-msg');
  if (localSig) {
    if (preview)  { preview.src = localSig; preview.style.display = 'block'; }
    if (noSigMsg) noSigMsg.style.display = 'none';
  } else {
    if (preview)  preview.style.display = 'none';
    if (noSigMsg) noSigMsg.style.display = 'block';
  }

  document.getElementById('sig-overlay').style.display = 'flex';
  switchTab('saved');
}

function closeSigModal() {
  document.getElementById('sig-overlay').style.display = 'none';
  var bar = document.getElementById('sig-confirm');
  if (bar) bar.style.display = 'none';
}

/* ── Start a fresh signature for a new signer ────────────────────────────── */
function startNewSigner() {
  clearCanvas();
  _uploadedSrc = null;
  var preview = document.getElementById('sig-upload-preview');
  var btn     = document.getElementById('sig-upload-btn');
  var inp     = document.getElementById('sig-upload-input');
  if (preview) preview.style.display = 'none';
  if (btn)     btn.style.display     = 'none';
  if (inp)     inp.value             = '';
  var bar = document.getElementById('sig-confirm');
  if (bar) bar.style.display = 'none';
  switchTab('draw');
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */
function switchTab(tab) {
  ['saved', 'draw', 'upload'].forEach(function(t) {
    var panel = document.getElementById('panel-' + t);
    var btn   = document.getElementById('tab-' + t);
    var active = t === tab;
    if (panel) panel.style.display = active ? 'block' : 'none';
    if (btn) {
      btn.style.background = active ? '#f0fdf4' : '#fafaf9';
      btn.style.color      = active ? DOXA_ACCENT : '#78716c';
    }
  });
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
  var pr = document.getElementById('sig-preview');
  if (pr) pr.style.maxHeight = SIG_SIZES[size] + 'px';
}

/* ── Core: insert a resizable signature at cursor ────────────────────────── */
function insertSigAtCursor(src, h) {
  var id = 'sig_' + Date.now();
  var html = [
    '<span id="', id, '" contenteditable="false" class="sig-node" ',
    'style="display:inline-block;position:relative;vertical-align:middle;',
    'user-select:none;-webkit-user-select:none;line-height:0;margin:0 2px;">',
    '<img src="', src, '" style="height:', h, 'px;width:auto;display:block;" draggable="false" />',
    // resize handle
    '<span class="sig-resize" ',
    'style="position:absolute;bottom:-5px;right:-5px;width:12px;height:12px;',
    'background:', DOXA_ACCENT, ';border-radius:50%;cursor:se-resize;',
    'display:block;z-index:10;box-shadow:0 1px 3px rgba(0,0,0,.3);" title="Drag to resize"></span>',
    // delete button
    '<span onclick="this.parentNode.remove()" ',
    'style="position:absolute;top:-7px;right:-7px;width:16px;height:16px;',
    'background:#ef4444;border-radius:50%;cursor:pointer;color:#fff;',
    'font-size:10px;line-height:16px;text-align:center;',
    'z-index:10;display:block;box-shadow:0 1px 3px rgba(0,0,0,.3);" ',
    'title="Remove signature">×</span>',
    '</span>',
  ].join('');

  insertAtCursor(html);

  // Attach resize drag handler after DOM insertion
  setTimeout(function() {
    var wrapper = document.getElementById(id);
    if (!wrapper) return;
    var handle = wrapper.querySelector('.sig-resize');
    var img    = wrapper.querySelector('img');
    if (!handle || !img) return;
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault(); e.stopPropagation();
      var startY = e.clientY, startH = img.offsetHeight;
      function onMove(e) {
        img.style.height = Math.max(15, startH + (e.clientY - startY)) + 'px';
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }, 60);

  // Show confirmation bar; don't close the modal
  var bar = document.getElementById('sig-confirm');
  if (bar) bar.style.display = 'flex';
}

/* ── Insert saved signature ──────────────────────────────────────────────── */
function insertSavedSig() {
  var src = localStorage.getItem('doxa_saved_signature');
  if (!src) { switchTab('draw'); return; } // no saved sig — go draw one
  insertSigAtCursor(src, SIG_SIZES[_sigSize]);
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

  function showSaveBtn() {
    var btn = document.getElementById('save-drawn-btn');
    if (btn) { btn.style.display = 'inline-block'; btn.textContent = '⭐ Save as my default signature'; }
  }
  canvas.addEventListener('mousedown',  function(e) { drawing = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('mousemove',  function(e) { if (!drawing) return; ctx.lineWidth = 2; ctx.strokeStyle = '#1c1917'; ctx.lineCap = 'round'; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup',    function() { if (drawing) showSaveBtn(); drawing = false; });
  canvas.addEventListener('mouseleave', function() { drawing = false; });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); drawing = true; ctx.beginPath(); const p = pos(e); ctx.moveTo(p.x, p.y); }, { passive: false });
  canvas.addEventListener('touchmove',  function(e) { e.preventDefault(); if (!drawing) return; ctx.lineWidth = 2; ctx.strokeStyle = '#1c1917'; ctx.lineCap = 'round'; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }, { passive: false });
  canvas.addEventListener('touchend',   function() { if (drawing) showSaveBtn(); drawing = false; });
}

function clearCanvas() {
  const canvas = document.getElementById('sig-canvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  var btn = document.getElementById('save-drawn-btn');
  if (btn) btn.style.display = 'none';
}

function insertDrawnSig() {
  var canvas = document.getElementById('sig-canvas');
  insertSigAtCursor(canvas.toDataURL('image/png'), SIG_SIZES[_sigSize]);
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

/* ── Save drawn / uploaded sig as default ────────────────────────────────── */
function saveDrawnAsDefault() {
  var canvas = document.getElementById('sig-canvas');
  if (!canvas) return;
  localStorage.setItem('doxa_saved_signature', canvas.toDataURL('image/png'));
  var btn = document.getElementById('save-drawn-btn');
  if (btn) btn.textContent = '✓ Saved as default!';
}

function saveUploadedAsDefault() {
  if (!_uploadedSrc) return;
  localStorage.setItem('doxa_saved_signature', _uploadedSrc);
  var btn = document.getElementById('save-upload-btn');
  if (btn) btn.textContent = '✓ Saved as default!';
}

/* ── Upload signature image ──────────────────────────────────────────────── */
function handleSigUpload(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    _uploadedSrc = ev.target.result;
    var preview  = document.getElementById('sig-upload-preview');
    var img      = document.getElementById('sig-upload-img');
    var btn      = document.getElementById('sig-upload-btn');
    var saveBtn  = document.getElementById('save-upload-btn');
    if (img)     img.src = _uploadedSrc;
    if (preview) preview.style.display = 'block';
    if (btn)     btn.style.display = 'inline-block';
    if (saveBtn) { saveBtn.style.display = 'inline-block'; saveBtn.textContent = '⭐ Save as my default'; }
  };
  reader.readAsDataURL(file);
}

function insertUploadedSig() {
  if (!_uploadedSrc) return;
  insertSigAtCursor(_uploadedSrc, SIG_SIZES[_sigSize]);
}

/* ── Edit / Preview toggle ───────────────────────────────────────────────── */
(function injectEditToggle() {
  document.addEventListener('DOMContentLoaded', function() {
    /* Make images inside contenteditable non-blocking; suppress browser print headers */
    var style = document.createElement('style');
    style.textContent = [
      '[contenteditable] img { pointer-events: none; user-select: none; }',
      '[contenteditable]:hover:not(:focus-within) { outline: 1px dashed rgba(0,0,0,.12); outline-offset: 2px; }',
      '[contenteditable]:focus-within { outline: 2px solid ' + DOXA_ACCENT + '; outline-offset: 2px; }',
      '[contenteditable] { cursor: text; }',
      '@media print { @page { margin: 0; } body { padding: 18mm 20mm; } .toolbar { display: none; } }',
    ].join('\n');
    document.head.appendChild(style);

    var toolbar = document.querySelector('.toolbar');
    if (!toolbar) return;

    var btn = document.createElement('button');
    var inPreview = false;

    function update() {
      var editables = document.querySelectorAll('[contenteditable]');
      editables.forEach(function(el) { el.contentEditable = inPreview ? 'false' : 'true'; });
      btn.textContent = inPreview ? '✏️ Edit' : '👁 Preview';
      btn.style.background   = inPreview ? '#374151' : '#fff';
      btn.style.color        = inPreview ? '#fff'    : '#374151';
      btn.style.borderColor  = inPreview ? '#374151' : '#d6d3d1';
    }

    btn.style.cssText = 'padding:8px 18px;border:2px solid #d6d3d1;border-radius:50px;cursor:pointer;font-size:13px;font-weight:700;transition:all .15s;';
    btn.onclick = function() { inPreview = !inPreview; update(); };
    update();

    var note = toolbar.querySelector('.toolbar-note');
    if (note) toolbar.insertBefore(btn, note);
    else toolbar.appendChild(btn);
  });
})();

/* ── Close modal on overlay click ────────────────────────────────────────── */
document.addEventListener('click', function(e) {
  const overlay = document.getElementById('sig-overlay');
  if (e.target === overlay) closeSigModal();
});
