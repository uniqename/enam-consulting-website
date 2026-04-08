import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

// ─── Constants ───────────────────────────────────────────────────────────────

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
  out.width = src.width;
  out.height = src.height;
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
  const w = canvas.width;
  const corners = [[0,1,2],[w*4,(w*4)+1,(w*4)+2],[(canvas.height-1)*w*4,((canvas.height-1)*w*4)+1,((canvas.height-1)*w*4)+2]];
  const [bgR,bgG,bgB] = [0,1,2].map((c) => Math.round(corners.reduce((s,p) => s + d[p[c]], 0) / 3));
  for (let i = 0; i < d.length; i += 4) {
    const dist = Math.sqrt((d[i]-bgR)**2 + (d[i+1]-bgG)**2 + (d[i+2]-bgB)**2);
    if (dist < 60) d[i+3] = 0;
    else if (dist < 120) d[i+3] = Math.round(((dist-60)/60)*d[i+3]);
  }
  ctx.putImageData(imgData, 0, 0);
  return out;
}

function btnStyle(bg: string, extra?: React.CSSProperties): React.CSSProperties {
  return { background: bg, border: "none", borderRadius: 10, padding: "10px 18px",
    cursor: "pointer", color: "#fff", fontFamily: "sans-serif", fontSize: 13,
    fontWeight: "500", transition: "opacity 0.2s", ...extra };
}

async function renderHtmlToCanvas(html: string, w = 794, h = 1123): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <foreignObject x="0" y="0" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="width:${w-80}px;padding:40px;
        font-family:Georgia,serif;font-size:12px;line-height:1.7;background:#fff;color:#111;">
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
interface DocPage { dataUrl: string; pdfW: number; pdfH: number; } // pdfW/H = 0 for images/word

interface Props { onClose: () => void; }

// ─── Component ───────────────────────────────────────────────────────────────

