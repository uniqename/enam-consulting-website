import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import { X, PenLine, Upload, Download, FileSignature, BookMarked, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

// ─── Constants ────────────────────────────────────────────────────────────────

const INK_OPTIONS = [
  { id: "black", label: "Black", color: "#1a1a1a", stroke: 2.5 },
  { id: "blue",  label: "Blue",  color: "#1a3a8f", stroke: 2.5 },
  { id: "thin",  label: "Thin",  color: "#1a1a1a", stroke: 1.2 },
  { id: "bold",  label: "Bold",  color: "#0d0d0d", stroke: 4.5 },
];

const DEFAULT_SIG_W = 180;
const DEFAULT_SIG_H = 60;

// ─── Helpers ─────────────────────────────────────────────────────────────────

type InkOption = (typeof INK_OPTIONS)[0];
type Variants = Record<string, string>;

function processSignatureCanvas(src: HTMLCanvasElement, ink: InkOption): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = src.width; out.height = src.height;
  const ctx = out.getContext("2d")!;
  const imgData = src.getContext("2d")!.getImageData(0, 0, src.width, src.height);
  const d = imgData.data;
  const hex = ink.color.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((o) => parseInt(hex.slice(o, o + 2), 16));
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 10) { d[i] = r; d[i + 1] = g; d[i + 2] = b; }
    else { d[i + 3] = 0; }
  }
  ctx.putImageData(imgData, 0, 0);
  return out;
}

function removeBackground(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = canvas.width; out.height = canvas.height;
  const ctx = out.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, out.width, out.height);
  const d = imgData.data;
  const w = canvas.width, h = canvas.height;
  const corners = [[0,1,2],[w*4,w*4+1,w*4+2],[(h-1)*w*4,(h-1)*w*4+1,(h-1)*w*4+2]];
  const [bgR,bgG,bgB] = [0,1,2].map((c) => Math.round(corners.reduce((s,p) => s + d[p[c]], 0) / 3));
  for (let i = 0; i < d.length; i += 4) {
    const dist = Math.sqrt((d[i]-bgR)**2 + (d[i+1]-bgG)**2 + (d[i+2]-bgB)**2);
    if (dist < 60) d[i+3] = 0;
    else if (dist < 120) d[i+3] = Math.round(((dist-60)/60)*d[i+3]);
  }
  ctx.putImageData(imgData, 0, 0);
  return out;
}

