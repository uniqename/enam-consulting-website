/**
 * DocConverterModal.tsx
 * Upload a PDF, Word, or image → converts it → opens as a full editable HTML
 * document in a new browser tab with a rich formatting toolbar, Doxa letterhead
 * (optional), editable header/body/footer, Print, Save as Word, and Sign.
 */

import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { X, Upload, FileText } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

// ─── Doxa brand ──────────────────────────────────────────────────────────────
const BRAND = {
  primary:  "#8B7030",
  accent:   "#059669",
  line:     "#C9A44A",
  bg:       "#fafaf9",
  footerBg: "#f0fdf4",
  footerBorder: "#bbf7d0",
  org:      "DOXA &amp; CO",
  orgPlain: "DOXA & CO",
  tagline:  "Strategy · Product · Delivery",
  contact:  "ename@doxaandco.co &nbsp;·&nbsp; doxaandco.co",
  footer:   "Doxa &amp; Co &nbsp;·&nbsp; doxaandco.co",
  footerRight: "Confidential — Internal Use",
  printBtn: "#059669",
  wordBtn:  "#2563eb",
  signBtn:  "#1c1917",
};

// ─── Build the full standalone HTML editor page ───────────────────────────────
function buildEditorPage(bodyHtml: string, withLetterhead: boolean, title: string): string {
  const letterheadHtml = withLetterhead
    ? `
  <div class="letterhead" contenteditable="true">
    <div class="letterhead-text">
      <div class="org-name">${BRAND.org}</div>
      <div class="tagline">${BRAND.tagline}</div>
    </div>
    <div class="letterhead-contact">${BRAND.contact}</div>
  </div>`
    : "";

  const footerHtml = withLetterhead
    ? `
  <div class="letterfoot" contenteditable="true">
    <span>${BRAND.footer}</span>
    <span>${BRAND.footerRight}</span>
  </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${title}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; background: #fafafa; color: #111; line-height: 1.75; }

  /* ── Toolbar ── */
  .toolbar {
    position: sticky; top: 0; z-index: 100;
    display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
    padding: 10px 20px; background: #fff; border-bottom: 1px solid #e7e5e4;
    box-shadow: 0 1px 4px rgba(0,0,0,.06);
  }
  .toolbar button {
    padding: 5px 11px; border: 1px solid #e7e5e4; border-radius: 6px;
    cursor: pointer; font-size: 13px; font-weight: 700; background: #fff;
    color: #374151; transition: background .12s, border-color .12s;
  }
  .toolbar button:hover { background: #f3f4f6; border-color: #d1d5db; }
  .toolbar select {
    padding: 5px 6px; border: 1px solid #e7e5e4; border-radius: 6px;
    font-size: 12px; color: #374151; background: #fff; cursor: pointer;
  }
  .toolbar .sep { width: 1px; height: 22px; background: #e7e5e4; margin: 0 2px; flex-shrink: 0; }
  .toolbar .action { padding: 6px 14px; border-radius: 50px; border: none; color: #fff; cursor: pointer; font-size: 13px; font-weight: 700; }
  .toolbar-note { margin-left: auto; font-size: 11px; color: #9ca3af; font-family: Arial, sans-serif; white-space: nowrap; }

  /* ── Page ── */
  .page { max-width: 860px; margin: 32px auto 64px; background: #fff;
          border: 1px solid #e7e5e4; border-radius: 12px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,.06); }

  /* ── Letterhead ── */
  .letterhead {
    display: flex; align-items: flex-start; gap: 20px;
    padding: 28px 40px; border-bottom: 4px solid ${BRAND.line};
    outline: none; cursor: text;
  }
  .letterhead { background: ${BRAND.bg}; }
  .letterhead:focus-within { background: #fffbeb; }
  .org-name { font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: ${BRAND.primary}; letter-spacing: 1px; }
  .tagline  { font-family: Arial, sans-serif; font-size: 12px; color: #6b7280; margin-top: 3px; }
  .letterhead-contact { margin-left: auto; text-align: right; font-family: Arial, sans-serif; font-size: 11px; color: #6b7280; line-height: 1.7; white-space: nowrap; }

  /* ── Doc body ── */
  .doc-body {
    outline: none; padding: 40px; min-height: 600px; cursor: text;
  }
  .doc-body p  { margin: 0.55em 0; }
  .doc-body h1 { font-size: 1.6rem; margin-top: 1.4em; margin-bottom: .4em; color: #1c1917; }
  .doc-body h2 { font-size: 1.2rem; margin-top: 1.3em; margin-bottom: .35em; color: #1c1917; }
  .doc-body h3 { font-size: 1rem;   margin-top: 1.1em; margin-bottom: .3em;  color: #1c1917; }
  .doc-body ul, .doc-body ol { margin: .55em 0; padding-left: 1.6em; }
  .doc-body table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: .93rem; }
  .doc-body td, .doc-body th { border: 1px solid #d6d3d1; padding: 9px 14px; vertical-align: top; }
  .doc-body th { background: ${BRAND.footerBg}; font-weight: 700; }
  .doc-body img { max-width: 100%; display: block; margin: 8px 0; }
  strong { font-weight: 700; }

  /* ── Footer ── */
  .letterfoot {
    padding: 18px 40px; border-top: 1px solid ${BRAND.footerBorder};
    font-family: Arial, sans-serif; font-size: 11px; color: #9ca3af;
    display: flex; justify-content: space-between; align-items: center; gap: 16px;
    background: ${BRAND.footerBg}; outline: none; cursor: text;
  }

  /* ── Signature modal ── */
  .sig-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:999; align-items:center; justify-content:center; }
  .sig-overlay.open { display:flex; }
  .sig-box { background:#fff; border-radius:16px; padding:28px; width:480px; max-width:95vw; }
  .sig-box h3 { font-size:16px; font-weight:700; margin-bottom:16px; }
  #sigCanvas { border: 2px dashed #d1d5db; border-radius:10px; cursor:crosshair; display:block; width:100%; }
  .sig-btns { display:flex; gap:10px; margin-top:14px; }
  .sig-btns button { flex:1; padding:10px; border-radius:8px; border:none; cursor:pointer; font-weight:700; font-size:13px; }
  .sig-insert { background:${BRAND.primary}; color:#fff; }
  .sig-clear  { background:#f3f4f6; color:#374151; }
  .sig-cancel { background:#f3f4f6; color:#374151; }

  @media print {
    .toolbar { display: none !important; }
    .sig-overlay { display: none !important; }
    .page { margin:0; border:none; border-radius:0; box-shadow:none; }
    body { background:#fff; }
  }
</style>
</head>
<body>

<!-- Toolbar -->
<div class="toolbar">
  <!-- Text formatting -->
  <button onclick="fmt('bold')"      title="Bold"><b>B</b></button>
  <button onclick="fmt('italic')"    title="Italic"><i>I</i></button>
  <button onclick="fmt('underline')" title="Underline"><u>U</u></button>
  <span class="sep"></span>
  <!-- Alignment -->
  <button onclick="fmt('justifyLeft')"   title="Align left"  >⬅</button>
  <button onclick="fmt('justifyCenter')" title="Center"      >↔</button>
  <button onclick="fmt('justifyRight')"  title="Align right" >➡</button>
  <button onclick="fmt('justifyFull')"   title="Justify"     style="letter-spacing:1px;">≡</button>
  <span class="sep"></span>
  <!-- Font size -->
  <select title="Font size" onchange="fmt('fontSize', this.value); this.value=''">
    <option value="">Size</option>
    <option value="1">Tiny (8pt)</option>
    <option value="2">Small (10pt)</option>
    <option value="3">Normal (12pt)</option>
    <option value="4">Medium (14pt)</option>
    <option value="5">Large (18pt)</option>
    <option value="6">XL (24pt)</option>
    <option value="7">XXL (36pt)</option>
  </select>
  <!-- Paragraph style -->
  <select title="Paragraph style" onchange="fmt('formatBlock', this.value); this.value=''">
    <option value="">Style</option>
    <option value="p">Normal</option>
    <option value="h1">Heading 1</option>
    <option value="h2">Heading 2</option>
    <option value="h3">Heading 3</option>
  </select>
  <!-- Font color -->
  <input type="color" title="Text colour" value="#111111"
    onchange="fmt('foreColor', this.value)" style="width:28px;height:28px;border:1px solid #e7e5e4;border-radius:6px;cursor:pointer;padding:1px;">
  <span class="sep"></span>
  <!-- Lists -->
  <button onclick="fmt('insertUnorderedList')" title="Bullet list">• List</button>
  <button onclick="fmt('insertOrderedList')"   title="Numbered list">1. List</button>
  <span class="sep"></span>
  <!-- Clear -->
  <button onclick="fmt('removeFormat')" title="Remove formatting" style="color:#9ca3af;">Tx</button>
  <span class="sep"></span>
  <!-- Actions -->
  <button class="action" style="background:${BRAND.printBtn};" onclick="window.print()">🖨️ Print / Save PDF</button>
  <button class="action" style="background:${BRAND.wordBtn};"  onclick="saveAsWord()">💾 Save as Word</button>
  <button class="action" style="background:${BRAND.signBtn};"  onclick="openSigModal()">✍️ Sign</button>
  <span class="toolbar-note">Click to edit · everything is editable</span>
</div>

<!-- Document page -->
<div class="page">
  ${letterheadHtml}
  <div class="doc-body" contenteditable="true">${bodyHtml}</div>
  ${footerHtml}
</div>

<!-- Signature modal -->
<div class="sig-overlay" id="sigOverlay">
  <div class="sig-box">
    <h3>✍️ Draw your signature</h3>
    <canvas id="sigCanvas" width="420" height="140"></canvas>
    <div class="sig-btns">
      <button class="sig-insert" onclick="insertSig()">Insert Signature</button>
      <button class="sig-clear"  onclick="clearSig()">Clear</button>
      <button class="sig-cancel" onclick="closeSigModal()">Cancel</button>
    </div>
  </div>
</div>

<script>
  // ── Rich text formatting ──────────────────────────────────────────────────
  function fmt(cmd, val) {
    document.execCommand(cmd, false, val || null);
  }

  // ── Save as Word ──────────────────────────────────────────────────────────
  function saveAsWord() {
    const page = document.querySelector('.page');
    const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>' + page.innerHTML + '</body></html>';
    const blob = new Blob([html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '${title.replace(/\.[^.]+$/, "")}.doc';
    a.click();
  }

  // ── Signature modal ───────────────────────────────────────────────────────
  let sigDrawing = false;
  const overlay  = document.getElementById('sigOverlay');
  const canvas   = document.getElementById('sigCanvas');
  const ctx      = canvas.getContext('2d');

  function initCanvas() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  function openSigModal()  { overlay.classList.add('open');    initCanvas(); }
  function closeSigModal() { overlay.classList.remove('open'); }
  function clearSig()      { initCanvas(); }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return {
      x: (t.clientX - rect.left) * (canvas.width  / rect.width),
      y: (t.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  canvas.addEventListener('mousedown',  e => { const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); sigDrawing=true; });
  canvas.addEventListener('mousemove',  e => { if(!sigDrawing) return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
  canvas.addEventListener('mouseup',    () => sigDrawing = false);
  canvas.addEventListener('mouseleave', () => sigDrawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); sigDrawing=true; });
  canvas.addEventListener('touchmove',  e => { e.preventDefault(); if(!sigDrawing) return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
  canvas.addEventListener('touchend',   () => sigDrawing = false);

  function insertSig() {
    const dataUrl = canvas.toDataURL('image/png');
    const img = '<img src="' + dataUrl + '" style="max-width:220px;max-height:70px;display:inline-block;vertical-align:middle;" alt="Signature"/>';
    document.execCommand('insertHTML', false, img);
    closeSigModal();
  }

  // Close overlay on backdrop click
  overlay.addEventListener('click', e => { if(e.target === overlay) closeSigModal(); });
</script>
</body>
</html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { onClose: () => void }

export default function DocConverterModal({ onClose }: Props) {
  const [docFile, setDocFile]   = useState<File | null>(null);
  const [docType, setDocType]   = useState<string | null>(null);
  const [letterhead, setLetterhead] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [notif, setNotif]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotif = (msg: string) => { setNotif(msg); setTimeout(() => setNotif(null), 3000); };

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (ext === "pdf")                            { setDocFile(file); setDocType("pdf"); }
    else if (ext === "docx" || ext === "doc")     { setDocFile(file); setDocType("word"); }
    else if (/^(png|jpe?g|webp|gif)$/.test(ext)) { setDocFile(file); setDocType("image"); }
    else { showNotif("Unsupported format. Use PDF, DOCX, or image."); }
  };

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  const openEditor = async () => {
    if (!docFile) return;
    setLoading(true);
    try {
      let bodyHtml = "";

      if (docType === "word") {
        const ab = await docFile.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer: ab });
        bodyHtml = value || "<p>Your document content appears here. Click to edit.</p>";

      } else if (docType === "pdf") {
        const ab = await docFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        const imgs: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 2 });
          const c = document.createElement("canvas");
          c.width = vp.width; c.height = vp.height;
          await pg.render({ canvas: c, viewport: vp }).promise;
          imgs.push(`<img src="${c.toDataURL()}" style="width:100%;display:block;margin-bottom:8px;" alt="Page ${i}"/>`);
        }
        bodyHtml = imgs.join("\n");

      } else if (docType === "image") {
        const dataUrl = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target!.result as string);
          reader.readAsDataURL(docFile);
        });
        bodyHtml = `<img src="${dataUrl}" style="max-width:100%;" alt="${docFile.name}"/>`;
      }

      const title = docFile.name.replace(/\.[^.]+$/, "");
      const html  = buildEditorPage(bodyHtml, letterhead, title);
      const blob  = new Blob([html], { type: "text/html" });
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      console.error(err);
      showNotif("Could not convert document. Try a different file.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Document Converter</h2>
            <p className="text-xs text-stone-400 mt-0.5">Opens as a full editable page in a new tab</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {notif && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-700 shrink-0">{notif}</div>
        )}

        <div className="px-6 py-5 space-y-5">

          {/* Upload zone */}
          <div
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl py-10 px-8 cursor-pointer transition-all text-center ${
              docFile ? "border-emerald-400 bg-emerald-50/40" : "border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30"
            }`}
          >
            {docFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText size={24} className="text-emerald-600 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-stone-800 truncate max-w-xs">{docFile.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 capitalize">{docType} file — ready to convert</p>
                </div>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-stone-300 mx-auto mb-3" />
                <p className="text-stone-700 font-semibold mb-2">Drop your document here or click to browse</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {["PDF", "Word (.docx)", "PNG / JPG"].map(l => (
                    <span key={l} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">{l}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {/* Letterhead toggle */}
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Letterhead</p>
            <div className="flex gap-2">
              {[
                { id: false, label: "None" },
                { id: true,  label: "Doxa & Co", dot: "#C9A44A" },
              ].map(({ id, label, dot }) => (
                <button key={String(id)} type="button" onClick={() => setLetterhead(id as boolean)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    letterhead === id ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}>
                  {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />}
                  {label}
                </button>
              ))}
            </div>
            {letterhead && (
              <p className="text-xs text-stone-400 mt-2">
                Header and footer are editable in the opened page — you can change any text directly.
              </p>
            )}
          </div>

          {/* Open button */}
          <button
            type="button"
            onClick={openEditor}
            disabled={!docFile || loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm transition-all"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Converting…
              </>
            ) : (
              "Open in Editor →"
            )}
          </button>

          {docFile && (
            <button type="button" onClick={() => { setDocFile(null); setDocType(null); }}
              className="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1">
              Choose a different file
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
