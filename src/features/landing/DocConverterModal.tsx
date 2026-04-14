import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import {
  X, Upload, Download, Printer, Send, PenLine,
  ChevronLeft, ChevronRight, Trash2, Check,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

// ── Doxa letterhead config ────────────────────────────────────────────────────
const LH = {
  org: "DOXA & CO",
  tagline: "Strategy · Product · Delivery",
  contact: "ename@doxaandco.co  ·  doxaandco.co",
  primaryColor: "#8B7030",
  accentColor: "#059669",
  bg: "#fafaf9",
  lineColor: "#C9A44A",
};

const INK = [
  { id: "black", label: "Black", color: "#1a1a1a" },
  { id: "blue",  label: "Blue",  color: "#1a3a8f" },
  { id: "green", label: "Dark",  color: "#064e3b" },
];

const LH_HEADER_H = 72; // px height of letterhead header on canvas

type DocType = "pdf" | "word" | "image";
interface PageData { dataUrl: string; width: number; height: number }
interface Bounds   { x: number; y: number; w: number; h: number }

// ── Load image helper ─────────────────────────────────────────────────────────
function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src;
  });
}

// ── Compose page with letterhead into one canvas ──────────────────────────────
async function composeCanvas(
  pageDataUrl: string,
  withLetterhead: boolean,
): Promise<HTMLCanvasElement> {
  const page = await loadImg(pageDataUrl);
  const W = page.naturalWidth || 794;
  const H = page.naturalHeight || 1123;
  const totalH = withLetterhead ? H + LH_HEADER_H : H;
  const c = document.createElement("canvas");
  c.width = W; c.height = totalH;
  const ctx = c.getContext("2d")!;

  if (withLetterhead) {
    // Background
    ctx.fillStyle = LH.bg;
    ctx.fillRect(0, 0, W, LH_HEADER_H);
    // Gold line at bottom of header
    ctx.fillStyle = LH.lineColor;
    ctx.fillRect(0, LH_HEADER_H - 2, W, 2);
    // Org name
    ctx.font = `bold 14px Georgia, serif`;
    ctx.fillStyle = LH.primaryColor;
    ctx.letterSpacing = "3px";
    ctx.fillText(LH.org, 28, 26);
    ctx.letterSpacing = "0px";
    // Tagline
    ctx.font = `bold 9px sans-serif`;
    ctx.fillStyle = LH.accentColor;
    ctx.fillText(LH.tagline.toUpperCase(), 28, 42);
    // Contact
    ctx.font = `9px sans-serif`;
    ctx.fillStyle = "#78716c";
    ctx.fillText(LH.contact, 28, 58);
    // Page content below header
    ctx.drawImage(page, 0, LH_HEADER_H);
  } else {
    ctx.drawImage(page, 0, 0);
  }
  return c;
}

interface Props { onClose: () => void }