async function renderHtmlToCanvas(html: string, w = 794, h = 1123): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject x="0" y="0" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w-80}px;padding:40px;font-family:Georgia,serif;font-size:12px;line-height:1.7;background:#fff;color:#111;">
        ${html}
      </div>
    </foreignObject>
  </svg>`;
  return new Promise((resolve) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { ctx.drawImage(img, 0, 0); URL.revokeObjectURL(url); resolve(canvas); };
    img.onerror = () => resolve(canvas);
    img.src = url;
  });
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SigBounds { x: number; y: number; w: number; h: number; }
interface DocPage { dataUrl: string; pdfW: number; pdfH: number; }
interface Props { onClose: () => void; }

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignatureGenerator({ onClose }: Props) {

  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"draw" | "upload" | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processedVariants, setProcessedVariants] = useState<Variants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2.5);
  const [savedSignatures, setSavedSignatures] = useState<Array<{ id: number; variants: Variants; label: string }>>([]);
  const [activeTab, setActiveTab] = useState("download");
  const [notification, setNotification] = useState<{ msg: string; ok: boolean } | null>(null);

  const [docType, setDocType] = useState<"pdf" | "image" | "word" | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docArrayBuffer, setDocArrayBuffer] = useState<ArrayBuffer | null>(null);
  const [docPages, setDocPages] = useState<DocPage[]>([]);
  const [wordHtml, setWordHtml] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [docLoading, setDocLoading] = useState(false);

  const [sigBounds, setSigBounds] = useState<SigBounds | null>(null);
  const [placingMode, setPlacingMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const docViewerRef = useRef<HTMLDivElement>(null);

  // ─ Touch drawing ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tp = (e: TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.touches[0].clientX - r.left) * (canvas.width / r.width),
               y: (e.touches[0].clientY - r.top)  * (canvas.height / r.height) };
    };
    const ts = (e: TouchEvent) => { e.preventDefault(); isDrawingRef.current = true; lastPos.current = tp(e); setIsDrawing(true); };
    const tm = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current || !lastPos.current) return;
      const ctx = canvas.getContext("2d")!;
      const pos = tp(e);
      ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = strokeWidth; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
      lastPos.current = pos;
    };
    const te = (e: TouchEvent) => { e.preventDefault(); isDrawingRef.current = false; lastPos.current = null; setIsDrawing(false); };
    canvas.addEventListener("touchstart", ts, { passive: false });
    canvas.addEventListener("touchmove",  tm, { passive: false });
    canvas.addEventListener("touchend",   te, { passive: false });
    return () => { canvas.removeEventListener("touchstart", ts); canvas.removeEventListener("touchmove", tm); canvas.removeEventListener("touchend", te); };
  }, [step, mode, strokeWidth]);

  const showNotif = (msg: string, ok = true) => {
    setNotification({ msg, ok });
    setTimeout(() => setNotification(null), 3000);
  };

  // ─ Mouse drawing ──────────────────────────────────────────────────────────
  const mp = (e: React.MouseEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };
  const startDraw = (e: React.MouseEvent) => { const c = canvasRef.current; if (!c) return; setIsDrawing(true); lastPos.current = mp(e, c); };
  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPos.current) return;
    const c = canvasRef.current!; const ctx = c.getContext("2d")!;
    const pos = mp(e, c);
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = strokeWidth; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    lastPos.current = pos;
  };
  const endDraw = () => { setIsDrawing(false); lastPos.current = null; };
  const clearCanvas = () => { const c = canvasRef.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); };

  // ─ Variants ───────────────────────────────────────────────────────────────
  const generateVariants = (src: HTMLCanvasElement) => {
    const v: Variants = {};
    INK_OPTIONS.forEach((opt) => { v[opt.id] = processSignatureCanvas(src, opt).toDataURL("image/png"); });
    setProcessedVariants(v); setStep(3);
  };
  const generateFromDraw = () => generateVariants(canvasRef.current!);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas"); c.width = 600; c.height = 200;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 600, 200);
        const ratio = Math.min(600 / img.width, 200 / img.height);
        ctx.drawImage(img, (600-img.width*ratio)/2, (200-img.height*ratio)/2, img.width*ratio, img.height*ratio);
        generateVariants(removeBackground(c));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  };

  // ─ Downloads ──────────────────────────────────────────────────────────────
  const downloadPNG = () => {
    if (!processedVariants) return;
    const a = document.createElement("a"); a.download = `signature_${selectedVariant}.png`;
    a.href = processedVariants[selectedVariant]; a.click(); showNotif("PNG downloaded!");
  };
  const downloadSVG = () => {
    if (!processedVariants) return;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="200"><image href="${processedVariants[selectedVariant]}" width="600" height="200"/></svg>`;
    const a = document.createElement("a"); a.download = `signature_${selectedVariant}.svg`;
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); a.click(); showNotif("SVG downloaded!");
  };
  const copyToClipboard = async () => {
    if (!processedVariants) return;
    try {
      const blob = await (await fetch(processedVariants[selectedVariant])).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showNotif("Copied to clipboard!");
    } catch { showNotif("Copy failed — use Download instead", false); }
  };
  const saveSignature = () => {
    if (!processedVariants) return;
    setSavedSignatures((p) => [...p, { id: Date.now(), variants: processedVariants, label: `Sig ${p.length+1}` }]);
    showNotif("Saved for reuse!");
  };

  // ─ Document loading ───────────────────────────────────────────────────────
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setDocFile(f); setDocLoading(true); setSigBounds(null); setPlacingMode(false);
    try {
      const ab = await f.arrayBuffer();
      setDocArrayBuffer(ab);
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        setDocType("pdf"); await loadPDF(ab);
      } else if (f.name.toLowerCase().match(/\.(docx?|doc)$/)) {
        setDocType("word"); await loadWord(ab);
      } else {
        setDocType("image"); await loadImage(f);
      }
    } catch (err) { showNotif("Could not load document", false); console.error(err); }
    setDocLoading(false);
  };

  const loadPDF = async (ab: ArrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
    const pages: DocPage[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const vp1 = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: 2 });
      const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
      pages.push({ dataUrl: c.toDataURL("image/png"), pdfW: vp1.width, pdfH: vp1.height });
    }
    setDocPages(pages); setCurrentPage(0);
  };

  const loadWord = async (ab: ArrayBuffer) => {
    const result = await mammoth.convertToHtml({ arrayBuffer: ab });
    setWordHtml(result.value);
    setDocPages([{ dataUrl: "word", pdfW: 0, pdfH: 0 }]);
    setCurrentPage(0);
  };

  const loadImage = (f: File): Promise<void> => new Promise((res) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => { setDocPages([{ dataUrl: ev.target?.result as string, pdfW: img.naturalWidth, pdfH: img.naturalHeight }]); setCurrentPage(0); res(); };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  });

  // ─ Signature placement ────────────────────────────────────────────────────
  const handleDocClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingMode || !docViewerRef.current) return;
    const r = docViewerRef.current.getBoundingClientRect();
    setSigBounds({ x: e.clientX - r.left - DEFAULT_SIG_W / 2, y: e.clientY - r.top - DEFAULT_SIG_H / 2, w: DEFAULT_SIG_W, h: DEFAULT_SIG_H });
    setPlacingMode(false);
  };
  const handleSigMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!sigBounds) return;
    setDragging(true);
    setDragStart({ x: e.clientX - sigBounds.x, y: e.clientY - sigBounds.y });
  };
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    if (!sigBounds) return;
    setResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, w: sigBounds.w, h: sigBounds.h });
  };
  const handleViewerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && sigBounds) setSigBounds({ ...sigBounds, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    else if (resizing && sigBounds) setSigBounds({ ...sigBounds, w: Math.max(60, resizeStart.w + e.clientX - resizeStart.x), h: Math.max(20, resizeStart.h + e.clientY - resizeStart.y) });
  };
  const handleViewerMouseUp = () => { setDragging(false); setResizing(false); };

  // ─ Export ─────────────────────────────────────────────────────────────────
  const exportSigned = async () => {
    if (!sigBounds || !processedVariants || !docViewerRef.current) return;
    const { width: displayW, height: displayH } = docViewerRef.current.getBoundingClientRect();
    const sigDataUrl = processedVariants[selectedVariant];
    showNotif("Preparing download…");
    try {
      if (docType === "pdf" && docArrayBuffer) {
        const pdfDoc = await PDFDocument.load(docArrayBuffer);
        const page = pdfDoc.getPages()[currentPage];
        const { width: pW, height: pH } = page.getSize();
        const sx = pW / displayW, sy = pH / displayH;
        const pngBytes = await (await fetch(sigDataUrl)).arrayBuffer();
        page.drawImage(await pdfDoc.embedPng(pngBytes), { x: sigBounds.x * sx, y: pH - (sigBounds.y + sigBounds.h) * sy, width: sigBounds.w * sx, height: sigBounds.h * sy });
        const a = document.createElement("a"); a.download = `signed_${docFile?.name}.pdf`;
        a.href = URL.createObjectURL(new Blob([await pdfDoc.save()], { type: "application/pdf" }));
        a.click(); showNotif("Signed PDF downloaded!");
      } else if (docType === "image") {
        const page = docPages[currentPage];
        const imgEl = docViewerRef.current.querySelector("img");
        const natW = imgEl?.naturalWidth || displayW, natH = imgEl?.naturalHeight || displayH;
        const c = document.createElement("canvas"); c.width = natW; c.height = natH;
        const ctx = c.getContext("2d")!;
        await new Promise<void>((res) => { const di = new Image(); di.onload = () => { ctx.drawImage(di, 0, 0); res(); }; di.src = page.dataUrl; });
        await new Promise<void>((res) => { const si = new Image(); si.onload = () => { ctx.drawImage(si, sigBounds.x*(natW/displayW), sigBounds.y*(natH/displayH), sigBounds.w*(natW/displayW), sigBounds.h*(natH/displayH)); res(); }; si.src = sigDataUrl; });
        const a = document.createElement("a"); a.download = `signed_${docFile?.name}.png`; a.href = c.toDataURL("image/png"); a.click(); showNotif("Signed image downloaded!");
      } else if (docType === "word" && wordHtml) {
        const W = 794, H = 1123;
        const wc = await renderHtmlToCanvas(wordHtml, W, H);
        const ctx = wc.getContext("2d")!;
        await new Promise<void>((res) => { const si = new Image(); si.onload = () => { ctx.drawImage(si, sigBounds.x*(W/displayW), sigBounds.y*(H/displayH), sigBounds.w*(W/displayW), sigBounds.h*(H/displayH)); res(); }; si.src = sigDataUrl; });
        const pdfDoc = await PDFDocument.create();
        const pp = pdfDoc.addPage([W, H]);
        pp.drawImage(await pdfDoc.embedPng(await (await fetch(wc.toDataURL("image/png"))).arrayBuffer()), { x: 0, y: 0, width: W, height: H });
        const a = document.createElement("a"); a.download = `signed_${docFile?.name}.pdf`;
        a.href = URL.createObjectURL(new Blob([await pdfDoc.save()], { type: "application/pdf" })); a.click(); showNotif("Signed document downloaded as PDF!");
      }
    } catch (err) { showNotif("Export failed", false); console.error(err); }
  };

  const currentVariantData = processedVariants?.[selectedVariant];
  const totalPages = docPages.length;

  // ─ Render ─────────────────────────────────────────────────────────────────
  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notification toast */}
        {notification && (
          <div className={`absolute top-4 right-14 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg ${notification.ok ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
            {notification.ok ? <CheckCircle2 size={15} /> : null}
            {notification.msg}
          </div>
        )}

        {/* Close button */}
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors">
          <X size={17} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-stone-100">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <FileSignature size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Digital Signature Generator</h2>
            <p className="text-sm text-stone-500">Draw or upload · Choose style · Sign documents</p>
          </div>
          {savedSignatures.length > 0 && (
            <div className="ml-auto flex gap-2 flex-wrap">
              {savedSignatures.map((s) => (
                <button key={s.id} type="button"
                  onClick={() => { setProcessedVariants(s.variants); setStep(3); showNotif("Loaded!"); }}
                  className="px-3 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 text-stone-600 hover:text-emerald-700 text-xs font-medium transition-colors border border-stone-200">
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 px-8 py-5">
          {["Create", "Style & Export", "Sign Doc"].map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i+1 ? "bg-emerald-600 text-white" :
                  step === i+1 ? "bg-stone-900 text-white" :
                  "bg-stone-100 text-stone-400"
                }`}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-wide ${step === i+1 ? "text-stone-900" : "text-stone-400"}`}>
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-12 h-px mx-2 mb-4 ${step > i+1 ? "bg-emerald-600" : "bg-stone-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-8 pb-10">

          {/* ── STEP 1: Choose ──────────────────────────────────────────── */}
          {step === 1 && (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-stone-900 mb-2">How would you like to sign?</h3>
              <p className="text-stone-500 mb-8">Draw it by hand, or upload a photo of your existing signature</p>
              <div className="flex gap-5 justify-center flex-wrap">
                {[
                  { k: "draw",   icon: <PenLine size={32} />,  title: "Draw",          sub: "Mouse, touch, or stylus" },
                  { k: "upload", icon: <Upload size={32} />,   title: "Upload Photo",  sub: "JPG, PNG, HEIC — auto-cleaned" },
                ].map(({ k, icon, title, sub }) => (
                  <button key={k} type="button"
                    onClick={() => { setMode(k as "draw" | "upload"); setStep(2); }}
                    className="flex flex-col items-center gap-4 p-10 rounded-2xl border-2 border-stone-100 hover:border-emerald-300 hover:bg-emerald-50 bg-white text-stone-900 transition-all cursor-pointer min-w-44 shadow-sm hover:shadow-md">
                    <span className="text-emerald-600">{icon}</span>
                    <div>
                      <div className="text-lg font-bold mb-1">{title}</div>
                      <div className="text-sm text-stone-500">{sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Draw ────────────────────────────────────────────── */}
          {step === 2 && mode === "draw" && (
            <div>
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-stone-900 mb-1">Sign in the box below</h3>
                <p className="text-sm text-stone-500">Use your finger, mouse, or stylus — keep it natural</p>
              </div>
              {/* Stroke selector */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-sm text-stone-500 font-medium">Stroke:</span>
                {[{ v: 1.2, l: "Thin" }, { v: 2.5, l: "Medium" }, { v: 4.5, l: "Bold" }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setStrokeWidth(v)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      strokeWidth === v ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                    }`}>{l}</button>
                ))}
              </div>
              {/* Canvas */}
              <div className="rounded-2xl overflow-hidden border-2 border-stone-200 cursor-crosshair touch-none shadow-inner bg-white">
                <canvas ref={canvasRef} width={600} height={200}
                  className="block w-full max-w-full"
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />
              </div>
              <div className="flex gap-3 mt-5 justify-center flex-wrap">
                <button type="button" onClick={clearCanvas}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
                  Clear
                </button>
                <button type="button" onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
                  ← Back
                </button>
                <button type="button" onClick={generateFromDraw}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Upload ──────────────────────────────────────────── */}
          {step === 2 && mode === "upload" && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-stone-900 mb-2">Upload your signature</h3>
              <p className="text-sm text-stone-500 mb-6">Take a photo of your handwritten signature. Background is automatically removed.</p>
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 hover:border-emerald-400 rounded-2xl py-12 px-8 cursor-pointer hover:bg-emerald-50 transition-all">
                <Upload size={36} className="text-stone-300 mx-auto mb-3" />
                <p className="text-stone-700 font-semibold mb-1">Click to browse or drag &amp; drop</p>
                <p className="text-sm text-stone-400">JPG · PNG · HEIC</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.heic,image/*"
                className="hidden" onChange={handleImageUpload} />
              <div className="mt-4">
                <button type="button" onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Style + Export ──────────────────────────────────── */}
          {step === 3 && processedVariants && (
            <div>
              {/* Ink selector */}
              <div className="flex gap-2 flex-wrap mb-5">
                {INK_OPTIONS.map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setSelectedVariant(opt.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedVariant === opt.id
                        ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                        : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                    }`}>
                    <span className="w-2.5 h-2.5 rounded-full border border-stone-300 shrink-0"
                      style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-center min-h-28 mb-5 overflow-hidden">
                {currentVariantData && (
                  <img src={currentVariantData} alt="Signature preview"
                    className="max-h-24 max-w-full object-contain"
                    style={{ imageRendering: "crisp-edges" }} />
                )}
              </div>

              {/* Tabs */}
              <div className="flex border-b border-stone-100 mb-6">
                {[
                  { id: "download", label: "Download",         icon: <Download size={15} /> },
                  { id: "sign",     label: "Sign Document",    icon: <FileSignature size={15} /> },
                  { id: "saved",    label: "Saved",            icon: <BookMarked size={15} /> },
                ].map(({ id, label, icon }) => (
                  <button key={id} type="button" onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                      activeTab === id
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}>
                    {icon}{label}
                  </button>
                ))}
              </div>

              {/* ── Download ── */}
              {activeTab === "download" && (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button type="button" onClick={downloadPNG}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm">
                      <Download size={16} /> PNG (Transparent)
                    </button>
                    <button type="button" onClick={downloadSVG}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm">
                      <Download size={16} /> SVG (Scalable)
                    </button>
                    <button type="button" onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-stone-200 text-stone-700 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                      Copy to Clipboard
                    </button>
                    <button type="button" onClick={saveSignature}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-stone-200 text-stone-700 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                      <BookMarked size={16} /> Save for Reuse
                    </button>
                  </div>
                  <p className="text-xs text-stone-400 text-center">PNG has a transparent background — paste into Word, Gmail, PDFs, or any app.</p>
                </div>
              )}

              {/* ── Sign Document ── */}
              {activeTab === "sign" && (
                <div>
                  {!docFile ? (
                    <div>
                      <p className="text-sm text-stone-500 mb-4">Upload your document — then click to place your signature exactly where you need it.</p>
                      <div onClick={() => docInputRef.current?.click()}
                        className="border-2 border-dashed border-stone-200 hover:border-emerald-400 rounded-2xl py-10 px-8 cursor-pointer hover:bg-emerald-50 transition-all text-center">
                        <Upload size={32} className="text-stone-300 mx-auto mb-3" />
                        <p className="text-stone-700 font-semibold mb-3">Upload Document to Sign</p>
                        <div className="flex gap-2 justify-center flex-wrap">
                          {[["PDF"], ["Word (.docx)"], ["Image (PNG/JPG)"]].map(([label]) => (
                            <span key={label} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-medium">{label}</span>
                          ))}
                        </div>
                      </div>
                      <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,image/*"
                        className="hidden" onChange={handleDocUpload} />
                    </div>
                  ) : docLoading ? (
                    <div className="text-center py-12 text-stone-400">
                      <div className="animate-spin w-8 h-8 border-2 border-stone-200 border-t-emerald-600 rounded-full mx-auto mb-3" />
                      Loading document…
                    </div>
                  ) : (
                    <div>
                      {/* Toolbar */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-sm text-stone-500 truncate flex-1 min-w-0">{docFile.name}</span>
                        {totalPages > 1 && (
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <button type="button" aria-label="Previous page" onClick={() => setCurrentPage(Math.max(0, currentPage-1))} disabled={currentPage === 0}
                              className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors">
                              <ChevronLeft size={16} />
                            </button>
                            <span className="font-medium">{currentPage+1} / {totalPages}</span>
                            <button type="button" aria-label="Next page" onClick={() => setCurrentPage(Math.min(totalPages-1, currentPage+1))} disabled={currentPage === totalPages-1}
                              className="p-1 rounded-lg hover:bg-stone-100 disabled:opacity-30 transition-colors">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                        <button type="button" onClick={() => { setDocFile(null); setDocPages([]); setSigBounds(null); setWordHtml(null); setDocArrayBuffer(null); }}
                          className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-50 transition-colors">
                          Change
                        </button>
                        {!sigBounds ? (
                          <button type="button" onClick={() => setPlacingMode(!placingMode)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              placingMode ? "bg-emerald-600 text-white" : "bg-stone-900 text-white hover:bg-emerald-600"
                            }`}>
                            {placingMode ? "✦ Click to place" : "✍ Place Signature"}
                          </button>
                        ) : (
                          <button type="button" onClick={exportSigned}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                            <Download size={15} />
                            Download Signed {docType === "image" ? "Image" : "PDF"}
                          </button>
                        )}
                      </div>

                      {placingMode && (
                        <div className="mb-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium text-center">
                          ✦ Click anywhere on the document to place your signature
                        </div>
                      )}

                      {/* Document viewer */}
                      <div
                        ref={docViewerRef}
                        onClick={handleDocClick}
                        onMouseMove={handleViewerMouseMove}
                        onMouseUp={handleViewerMouseUp}
                        onMouseLeave={handleViewerMouseUp}
                        className={`relative bg-white rounded-xl overflow-auto max-h-96 shadow-inner border-2 select-none transition-colors ${
                          placingMode ? "border-emerald-400 cursor-crosshair" :
                          dragging || resizing ? "border-stone-300 cursor-grabbing" :
                          "border-stone-200"
                        }`}
                      >
                        {docType === "word" && wordHtml ? (
                          <div className="p-10 font-serif text-sm leading-relaxed text-stone-900 min-h-96"
                            dangerouslySetInnerHTML={{ __html: wordHtml }} />
                        ) : docPages[currentPage] ? (
                          <img src={docPages[currentPage].dataUrl} alt="Document page"
                            className="w-full block align-top" />
                        ) : null}

                        {/* Draggable signature */}
                        {sigBounds && currentVariantData && (
                          <div
                            onMouseDown={handleSigMouseDown}
                            className="absolute border-2 border-emerald-500 rounded"
                            style={{ left: sigBounds.x, top: sigBounds.y, width: sigBounds.w, height: sigBounds.h, cursor: dragging ? "grabbing" : "grab", boxSizing: "border-box" }}
                          >
                            <img src={currentVariantData} alt="Signature"
                              className="w-full h-full object-contain block pointer-events-none" />
                            {/* Resize handle */}
                            <div onMouseDown={handleResizeMouseDown}
                              className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-sm bg-emerald-600 cursor-se-resize" />
                            {/* Remove */}
                            <button type="button" aria-label="Remove signature" onClick={(e) => { e.stopPropagation(); setSigBounds(null); }}
                              className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 shadow-sm">
                              <X size={11} />
                            </button>
                          </div>
                        )}
                      </div>

                      {sigBounds && (
                        <p className="text-xs text-stone-400 text-center mt-2">
                          Drag to move · Corner handle to resize · ✕ to remove
                        </p>
                      )}
                      {docType === "word" && (
                        <p className="text-xs text-stone-400 text-center mt-1">Word documents export as PDF with your signature embedded.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Saved ── */}
              {activeTab === "saved" && (
                <div>
                  {savedSignatures.length === 0 ? (
                    <div className="text-center py-10 text-stone-400">
                      <BookMarked size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No saved signatures yet.</p>
                      <p className="text-xs mt-1">Use "Save for Reuse" in the Download tab.</p>
                    </div>
                  ) : (
                    <div className="flex gap-4 flex-wrap">
                      {savedSignatures.map((s) => (
                        <div key={s.id} className="flex-none w-44 rounded-xl border border-stone-100 p-3 text-center bg-stone-50">
                          <div className="bg-white rounded-lg p-2 mb-2 border border-stone-100">
                            <img src={s.variants["black"]} alt="saved" className="w-full block" />
                          </div>
                          <p className="text-xs text-stone-500 mb-2">{s.label}</p>
                          <button type="button"
                            onClick={() => { setProcessedVariants(s.variants); setStep(3); showNotif("Loaded!"); }}
                            className="px-4 py-1 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-emerald-600 transition-colors">
                            Load
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer nav */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-stone-100 justify-center flex-wrap">
                <button type="button"
                  onClick={() => { setStep(2); setProcessedVariants(null); }}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
                  ← Redo Signature
                </button>
                <button type="button"
                  onClick={() => { setStep(1); setMode(null); setProcessedVariants(null); setDocFile(null); setDocPages([]); setSigBounds(null); }}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors">
                  ↩ Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