export default function SignatureGenerator({ onClose }: Props) {

  // — Signature creation state
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"draw" | "upload" | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processedVariants, setProcessedVariants] = useState<Variants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2.5);
  const [savedSignatures, setSavedSignatures] = useState<Array<{ id: number; variants: Variants; label: string }>>([]);
  const [activeTab, setActiveTab] = useState("download");
  const [notification, setNotification] = useState<{ msg: string; type: string } | null>(null);

  // — Document signing state
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

  // — Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const docViewerRef = useRef<HTMLDivElement>(null);

  // ─ Touch drawing ────────────────────────────────────────────────────────────
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

  const showNotif = (msg: string, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ─ Mouse drawing ────────────────────────────────────────────────────────────
  const mp = (e: React.MouseEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  };
  const startDraw = (e: React.MouseEvent) => {
    const c = canvasRef.current; if (!c) return;
    setIsDrawing(true); lastPos.current = mp(e, c);
  };
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

  // ─ Generate variants ────────────────────────────────────────────────────────
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

  // ─ Download helpers ─────────────────────────────────────────────────────────
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
    } catch { showNotif("Copy failed — try Download instead", "error"); }
  };
  const saveSignature = () => {
    if (!processedVariants) return;
    setSavedSignatures((p) => [...p, { id: Date.now(), variants: processedVariants, label: `Sig ${p.length+1}` }]);
    showNotif("Saved for reuse!");
  };

  // ─ Document loading ─────────────────────────────────────────────────────────
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
    } catch (err) {
      showNotif("Could not load document", "error");
      console.error(err);
    }
    setDocLoading(false);
  };

  const loadPDF = async (ab: ArrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
    const pages: DocPage[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const vpScale1 = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: 2 }); // render at 2x for crispness
      const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      await page.render({ canvasContext: c.getContext("2d")!, viewport: vp }).promise;
      pages.push({ dataUrl: c.toDataURL("image/png"), pdfW: vpScale1.width, pdfH: vpScale1.height });
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
      img.onload = () => {
        setDocPages([{ dataUrl: ev.target?.result as string, pdfW: img.naturalWidth, pdfH: img.naturalHeight }]);
        setCurrentPage(0); res();
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  });

  // ─ Signature placement ──────────────────────────────────────────────────────
  const handleDocClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placingMode || !docViewerRef.current) return;
    const r = docViewerRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setSigBounds({ x: x - DEFAULT_SIG_W / 2, y: y - DEFAULT_SIG_H / 2, w: DEFAULT_SIG_W, h: DEFAULT_SIG_H });
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
    if (dragging && sigBounds) {
      setSigBounds({ ...sigBounds, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (resizing && sigBounds) {
      const dw = e.clientX - resizeStart.x;
      const dh = e.clientY - resizeStart.y;
      setSigBounds({ ...sigBounds, w: Math.max(60, resizeStart.w + dw), h: Math.max(20, resizeStart.h + dh) });
    }
  };

  const handleViewerMouseUp = () => { setDragging(false); setResizing(false); };

  // ─ Export signed document ───────────────────────────────────────────────────
  const exportSigned = async () => {
    if (!sigBounds || !processedVariants || !docViewerRef.current) return;
    const viewerEl = docViewerRef.current;
    const { width: displayW, height: displayH } = viewerEl.getBoundingClientRect();
    const sigDataUrl = processedVariants[selectedVariant];
    showNotif("Preparing download…");

    try {
      if (docType === "pdf" && docArrayBuffer) {
        await exportAsPDF(displayW, displayH, sigDataUrl);
      } else if (docType === "image") {
        await exportAsImage(displayW, displayH, sigDataUrl);
      } else if (docType === "word" && wordHtml) {
        await exportWordAsPDF(displayW, displayH, sigDataUrl);
      }
    } catch (err) {
      showNotif("Export failed", "error");
      console.error(err);
    }
  };

  const exportAsPDF = async (displayW: number, displayH: number, sigDataUrl: string) => {
    const pdfDoc = await PDFDocument.load(docArrayBuffer!);
    const page = pdfDoc.getPages()[currentPage];
    const { width: pageW, height: pageH } = page.getSize();

    // Display coords → PDF pts (PDF origin = bottom-left)
    const sx = pageW / displayW;
    const sy = pageH / displayH;
    const pdfX = sigBounds!.x * sx;
    const pdfY = pageH - (sigBounds!.y + sigBounds!.h) * sy;
    const pdfW = sigBounds!.w * sx;
    const pdfH = sigBounds!.h * sy;

    const pngBytes = await (await fetch(sigDataUrl)).arrayBuffer();
    const pngImage = await pdfDoc.embedPng(pngBytes);
    page.drawImage(pngImage, { x: pdfX, y: pdfY, width: pdfW, height: pdfH });

    const bytes = await pdfDoc.save();
    const a = document.createElement("a");
    a.download = `signed_${docFile?.name ?? "document"}.pdf`;
    a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    a.click(); showNotif("Signed PDF downloaded!");
  };

  const exportAsImage = async (displayW: number, displayH: number, sigDataUrl: string) => {
    const page = docPages[currentPage];
    const imgEl = docViewerRef.current!.querySelector("img");
    const natW = imgEl?.naturalWidth || page.pdfW || displayW;
    const natH = imgEl?.naturalHeight || page.pdfH || displayH;

    const c = document.createElement("canvas"); c.width = natW; c.height = natH;
    const ctx = c.getContext("2d")!;

    await new Promise<void>((res) => {
      const docImg = new Image();
      docImg.onload = () => { ctx.drawImage(docImg, 0, 0); res(); };
      docImg.src = page.dataUrl;
    });

    const sx = natW / displayW; const sy = natH / displayH;
    await new Promise<void>((res) => {
      const sigImg = new Image();
      sigImg.onload = () => {
        ctx.drawImage(sigImg, sigBounds!.x * sx, sigBounds!.y * sy, sigBounds!.w * sx, sigBounds!.h * sy);
        res();
      };
      sigImg.src = sigDataUrl;
    });

    const a = document.createElement("a");
    a.download = `signed_${docFile?.name ?? "document"}.png`;
    a.href = c.toDataURL("image/png"); a.click(); showNotif("Signed image downloaded!");
  };

  const exportWordAsPDF = async (displayW: number, displayH: number, sigDataUrl: string) => {
    const W = 794, H = 1123;
    const wordCanvas = await renderHtmlToCanvas(wordHtml!, W, H);
    const ctx = wordCanvas.getContext("2d")!;
    const sx = W / displayW; const sy = H / displayH;
    await new Promise<void>((res) => {
      const sigImg = new Image();
      sigImg.onload = () => {
        ctx.drawImage(sigImg, sigBounds!.x * sx, sigBounds!.y * sy, sigBounds!.w * sx, sigBounds!.h * sy);
        res();
      };
      sigImg.src = sigDataUrl;
    });

    const pdfDoc = await PDFDocument.create();
    const pdfPage = pdfDoc.addPage([W, H]);
    const pngBytes = await (await fetch(wordCanvas.toDataURL("image/png"))).arrayBuffer();
    pdfPage.drawImage(await pdfDoc.embedPng(pngBytes), { x: 0, y: 0, width: W, height: H });

    const bytes = await pdfDoc.save();
    const a = document.createElement("a");
    a.download = `signed_${docFile?.name ?? "document"}.pdf`;
    a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    a.click(); showNotif("Signed document downloaded as PDF!");
  };

  // ─ Derived ──────────────────────────────────────────────────────────────────
  const currentVariantData = processedVariants?.[selectedVariant];
  const totalPages = docPages.length;

  // ─ Styles ───────────────────────────────────────────────────────────────────
  const gold = "#c9a96e"; const goldLight = "#f0d090";
  const surface = "rgba(255,255,255,0.04)";
  const border = "1px solid rgba(255,255,255,0.1)";

  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.65)", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 50%,#16213e 100%)",
          borderRadius: 20, width: "100%", maxWidth: 880, maxHeight: "93vh",
          overflowY: "auto", fontFamily: "'Georgia','Times New Roman',serif",
          color: "#e8e4dc", position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Notification */}
        {notification && (
          <div style={{ position: "absolute", top: 14, right: 60, zIndex: 9999,
            background: notification.type === "error" ? "#7f1d1d" : "#14532d",
            color: "#fff", padding: "9px 16px", borderRadius: 9, fontSize: 13,
            fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
            {notification.msg}
          </div>
        )}

        {/* Close */}
        <button type="button" onClick={onClose}
          style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.1)",
            border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer",
            color: "#e8e4dc", fontSize: 16, display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 10 }}>✕</button>

        {/* Header */}
        <div style={{ background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "18px 22px", display: "flex", alignItems: "center", gap: 14,
          borderRadius: "20px 20px 0 0" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10,
            background: `linear-gradient(135deg,${gold},${goldLight})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✍️</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: "bold", letterSpacing: 1, color: goldLight }}>
              Digital Signature Generator
            </div>
            <div style={{ fontSize: 11, color: "#9a8a70", fontFamily: "sans-serif" }}>
              Draw or upload · Choose style · Sign documents
            </div>
          </div>
          {savedSignatures.length > 0 && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {savedSignatures.map((s) => (
                <button key={s.id} type="button"
                  onClick={() => { setProcessedVariants(s.variants); setStep(3); showNotif("Signature loaded!"); }}
                  style={{ background: "rgba(240,208,144,0.12)", border: `1px solid rgba(240,208,144,0.3)`,
                    color: goldLight, borderRadius: 8, padding: "4px 10px", cursor: "pointer",
                    fontSize: 11, fontFamily: "sans-serif" }}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", padding: "18px 16px 6px", gap: 0 }}>
          {["Create","Style","Sign"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%",
                  background: step > i+1 ? gold : step === i+1 ? `linear-gradient(135deg,${gold},${goldLight})` : "transparent",
                  border: step >= i+1 ? `2px solid ${gold}` : "2px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontFamily: "sans-serif",
                  color: step >= i+1 ? "#1a1a1a" : "#666", fontWeight: "bold" }}>
                  {step > i+1 ? "✓" : i+1}
                </div>
                <div style={{ fontSize: 10, fontFamily: "sans-serif", color: step === i+1 ? goldLight : "#666" }}>
                  {label}
                </div>
              </div>
              {i < 2 && <div style={{ width: 40, height: 2, margin: "0 4px", marginBottom: 18,
                background: step > i+1 ? gold : "rgba(255,255,255,0.08)" }} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "14px 20px 28px", maxWidth: 840, margin: "0 auto" }}>

          {/* ── STEP 1: Choose mode ──────────────────────────────────────── */}
          {step === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 19, color: goldLight, marginBottom: 6 }}>
                How would you like to create your signature?
              </div>
              <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#9a8a70", marginBottom: 26 }}>
                Draw it by hand, or upload a photo of your existing signature
              </div>
              <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
                {[{ k: "draw", icon: "✏️", title: "Draw", sub: "Mouse, touch, or stylus" },
                  { k: "upload", icon: "📤", title: "Upload Photo", sub: "JPG, PNG, HEIC — auto-cleaned" }].map(({ k, icon, title, sub }) => (
                  <button key={k} type="button"
                    onClick={() => { setMode(k as "draw" | "upload"); setStep(2); }}
                    style={{ background: "rgba(240,208,144,0.07)", border: "1px solid rgba(240,208,144,0.2)",
                      borderRadius: 14, padding: "26px 34px", cursor: "pointer", color: goldLight,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      minWidth: 155, transition: "background 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.14)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.07)")}>
                    <div style={{ fontSize: 38 }}>{icon}</div>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>{title}</div>
                    <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2: Draw ──────────────────────────────────────────────── */}
          {step === 2 && mode === "draw" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 19, color: goldLight, marginBottom: 3 }}>Sign in the box below</div>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                  Use your finger, mouse, or stylus. Keep it natural — imperfections are authentic.
                </div>
              </div>
              <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>Stroke:</span>
                {[{ v: 1.2, l: "Thin" }, { v: 2.5, l: "Medium" }, { v: 4.5, l: "Bold" }].map(({ v, l }) => (
                  <button key={v} type="button" onClick={() => setStrokeWidth(v)}
                    style={{ background: strokeWidth === v ? "rgba(240,208,144,0.2)" : "rgba(255,255,255,0.05)",
                      border: strokeWidth === v ? `1px solid ${gold}` : border,
                      borderRadius: 8, padding: "4px 12px", cursor: "pointer",
                      color: strokeWidth === v ? goldLight : "#9a8a70",
                      fontSize: 12, fontFamily: "sans-serif" }}>{l}</button>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)", cursor: "crosshair", touchAction: "none" }}>
                <canvas ref={canvasRef} width={600} height={200}
                  style={{ display: "block", width: "100%", maxWidth: 600, margin: "0 auto" }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button type="button" onClick={clearCanvas} style={btnStyle("rgba(255,255,255,0.1)", { border })}>Clear</button>
                <button type="button" onClick={() => setStep(1)} style={btnStyle("rgba(255,255,255,0.1)", { border })}>← Back</button>
                <button type="button" onClick={generateFromDraw}
                  style={btnStyle(`linear-gradient(135deg,${gold},${goldLight})`, { color: "#1a1a1a", fontWeight: "bold" })}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Upload ────────────────────────────────────────────── */}
          {step === 2 && mode === "upload" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 19, color: goldLight, marginBottom: 6 }}>Upload your signature</div>
              <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70", marginBottom: 18 }}>
                Take a photo of your handwritten signature. Background is automatically removed.
              </div>
              <div onClick={() => fileInputRef.current?.click()}
                style={{ border: "2px dashed rgba(240,208,144,0.3)", borderRadius: 14, padding: "38px 24px",
                  cursor: "pointer", background: "rgba(240,208,144,0.04)", transition: "background 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.09)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.04)")}>
                <div style={{ fontSize: 38, marginBottom: 10 }}>📁</div>
                <div style={{ fontSize: 14, color: goldLight, marginBottom: 6 }}>Click to browse or drag &amp; drop</div>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>JPG · PNG · HEIC</div>
              </div>
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.heic,image/*"
                style={{ display: "none" }} onChange={handleImageUpload} />
              <div style={{ marginTop: 14 }}>
                <button type="button" onClick={() => setStep(1)} style={btnStyle("rgba(255,255,255,0.1)", { border })}>← Back</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Style + Export ────────────────────────────────────── */}
          {step === 3 && processedVariants && (
            <div>
              {/* Ink selector */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
                {INK_OPTIONS.map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setSelectedVariant(opt.id)}
                    style={{ background: selectedVariant === opt.id ? "rgba(240,208,144,0.18)" : surface,
                      border: selectedVariant === opt.id ? `1px solid ${gold}` : border,
                      borderRadius: 10, padding: "6px 14px", cursor: "pointer",
                      color: selectedVariant === opt.id ? goldLight : "#9a8a70",
                      fontFamily: "sans-serif", fontSize: 12,
                      display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                      background: opt.color, border: "1px solid rgba(255,255,255,0.2)" }} />
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Signature preview */}
              <div style={{ background: "repeating-conic-gradient(#2a2a3a 0% 25%,#1e1e2e 0% 50%) 0 0/20px 20px",
                borderRadius: 10, padding: 20, display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 110, marginBottom: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
                {currentVariantData && (
                  <img src={currentVariantData} alt="Signature preview"
                    style={{ maxWidth: "90%", maxHeight: 110, imageRendering: "crisp-edges" }} />
                )}
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 16 }}>
                {[["download","⬇ Download"],["sign","📄 Sign Document"],["saved","🗂 Saved"]].map(([tab, label]) => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px",
                      color: activeTab === tab ? goldLight : "#9a8a70",
                      borderBottom: activeTab === tab ? `2px solid ${gold}` : "2px solid transparent",
                      fontFamily: "sans-serif", fontSize: 13 }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Download tab ── */}
              {activeTab === "download" && (
                <div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 12 }}>
                    <button type="button" onClick={downloadPNG} style={btnStyle("#1a5c3a")}>PNG (Transparent)</button>
                    <button type="button" onClick={downloadSVG} style={btnStyle("#1a3a5c")}>SVG (Scalable)</button>
                    <button type="button" onClick={copyToClipboard} style={btnStyle("#3a1a5c")}>Copy to Clipboard</button>
                    <button type="button" onClick={saveSignature} style={btnStyle("#5c3a1a")}>Save for Reuse</button>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, fontFamily: "sans-serif", color: "#9a8a70" }}>
                    PNG has transparent background — paste directly into Word, Gmail, PDFs, or any app.
                  </div>
                </div>
              )}

              {/* ── Sign Document tab ── */}
              {activeTab === "sign" && (
                <div>
                  {!docFile ? (
                    /* Upload zone */
                    <div>
                      <div style={{ fontSize: 13, fontFamily: "sans-serif", color: "#9a8a70", marginBottom: 14, textAlign: "center" }}>
                        Upload your document below — then click to place your signature exactly where you need it.
                      </div>
                      <div onClick={() => docInputRef.current?.click()}
                        style={{ border: "2px dashed rgba(240,208,144,0.28)", borderRadius: 14, padding: "36px 24px",
                          textAlign: "center", cursor: "pointer", background: "rgba(240,208,144,0.04)",
                          transition: "background 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.09)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(240,208,144,0.04)")}>
                        <div style={{ fontSize: 38, marginBottom: 10 }}>📂</div>
                        <div style={{ color: goldLight, fontFamily: "sans-serif", fontSize: 15, marginBottom: 8 }}>
                          Upload Document to Sign
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                          {[["📄","PDF"],["📝","Word (.docx)"],["🖼","Image (PNG/JPG)"]].map(([icon, label]) => (
                            <span key={label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6,
                              padding: "4px 10px", fontSize: 11, fontFamily: "sans-serif", color: "#9a8a70" }}>
                              {icon} {label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,image/*"
                        style={{ display: "none" }} onChange={handleDocUpload} />
                    </div>
                  ) : docLoading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#9a8a70", fontFamily: "sans-serif" }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
                      Loading document…
                    </div>
                  ) : (
                    /* Document viewer */
                    <div>
                      {/* Toolbar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70", flex: 1 }}>
                          {docFile.name}
                          {totalPages > 1 && (
                            <span style={{ marginLeft: 10 }}>
                              <button type="button" onClick={() => setCurrentPage(Math.max(0, currentPage-1))}
                                disabled={currentPage === 0}
                                style={{ background: "none", border: border, borderRadius: 6, color: "#9a8a70",
                                  cursor: "pointer", padding: "2px 8px", fontSize: 12, marginRight: 6 }}>◀</button>
                              Page {currentPage+1} / {totalPages}
                              <button type="button" onClick={() => setCurrentPage(Math.min(totalPages-1, currentPage+1))}
                                disabled={currentPage === totalPages-1}
                                style={{ background: "none", border: border, borderRadius: 6, color: "#9a8a70",
                                  cursor: "pointer", padding: "2px 8px", fontSize: 12, marginLeft: 6 }}>▶</button>
                            </span>
                          )}
                        </div>
                        <button type="button"
                          onClick={() => { setDocFile(null); setDocPages([]); setSigBounds(null); setWordHtml(null); setDocArrayBuffer(null); }}
                          style={{ ...btnStyle("rgba(255,255,255,0.08)", { border, fontSize: 12, padding: "6px 12px" }) }}>
                          Change Doc
                        </button>
                        {!sigBounds ? (
                          <button type="button"
                            onClick={() => setPlacingMode(!placingMode)}
                            style={btnStyle(placingMode ? `linear-gradient(135deg,${gold},${goldLight})` : "#1a5c3a",
                              { color: placingMode ? "#1a1a1a" : "#fff", fontWeight: "bold", fontSize: 12, padding: "7px 14px" })}>
                            {placingMode ? "✦ Click on document to sign" : "✍ Place Signature"}
                          </button>
                        ) : (
                          <button type="button" onClick={exportSigned}
                            style={btnStyle(`linear-gradient(135deg,${gold},${goldLight})`,
                              { color: "#1a1a1a", fontWeight: "bold", fontSize: 12, padding: "7px 14px" })}>
                            ⬇ Download Signed {docType === "pdf" ? "PDF" : docType === "word" ? "as PDF" : "Image"}
                          </button>
                        )}
                      </div>

                      {/* Instructions banner (placing mode) */}
                      {placingMode && (
                        <div style={{ background: `linear-gradient(135deg,${gold}22,${goldLight}11)`,
                          border: `1px solid ${gold}55`, borderRadius: 8, padding: "8px 14px",
                          fontSize: 12, fontFamily: "sans-serif", color: goldLight, marginBottom: 8,
                          textAlign: "center" }}>
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
                        style={{ position: "relative", background: "#f0ede8",
                          borderRadius: 8, overflow: "hidden",
                          cursor: placingMode ? "crosshair" : dragging || resizing ? "grabbing" : "default",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          border: placingMode ? `2px solid ${gold}` : "2px solid transparent",
                          maxHeight: "60vh", overflowY: "auto", userSelect: "none" }}
                      >
                        {/* Page content */}
                        {docType === "word" && wordHtml ? (
                          <div style={{ padding: 40, background: "#fff", minHeight: 400,
                            fontFamily: "Georgia, serif", fontSize: 12, lineHeight: 1.7, color: "#111" }}
                            dangerouslySetInnerHTML={{ __html: wordHtml }} />
                        ) : docPages[currentPage] ? (
                          <img
                            src={docPages[currentPage].dataUrl}
                            alt="Document page"
                            style={{ width: "100%", display: "block", verticalAlign: "top" }}
                          />
                        ) : null}

                        {/* Signature overlay */}
                        {sigBounds && currentVariantData && (
                          <div
                            onMouseDown={handleSigMouseDown}
                            style={{ position: "absolute",
                              left: sigBounds.x, top: sigBounds.y,
                              width: sigBounds.w, height: sigBounds.h,
                              cursor: dragging ? "grabbing" : "grab",
                              border: `2px solid ${gold}`,
                              borderRadius: 4,
                              boxSizing: "border-box" }}
                          >
                            <img
                              src={currentVariantData}
                              alt="Signature"
                              style={{ width: "100%", height: "100%", objectFit: "contain",
                                display: "block", pointerEvents: "none" }}
                            />
                            {/* SE resize handle */}
                            <div
                              onMouseDown={handleResizeMouseDown}
                              style={{ position: "absolute", bottom: -5, right: -5,
                                width: 12, height: 12, borderRadius: 2,
                                background: gold, cursor: "se-resize" }}
                            />
                            {/* Remove button */}
                            <div
                              onClick={(e) => { e.stopPropagation(); setSigBounds(null); }}
                              style={{ position: "absolute", top: -10, right: -10,
                                width: 18, height: 18, borderRadius: "50%",
                                background: "#7f1d1d", color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, cursor: "pointer", fontFamily: "sans-serif" }}>✕</div>
                          </div>
                        )}
                      </div>

                      {/* Hint */}
                      {sigBounds && (
                        <div style={{ marginTop: 8, fontSize: 11, fontFamily: "sans-serif",
                          color: "#9a8a70", textAlign: "center" }}>
                          Drag to move · Drag corner handle to resize · Click ✕ to remove
                        </div>
                      )}

                      {docType === "word" && (
                        <div style={{ marginTop: 6, fontSize: 11, fontFamily: "sans-serif",
                          color: "#9a8a70", textAlign: "center" }}>
                          Word documents are exported as PDF with your signature embedded.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Saved tab ── */}
              {activeTab === "saved" && (
                <div>
                  {savedSignatures.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#9a8a70", fontFamily: "sans-serif",
                      fontSize: 13, padding: 24 }}>
                      No saved signatures yet. Use "Save for Reuse" in the Download tab.
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {savedSignatures.map((s) => (
                        <div key={s.id} style={{ border, borderRadius: 10, padding: 12,
                          background: surface, flex: "0 0 160px", textAlign: "center" }}>
                          <div style={{ background: "repeating-conic-gradient(#2a2a3a 0% 25%,#1e1e2e 0% 50%) 0 0/16px 16px",
                            borderRadius: 6, padding: 6, marginBottom: 8 }}>
                            <img src={s.variants["black"]} alt="saved"
                              style={{ width: "100%", display: "block" }} />
                          </div>
                          <div style={{ fontSize: 11, color: "#9a8a70", fontFamily: "sans-serif", marginBottom: 6 }}>
                            {s.label}
                          </div>
                          <button type="button"
                            onClick={() => { setProcessedVariants(s.variants); setStep(3); showNotif("Signature loaded!"); }}
                            style={{ background: "rgba(240,208,144,0.1)", border: `1px solid rgba(240,208,144,0.3)`,
                              borderRadius: 6, padding: "3px 10px", cursor: "pointer",
                              color: goldLight, fontFamily: "sans-serif", fontSize: 11 }}>
                            Load
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer nav */}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <button type="button"
                  onClick={() => { setStep(2); setProcessedVariants(null); }}
                  style={btnStyle("rgba(255,255,255,0.07)", { border, fontSize: 12 })}>
                  ← Redo Signature
                </button>
                <button type="button"
                  onClick={() => { setStep(1); setMode(null); setProcessedVariants(null); setDocFile(null); setDocPages([]); setSigBounds(null); }}
                  style={btnStyle("rgba(255,255,255,0.07)", { border, fontSize: 12 })}>
                  ↩ Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`input[type=range]{height:4px;cursor:pointer;accent-color:${gold};}`}</style>
      </div>
    </div>
  );
}