export default function DocConverterModal({ onClose }: Props) {
  // ── Doc state ─────────────────────────────────────────────────────────────
  const [docFile, setDocFile]             = useState<File | null>(null);
  const [docType, setDocType]             = useState<DocType | null>(null);
  const [docPages, setDocPages]           = useState<PageData[]>([]);
  const [currentPage, setCurrentPage]     = useState(0);
  const [docLoading, setDocLoading]       = useState(false);
  const [wordHtml, setWordHtml]           = useState<string | null>(null);
  const [_docArrayBuffer, setDocArrayBuffer] = useState<ArrayBuffer | null>(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [letterhead, setLetterhead]   = useState(false);
  const [_editMode] = useState(false); // Word docs are always editable
  const [showSigPad, setShowSigPad]   = useState(false);
  const [inkColor, setInkColor]       = useState(INK[0].color);
  const [isDrawing, setIsDrawing]     = useState(false);
  const [sigDataUrl, setSigDataUrl]   = useState<string | null>(null);

  // ── Signature placement ───────────────────────────────────────────────────
  const [sigBounds, setSigBounds]     = useState<Bounds | null>(null);
  const [placingMode, setPlacingMode] = useState(false);
  const [dragging, setDragging]       = useState(false);
  const [resizing, setResizing]       = useState(false);
  const dragOffset   = useRef({ x: 0, y: 0 });
  const resizeStart  = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // ── Refs ──────────────────────────────────────────────────────────────────
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const docViewerRef  = useRef<HTMLDivElement>(null);
  const wordViewRef   = useRef<HTMLDivElement>(null);
  const sigCanvasRef  = useRef<HTMLCanvasElement>(null);

  // ── Rich text formatting ──────────────────────────────────────────────────
  const execCmd = (cmd: string, val?: string) => {
    wordViewRef.current?.focus();
    document.execCommand(cmd, false, val ?? "");
  };

  // ── Notification ──────────────────────────────────────────────────────────
  const [notif, setNotif] = useState<{ msg: string; ok: boolean } | null>(null);
  const showNotif = (msg: string, ok = true) => {
    setNotif({ msg, ok });
    setTimeout(() => setNotif(null), 3000);
  };

  // ── Word HTML sync ────────────────────────────────────────────────────────
  useEffect(() => {
    if (wordViewRef.current && wordHtml !== null) {
      wordViewRef.current.innerHTML = wordHtml;
    }
  }, [wordHtml]);

  // ── Sig canvas init ───────────────────────────────────────────────────────
  useEffect(() => {
    if (showSigPad && sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [showSigPad]);

  useEffect(() => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.getContext("2d")!.strokeStyle = inkColor;
    }
  }, [inkColor]);

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    setDocFile(file);
    setDocPages([]); setWordHtml(null); setDocArrayBuffer(null);
    setSigBounds(null); setPlacingMode(false);
    setLetterhead(false);

    if (ext === "pdf") {
      setDocType("pdf"); setDocLoading(true);
      try {
        const ab = await file.arrayBuffer();
        setDocArrayBuffer(ab);
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        const pages: PageData[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const pg = await pdf.getPage(i);
          const vp = pg.getViewport({ scale: 1.5 });
          const c = document.createElement("canvas");
          c.width = vp.width; c.height = vp.height;
          await pg.render({ canvas: c, viewport: vp }).promise;
          pages.push({ dataUrl: c.toDataURL(), width: vp.width, height: vp.height });
        }
        setDocPages(pages); setCurrentPage(0);
      } catch { showNotif("Could not load PDF", false); }
      setDocLoading(false);
    } else if (ext === "docx" || ext === "doc") {
      setDocType("word"); setDocLoading(true);
      try {
        const ab = await file.arrayBuffer();
        setDocArrayBuffer(ab);
        const { value } = await mammoth.convertToHtml({ arrayBuffer: ab });
        setWordHtml(value);
      } catch { showNotif("Could not load Word document", false); }
      setDocLoading(false);
    } else if (/^(png|jpe?g|webp|gif)$/.test(ext)) {
      setDocType("image"); setDocLoading(true);
      try {
        const ab = await file.arrayBuffer();
        setDocArrayBuffer(ab);
        const dataUrl = await new Promise<string>((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target!.result as string);
          reader.readAsDataURL(file);
        });
        setDocPages([{ dataUrl, width: 0, height: 0 }]);
      } catch { showNotif("Could not load image", false); }
      setDocLoading(false);
    } else {
      showNotif("Unsupported file type. Use PDF, DOCX, or image.", false);
      setDocFile(null);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // ── Signature canvas drawing ──────────────────────────────────────────────
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const touch = (e as React.TouchEvent).touches?.[0];
    return {
      x: ((touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left) * (canvas.width / rect.width),
      y: ((touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top) * (canvas.height / rect.height),
    };
  };

  const startSigDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getCanvasPos(e, canvas);
    ctx.strokeStyle = inkColor; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const drawSig = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !sigCanvasRef.current) return;
    e.preventDefault();
    const ctx = sigCanvasRef.current.getContext("2d")!;
    const pos = getCanvasPos(e, sigCanvasRef.current);
    ctx.lineTo(pos.x, pos.y); ctx.stroke();
  };

  const endSigDraw = () => {
    if (!isDrawing || !sigCanvasRef.current) return;
    setIsDrawing(false);
    setSigDataUrl(sigCanvasRef.current.toDataURL());
  };

  const clearSig = () => {
    if (!sigCanvasRef.current) return;
    const ctx = sigCanvasRef.current.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    setSigDataUrl(null);
  };

  // ── Signature placement ───────────────────────────────────────────────────
  const getViewerPos = (e: React.MouseEvent) => {
    const rect = docViewerRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left + docViewerRef.current!.scrollLeft,
             y: e.clientY - rect.top  + docViewerRef.current!.scrollTop };
  };

  const handleDocClick = (e: React.MouseEvent) => {
    if (!placingMode || !sigDataUrl) return;
    const pos = getViewerPos(e);
    setSigBounds({ x: pos.x - 90, y: pos.y - 30, w: 180, h: 60 });
    setPlacingMode(false);
  };

  const handleSigMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sigBounds) return;
    dragOffset.current = { x: e.clientX - sigBounds.x, y: e.clientY - sigBounds.y };
    setDragging(true);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sigBounds) return;
    resizeStart.current = { x: e.clientX, y: e.clientY, w: sigBounds.w, h: sigBounds.h };
    setResizing(true);
  };

  const handleViewerMouseMove = (e: React.MouseEvent) => {
    if (dragging && sigBounds) {
      setSigBounds(b => b ? { ...b, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } : b);
    }
    if (resizing && sigBounds) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      setSigBounds(b => b ? { ...b,
        w: Math.max(60, resizeStart.current.w + dx),
        h: Math.max(20, resizeStart.current.h + dy),
      } : b);
    }
  };

  const handleViewerMouseUp = () => { setDragging(false); setResizing(false); };

  // ── Export / Print / Send ─────────────────────────────────────────────────
  const exportSigned = async () => {
    if (!docFile) return;
    try {
      const getPageDataUrl = (): string | null => {
        if (docType === "word") {
          // Render word content to canvas via html2canvas-style approach
          return null; // handled below
        }
        return docPages[currentPage]?.dataUrl ?? null;
      };

      if (docType === "word") {
        // Serialize edited HTML content
        const content = wordViewRef.current?.innerHTML ?? wordHtml ?? "";
        const lhHeader = letterhead
          ? `<div style="background:${LH.bg};border-bottom:2px solid ${LH.lineColor};padding:12px 28px 10px;margin-bottom:0;">
               <div style="font-family:Georgia,serif;font-weight:700;font-size:14px;color:${LH.primaryColor};letter-spacing:3px;">${LH.org}</div>
               <div style="font-size:9px;color:${LH.accentColor};font-weight:700;letter-spacing:2px;margin-top:3px;">${LH.tagline.toUpperCase()}</div>
             </div>`
          : "";
        const sigBlock = sigBounds && sigDataUrl
          ? `<div style="position:relative;"><img src="${sigDataUrl}" style="position:absolute;left:${sigBounds.x}px;top:${sigBounds.y}px;width:${sigBounds.w}px;height:${sigBounds.h}px;"/></div>`
          : "";
        const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
          body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}
          @media print{.no-print{display:none}}
        </style></head><body>${lhHeader}<div contenteditable="true" style="outline:none;">${content}</div>${sigBlock}
        <div class="no-print" style="margin-top:24px;">
          <button onclick="window.print()" style="padding:10px 24px;background:#059669;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;">Print / Save PDF</button>
        </div></body></html>`;
        const blob = new Blob([fullHtml], { type: "text/html" });
        const a = document.createElement("a");
        a.download = `${docFile.name.replace(/\.[^.]+$/, "")}_edited.html`;
        a.href = URL.createObjectURL(blob);
        a.click();
        showNotif("Downloaded — open in browser then print/save as PDF");
        return;
      }

      const pageDataUrl = getPageDataUrl();
      if (!pageDataUrl) return;

      const composed = await composeCanvas(pageDataUrl, letterhead);

      // Draw signature onto composed canvas if placed
      if (sigBounds && sigDataUrl) {
        const ctx = composed.getContext("2d")!;
        const sig = await loadImg(sigDataUrl);
        ctx.drawImage(sig, sigBounds.x, sigBounds.y, sigBounds.w, sigBounds.h);
      }

      // Embed into PDF
      const pdfDoc = await PDFDocument.create();
      const imgBytes = await fetch(composed.toDataURL("image/png")).then(r => r.arrayBuffer());
      const pngImg = await pdfDoc.embedPng(imgBytes);
      const { width: iw, height: ih } = pngImg.scale(1);
      const page = pdfDoc.addPage([iw, ih]);
      page.drawImage(pngImg, { x: 0, y: 0, width: iw, height: ih });
      const pdfBytes = await pdfDoc.save();
      const a = document.createElement("a");
      a.download = `${docFile.name.replace(/\.[^.]+$/, "")}_signed.pdf`;
      a.href = URL.createObjectURL(new Blob([new Uint8Array(pdfBytes)]));
      a.click();
      showNotif("Saved as PDF!");
    } catch (err) {
      console.error(err);
      showNotif("Export failed", false);
    }
  };

  const printDoc = async () => {
    if (!docFile) return;
    if (docType === "word") {
      const content = wordViewRef.current?.innerHTML ?? wordHtml ?? "";
      const lhHeader = letterhead
        ? `<div style="background:${LH.bg};border-bottom:2px solid ${LH.lineColor};padding:12px 28px;">
             <div style="font-family:Georgia,serif;font-weight:700;font-size:14px;color:${LH.primaryColor};letter-spacing:3px;">${LH.org}</div>
             <div style="font-size:9px;color:${LH.accentColor};font-weight:700;letter-spacing:2px;margin-top:3px;">${LH.tagline.toUpperCase()}</div>
           </div>`
        : "";
      const win = window.open("", "_blank");
      win?.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;}
        @media print{body{margin:0;max-width:none;padding:12px;}}
      </style></head><body>${lhHeader}<div>${content}</div></body></html>`);
      win?.document.close();
      setTimeout(() => win?.print(), 400);
      return;
    }

    const pageDataUrl = docPages[currentPage]?.dataUrl;
    if (!pageDataUrl) return;
    const composed = await composeCanvas(pageDataUrl, letterhead);
    if (sigBounds && sigDataUrl) {
      const ctx = composed.getContext("2d")!;
      const sig = await loadImg(sigDataUrl);
      ctx.drawImage(sig, sigBounds.x, sigBounds.y, sigBounds.w, sigBounds.h);
    }
    const win = window.open("", "_blank");
    win?.document.write(`<!DOCTYPE html><html><head><style>body{margin:0;}img{max-width:100%;}</style></head>
      <body><img src="${composed.toDataURL("image/png")}"/></body></html>`);
    win?.document.close();
    setTimeout(() => win?.print(), 400);
  };

  const sendDoc = () => {
    const name = docFile?.name ?? "document";
    const to   = "ename@doxaandco.co";
    const sub  = encodeURIComponent(`Document: ${name}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease find my document attached: ${name}.\n\n(Save it first using the Save button, then attach the file to this email.)`
    );
    window.open(`mailto:${to}?subject=${sub}&body=${body}`, "_blank");
  };

  const totalPages = docPages.length;
  const hasDoc     = !!docFile && !docLoading && (docPages.length > 0 || wordHtml !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-0 sm:px-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[94vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Document Converter</h2>
            <p className="text-xs text-stone-400 mt-0.5">Upload · Add letterhead · Sign · Edit · Save or Print</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        {/* Notification */}
        {notif && (
          <div className={`mx-6 mt-3 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shrink-0 ${
            notif.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {notif.ok ? <Check size={14} /> : "✕"} {notif.msg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

          {/* ── Upload zone ── */}
          {!docFile && (
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-200 hover:border-emerald-400 rounded-2xl py-14 px-8 cursor-pointer hover:bg-emerald-50/40 transition-all text-center"
            >
              <Upload size={36} className="text-stone-300 mx-auto mb-4" />
              <p className="text-stone-700 font-semibold mb-3">Drop your document here or click to browse</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {["PDF", "Word (.docx)", "PNG / JPG"].map(l => (
                  <span key={l} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">{l}</span>
                ))}
              </div>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />

          {/* ── Loading ── */}
          {docLoading && (
            <div className="text-center py-10 text-stone-400">
              <div className="animate-spin w-8 h-8 border-2 border-stone-200 border-t-emerald-600 rounded-full mx-auto mb-3" />
              Loading document…
            </div>
          )}

          {/* ── Controls (shown when doc is loaded) ── */}
          {hasDoc && (
            <>
              {/* Top row: filename + change */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500 truncate flex-1">{docFile!.name}</span>
                <button onClick={() => { setDocFile(null); setDocPages([]); setWordHtml(null); setSigBounds(null); setSigDataUrl(null); }}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 text-xs font-medium hover:bg-stone-50 transition-colors">
                  Change file
                </button>
              </div>

              {/* Letterhead toggle */}
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Letterhead</p>
                <div className="flex gap-2">
                  {[
                    { id: false, label: "None" },
                    { id: true,  label: "Doxa & Co", color: LH.lineColor },
                  ].map(({ id, label, color }) => (
                    <button key={String(id)} onClick={() => setLetterhead(id as boolean)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        letterhead === id
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                      }`}>
                      {color && <span className="w-2 h-2 rounded-full" style={{ background: color }} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature section */}
              <div className="border border-stone-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowSigPad(v => !v)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                >
                  <PenLine size={14} className="text-stone-400 shrink-0" />
                  <span className="text-sm font-semibold text-stone-700 flex-1">
                    {sigDataUrl ? "Signature ready" : "Add Signature"}
                  </span>
                  {sigDataUrl && (
                    <img src={sigDataUrl} alt="sig preview" className="h-6 object-contain" />
                  )}
                  <span className="text-xs text-stone-400">{showSigPad ? "▲" : "▼"}</span>
                </button>

                {showSigPad && (
                  <div className="px-4 py-3 space-y-3">
                    {/* Ink selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Ink</span>
                      {INK.map(ink => (
                        <button key={ink.id} onClick={() => setInkColor(ink.color)}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${inkColor === ink.color ? "border-stone-700 scale-110" : "border-stone-200"}`}
                          style={{ background: ink.color }}
                          title={ink.label}
                        />
                      ))}
                      <button onClick={clearSig} className="ml-auto flex items-center gap-1 text-xs text-stone-400 hover:text-red-400 transition-colors">
                        <Trash2 size={11} /> Clear
                      </button>
                    </div>

                    {/* Drawing canvas */}
                    <canvas
                      ref={sigCanvasRef}
                      width={520} height={110}
                      className="w-full border-2 border-dashed border-stone-200 rounded-xl cursor-crosshair bg-white touch-none"
                      onMouseDown={startSigDraw}
                      onMouseMove={drawSig}
                      onMouseUp={endSigDraw}
                      onMouseLeave={endSigDraw}
                      onTouchStart={startSigDraw}
                      onTouchMove={drawSig}
                      onTouchEnd={endSigDraw}
                    />
                    <p className="text-xs text-stone-400">Draw your signature above, then place it on the document.</p>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 flex-wrap">
                {sigDataUrl && (
                  <button onClick={() => { setPlacingMode(p => !p); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      placingMode ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-emerald-600"
                    }`}>
                    ✍ {placingMode ? "Click to place…" : sigBounds ? "Move Signature" : "Place Signature"}
                  </button>
                )}
                {sigBounds && (
                  <button onClick={() => setSigBounds(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors">
                    ✕ Remove Sig
                  </button>
                )}
                {docType === "word" && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                    ✏ Editing
                  </span>
                )}
                <div className="flex-1" />
                {totalPages > 1 && (
                  <div className="flex items-center gap-1 text-sm text-stone-600">
                    <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                      className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30">
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-xs font-medium">{currentPage + 1}/{totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1}
                      className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
                <button onClick={exportSigned}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors">
                  <Download size={13} /> Save
                </button>
                <button onClick={printDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors">
                  <Printer size={13} /> Print
                </button>
                <button onClick={sendDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 transition-colors">
                  <Send size={13} /> Send
                </button>
              </div>

              {/* ── Rich text formatting toolbar (Word docs only) ── */}
              {docType === "word" && (
                <div className="flex items-center gap-1 flex-wrap px-3 py-2 bg-stone-50 rounded-xl border border-stone-100">
                  {/* Bold / Italic / Underline */}
                  {[
                    { cmd: "bold",      label: "B", title: "Bold",      cls: "font-black" },
                    { cmd: "italic",    label: "I", title: "Italic",    cls: "italic" },
                    { cmd: "underline", label: "U", title: "Underline", cls: "underline" },
                  ].map(({ cmd, label, title, cls }) => (
                    <button key={cmd} type="button" title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      className={`w-7 h-7 rounded text-sm text-stone-700 hover:bg-stone-200 transition-colors ${cls}`}>
                      {label}
                    </button>
                  ))}
                  <span className="w-px h-5 bg-stone-200 mx-1" />
                  {/* Alignment */}
                  {[
                    { cmd: "justifyLeft",   icon: "≡", title: "Align left",  style: "text-left" },
                    { cmd: "justifyCenter", icon: "≡", title: "Center",      style: "text-center" },
                    { cmd: "justifyRight",  icon: "≡", title: "Align right", style: "text-right" },
                    { cmd: "justifyFull",   icon: "≡", title: "Justify",     style: "" },
                  ].map(({ cmd, icon, title }, i) => (
                    <button key={cmd} type="button" title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      className="w-7 h-7 rounded text-sm text-stone-700 hover:bg-stone-200 transition-colors flex items-center justify-center"
                      style={{ letterSpacing: i === 1 ? "1px" : i === 2 ? "2px" : "" }}>
                      {icon}
                    </button>
                  ))}
                  <span className="w-px h-5 bg-stone-200 mx-1" />
                  {/* Font size */}
                  <select
                    title="Font size"
                    className="h-7 rounded border border-stone-200 text-xs text-stone-700 px-1 bg-white hover:bg-stone-50 transition-colors"
                    defaultValue=""
                    onChange={e => { execCmd("fontSize", e.target.value); e.target.value = ""; }}
                  >
                    <option value="" disabled>Size</option>
                    <option value="1">Tiny (8pt)</option>
                    <option value="2">Small (10pt)</option>
                    <option value="3">Normal (12pt)</option>
                    <option value="4">Medium (14pt)</option>
                    <option value="5">Large (18pt)</option>
                    <option value="6">XL (24pt)</option>
                    <option value="7">XXL (36pt)</option>
                  </select>
                  <span className="w-px h-5 bg-stone-200 mx-1" />
                  {/* Headings */}
                  <select
                    title="Paragraph style"
                    className="h-7 rounded border border-stone-200 text-xs text-stone-700 px-1 bg-white hover:bg-stone-50 transition-colors"
                    defaultValue=""
                    onChange={e => { execCmd("formatBlock", e.target.value); e.target.value = ""; }}
                  >
                    <option value="" disabled>Style</option>
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                  </select>
                  <span className="w-px h-5 bg-stone-200 mx-1" />
                  {/* Lists */}
                  {[
                    { cmd: "insertUnorderedList", label: "• List", title: "Bullet list" },
                    { cmd: "insertOrderedList",   label: "1. List", title: "Numbered list" },
                  ].map(({ cmd, label, title }) => (
                    <button key={cmd} type="button" title={title}
                      onMouseDown={e => { e.preventDefault(); execCmd(cmd); }}
                      className="px-2 h-7 rounded text-xs text-stone-700 hover:bg-stone-200 transition-colors">
                      {label}
                    </button>
                  ))}
                  <span className="w-px h-5 bg-stone-200 mx-1" />
                  {/* Remove formatting */}
                  <button type="button" title="Remove formatting"
                    onMouseDown={e => { e.preventDefault(); execCmd("removeFormat"); }}
                    className="px-2 h-7 rounded text-xs text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-colors">
                    Tx
                  </button>
                </div>
              )}

              {/* Placing mode banner */}
              {placingMode && (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium text-center">
                  ✦ Click anywhere on the document below to place your signature
                </div>
              )}

              {/* Letterhead preview header */}
              {letterhead && (
                <div className="rounded-t-xl border-x-2 border-t-2 border-stone-200 px-5 py-3"
                  style={{ background: LH.bg, borderBottom: `2px solid ${LH.lineColor}` }}>
                  <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, letterSpacing: "3px", color: LH.primaryColor, fontSize: 13 }}>
                    {LH.org}
                  </div>
                  <div style={{ fontSize: 9, color: LH.accentColor, letterSpacing: "2px", fontWeight: 700, marginTop: 3 }}>
                    {LH.tagline.toUpperCase()}
                  </div>
                </div>
              )}

              {/* Document viewer */}
              <div
                ref={docViewerRef}
                onClick={handleDocClick}
                onMouseMove={handleViewerMouseMove}
                onMouseUp={handleViewerMouseUp}
                onMouseLeave={handleViewerMouseUp}
                className={`relative bg-white overflow-auto max-h-[55vh] shadow-inner border-2 select-none transition-colors ${
                  letterhead ? "rounded-b-xl border-t-0" : "rounded-xl"
                } ${
                  placingMode ? "border-emerald-400 cursor-crosshair" :
                  dragging || resizing ? "border-stone-300 cursor-grabbing" :
                  "border-stone-200"
                }`}
              >
                {docType === "word" && wordHtml !== null ? (
                  <div
                    ref={wordViewRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="p-10 font-serif text-sm leading-relaxed text-stone-900 min-h-64 focus:outline-none"
                  />
                ) : docPages[currentPage] ? (
                  <img src={docPages[currentPage].dataUrl} alt="Document page" className="w-full block" />
                ) : null}

                {/* Draggable/resizable signature */}
                {sigBounds && sigDataUrl && (
                  <div
                    onMouseDown={handleSigMouseDown}
                    className="absolute border-2 border-emerald-500 rounded"
                    style={{ left: sigBounds.x, top: sigBounds.y, width: sigBounds.w, height: sigBounds.h,
                             cursor: dragging ? "grabbing" : "grab", boxSizing: "border-box" }}
                  >
                    <img src={sigDataUrl} alt="Signature" className="w-full h-full object-contain block pointer-events-none" />
                    {/* Resize handle */}
                    <div
                      onMouseDown={handleResizeMouseDown}
                      className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-tl cursor-se-resize"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
