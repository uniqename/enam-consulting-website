import { useState, useRef, useEffect } from "react";

const INK_OPTIONS = [
  { id: "black", label: "Black Ink", color: "#1a1a1a", stroke: 2.5 },
  { id: "blue", label: "Blue Ink", color: "#1a3a8f", stroke: 2.5 },
  { id: "thin", label: "Thin Stroke", color: "#1a1a1a", stroke: 1.2 },
  { id: "bold", label: "Bold Stroke", color: "#0d0d0d", stroke: 4.5 },
];

type InkOption = (typeof INK_OPTIONS)[0];
type Variants = Record<string, string>;

function processSignatureCanvas(
  sourceCanvas: HTMLCanvasElement,
  inkOption: InkOption
): HTMLCanvasElement {
  const { color } = inkOption;
  const out = document.createElement("canvas");
  out.width = sourceCanvas.width;
  out.height = sourceCanvas.height;
  const ctx = out.getContext("2d")!;
  const src = sourceCanvas.getContext("2d")!;
  const imgData = src.getImageData(0, 0, out.width, out.height);
  const data = imgData.data;
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 10) {
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = alpha;
    } else {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return out;
}

function removeBackground(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, out.width, out.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;
  const cornerPixels = [
    [data[0], data[1], data[2]],
    [data[(w - 1) * 4], data[(w - 1) * 4 + 1], data[(w - 1) * 4 + 2]],
    [
      data[(h - 1) * w * 4],
      data[(h - 1) * w * 4 + 1],
      data[(h - 1) * w * 4 + 2],
    ],
  ];
  const bgR = Math.round(cornerPixels.reduce((s, p) => s + p[0], 0) / 3);
  const bgG = Math.round(cornerPixels.reduce((s, p) => s + p[1], 0) / 3);
  const bgB = Math.round(cornerPixels.reduce((s, p) => s + p[2], 0) / 3);
  for (let i = 0; i < data.length; i += 4) {
    const dr = Math.abs(data[i] - bgR);
    const dg = Math.abs(data[i + 1] - bgG);
    const db = Math.abs(data[i + 2] - bgB);
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist < 60) {
      data[i + 3] = 0;
    } else if (dist < 120) {
      data[i + 3] = Math.round(((dist - 60) / 60) * data[i + 3]);
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return out;
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    border: "none",
    borderRadius: 10,
    padding: "11px 20px",
    cursor: "pointer",
    color: "#fff",
    fontFamily: "sans-serif",
    fontSize: 13,
    fontWeight: "500",
    transition: "opacity 0.2s",
  };
}

interface Props {
  onClose: () => void;
}

export default function SignatureGenerator({ onClose }: Props) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"draw" | "upload" | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [processedVariants, setProcessedVariants] = useState<Variants | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("black");
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [savedSignatures, setSavedSignatures] = useState<
    Array<{ id: number; variants: Variants; label: string }>
  >([]);
  const [activeTab, setActiveTab] = useState("download");
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [stampPos, setStampPos] = useState({ x: 100, y: 100 });
  const [isDraggingStamp, setIsDraggingStamp] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(2.5);
  const [notification, setNotification] = useState<{
    msg: string;
    type: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);

  // Non-passive touch listeners to prevent page scroll while drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getTouchPos = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
        y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      lastPos.current = getTouchPos(e);
      setIsDrawing(true);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current || !lastPos.current) return;
      const ctx = canvas.getContext("2d")!;
      const pos = getTouchPos(e);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = false;
      lastPos.current = null;
      setIsDrawing(false);
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [step, mode, strokeWidth]);

  const showNotif = (msg: string, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const getMousePos = (e: React.MouseEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    lastPos.current = getMousePos(e, canvas);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getMousePos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const generateVariants = (sourceCanvas: HTMLCanvasElement) => {
    const variants: Variants = {};
    INK_OPTIONS.forEach((opt) => {
      variants[opt.id] = processSignatureCanvas(sourceCanvas, opt).toDataURL("image/png");
    });
    setProcessedVariants(variants);
    setStep(3);
  };

  const generateFromDraw = () => {
    generateVariants(canvasRef.current!);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 600, 200);
        const ratio = Math.min(600 / img.width, 200 / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, (600 - w) / 2, (200 - h) / 2, w, h);
        generateVariants(removeBackground(canvas));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadPNG = () => {
    if (!processedVariants) return;
    const link = document.createElement("a");
    link.download = `signature_${selectedVariant}.png`;
    link.href = processedVariants[selectedVariant];
    link.click();
    showNotif("PNG downloaded!");
  };

  const downloadSVG = () => {
    if (!processedVariants) return;
    const dataUrl = processedVariants[selectedVariant];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="200"><image href="${dataUrl}" width="600" height="200"/></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `signature_${selectedVariant}.svg`;
    link.href = url;
    link.click();
    showNotif("SVG downloaded!");
  };

  const copyToClipboard = async () => {
    if (!processedVariants) return;
    try {
      const response = await fetch(processedVariants[selectedVariant]);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showNotif("Copied to clipboard!");
    } catch {
      showNotif("Copy failed — use Download instead", "error");
    }
  };

  const saveSignature = () => {
    if (!processedVariants) return;
    setSavedSignatures((prev) => [
      ...prev,
      { id: Date.now(), variants: processedVariants, label: `Signature ${prev.length + 1}` },
    ]);
    showNotif("Signature saved!");
  };

  const loadSaved = (sig: { variants: Variants }) => {
    setProcessedVariants(sig.variants);
    setStep(3);
    showNotif("Signature loaded!");
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setDocPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setDocPreview("placeholder");
    }
  };

  const handleStampMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingStamp(true);
    const rect = stampRef.current?.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    });
  };

  const handleDocMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingStamp) return;
    const docEl = e.currentTarget.getBoundingClientRect();
    setStampPos({
      x: e.clientX - docEl.left - dragOffset.x,
      y: e.clientY - docEl.top - dragOffset.y,
    });
  };

  const applyStamp = () => {
    if (!docPreview || !processedVariants) return;
    const canvas = document.createElement("canvas");
    const docImg = new Image();
    docImg.onload = () => {
      canvas.width = docImg.width;
      canvas.height = docImg.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(docImg, 0, 0);
      const sigImg = new Image();
      sigImg.onload = () => {
        const stampW = (scale / 100) * 200;
        const stampH = (scale / 100) * 67;
        const docEl = document.querySelector(".doc-preview-area");
        const docRect = docEl?.getBoundingClientRect();
        const scaleDocX = docImg.width / (docRect?.width || 1);
        const scaleDocY = docImg.height / (docRect?.height || 1);
        ctx.save();
        ctx.translate(
          (stampPos.x + stampW / 2) * scaleDocX,
          (stampPos.y + stampH / 2) * scaleDocY
        );
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          sigImg,
          (-stampW / 2) * scaleDocX,
          (-stampH / 2) * scaleDocY,
          stampW * scaleDocX,
          stampH * scaleDocY
        );
        ctx.restore();
        const link = document.createElement("a");
        link.download = "signed_document.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        showNotif("Signed document downloaded!");
      };
      sigImg.src = processedVariants[selectedVariant];
    };
    docImg.src = docPreview;
  };

  const currentVariantData = processedVariants?.[selectedVariant];

  return (
    // Modal overlay
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      {/* Modal content — stop propagation so clicks inside don't close */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 860,
          maxHeight: "92vh",
          overflowY: "auto",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: "#e8e4dc",
          position: "relative",
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notification */}
        {notification && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 60,
              zIndex: 9999,
              background: notification.type === "error" ? "#7f1d1d" : "#14532d",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "sans-serif",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {notification.msg}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            color: "#e8e4dc",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            borderRadius: "20px 20px 0 0",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #c9a96e, #f0d090)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ✍️
          </div>
          <div>
            <div
              style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 1, color: "#f0d090" }}
            >
              Digital Signature Generator
            </div>
            <div style={{ fontSize: 11, color: "#9a8a70", fontFamily: "sans-serif" }}>
              Professional signatures for any document
            </div>
          </div>
          {savedSignatures.length > 0 && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
              {savedSignatures.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSaved(s)}
                  style={{
                    background: "rgba(240,208,144,0.12)",
                    border: "1px solid rgba(240,208,144,0.3)",
                    color: "#f0d090",
                    borderRadius: 8,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontSize: 11,
                    fontFamily: "sans-serif",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px 16px 8px",
            gap: 0,
          }}
        >
          {["Choose", "Create", "Export"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      step > i + 1
                        ? "#c9a96e"
                        : step === i + 1
                        ? "linear-gradient(135deg, #c9a96e, #f0d090)"
                        : "transparent",
                    border:
                      step >= i + 1
                        ? "2px solid #c9a96e"
                        : "2px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontFamily: "sans-serif",
                    color: step >= i + 1 ? "#1a1a1a" : "#666",
                    fontWeight: "bold",
                    transition: "all 0.3s",
                  }}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "sans-serif",
                    color: step === i + 1 ? "#f0d090" : "#666",
                  }}
                >
                  {label}
                </div>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    margin: "0 4px",
                    marginBottom: 18,
                    background: step > i + 1 ? "#c9a96e" : "rgba(255,255,255,0.08)",
                    transition: "background 0.3s",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px 28px", maxWidth: 800, margin: "0 auto" }}>
          {/* STEP 1 — Choose mode */}
          {step === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6, color: "#f0d090" }}>
                How would you like to create your signature?
              </div>
              <div
                style={{ fontSize: 13, fontFamily: "sans-serif", color: "#9a8a70", marginBottom: 28 }}
              >
                Draw directly or upload a photo of your handwritten signature
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { key: "draw", icon: "✏️", title: "Draw", sub: "Mouse, touch, or stylus" },
                  { key: "upload", icon: "📤", title: "Upload", sub: "JPG, PNG, HEIC photo" },
                ].map(({ key, icon, title, sub }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMode(key as "draw" | "upload");
                      setStep(2);
                    }}
                    style={{
                      background: "rgba(240,208,144,0.07)",
                      border: "1px solid rgba(240,208,144,0.2)",
                      borderRadius: 14,
                      padding: "28px 36px",
                      cursor: "pointer",
                      color: "#f0d090",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 160,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(240,208,144,0.14)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(240,208,144,0.07)")
                    }
                  >
                    <div style={{ fontSize: 40 }}>{icon}</div>
                    <div style={{ fontSize: 16, fontWeight: "bold" }}>{title}</div>
                    <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                      {sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — Draw */}
          {step === 2 && mode === "draw" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 20, color: "#f0d090", marginBottom: 4 }}>
                  Sign in the box below
                </div>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                  Use your finger, mouse, or stylus
                </div>
              </div>
              <div
                style={{
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                  Stroke:
                </span>
                {[1.2, 2.5, 4.5].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    style={{
                      background:
                        strokeWidth === w
                          ? "rgba(240,208,144,0.2)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        strokeWidth === w
                          ? "1px solid #c9a96e"
                          : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      padding: "4px 12px",
                      cursor: "pointer",
                      color: strokeWidth === w ? "#f0d090" : "#9a8a70",
                      fontSize: 12,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {w === 1.2 ? "Thin" : w === 2.5 ? "Medium" : "Bold"}
                  </button>
                ))}
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  cursor: "crosshair",
                  touchAction: "none",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  style={{ display: "block", width: "100%", maxWidth: 600, margin: "0 auto" }}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 14,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={clearCanvas}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#e8e4dc",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#e8e4dc",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={generateFromDraw}
                  style={{
                    background: "linear-gradient(135deg, #c9a96e, #f0d090)",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 28px",
                    cursor: "pointer",
                    color: "#1a1a1a",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  Generate Signature →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Upload */}
          {step === 2 && mode === "upload" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, color: "#f0d090", marginBottom: 6 }}>
                Upload your signature
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "sans-serif",
                  color: "#9a8a70",
                  marginBottom: 20,
                }}
              >
                JPG, PNG, JPEG, or HEIC accepted. Background will be automatically removed.
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed rgba(240,208,144,0.3)",
                  borderRadius: 14,
                  padding: "40px 24px",
                  cursor: "pointer",
                  background: "rgba(240,208,144,0.04)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(240,208,144,0.09)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(240,208,144,0.04)")
                }
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
                <div style={{ fontSize: 15, color: "#f0d090", marginBottom: 6 }}>
                  Click to browse or drag &amp; drop
                </div>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                  JPG · PNG · JPEG · HEIC
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.heic,image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#e8e4dc",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                  }}
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Preview & Export */}
          {step === 3 && processedVariants && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 20, color: "#f0d090", marginBottom: 4 }}>
                  Your Signature
                </div>
                <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#9a8a70" }}>
                  Choose ink style, adjust size &amp; rotation
                </div>
              </div>

              {/* Ink variant selector */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  marginBottom: 18,
                  flexWrap: "wrap",
                }}
              >
                {INK_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedVariant(opt.id)}
                    style={{
                      background:
                        selectedVariant === opt.id
                          ? "rgba(240,208,144,0.18)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        selectedVariant === opt.id
                          ? "1px solid #c9a96e"
                          : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "6px 14px",
                      cursor: "pointer",
                      color: selectedVariant === opt.id ? "#f0d090" : "#9a8a70",
                      fontFamily: "sans-serif",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: opt.color,
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Preview area */}
              <div
                style={{
                  background:
                    "repeating-conic-gradient(#2a2a3a 0% 25%, #1e1e2e 0% 50%) 0 0/20px 20px",
                  borderRadius: 10,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 120,
                  marginBottom: 16,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {currentVariantData && (
                  <img
                    src={currentVariantData}
                    alt="Signature preview"
                    style={{
                      maxWidth: "90%",
                      maxHeight: 120,
                      transform: `scale(${scale / 100}) rotate(${rotation}deg)`,
                      transition: "transform 0.2s",
                      imageRendering: "crisp-edges",
                    }}
                  />
                )}
              </div>

              {/* Scale / Rotation controls */}
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: "#9a8a70",
                      marginBottom: 4,
                    }}
                  >
                    Scale: {scale}%
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={200}
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    style={{ width: 120 }}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: "sans-serif",
                      color: "#9a8a70",
                      marginBottom: 4,
                    }}
                  >
                    Rotation: {rotation}°
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    style={{ width: 120 }}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 16,
                }}
              >
                {["download", "stamp", "saved"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 16px",
                      color: activeTab === tab ? "#f0d090" : "#9a8a70",
                      borderBottom:
                        activeTab === tab ? "2px solid #c9a96e" : "2px solid transparent",
                      fontFamily: "sans-serif",
                      fontSize: 13,
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "download"
                      ? "⬇ Download"
                      : tab === "stamp"
                      ? "📄 Place on Document"
                      : "🗂 Saved"}
                  </button>
                ))}
              </div>

              {/* Download tab */}
              {activeTab === "download" && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button onClick={downloadPNG} style={btnStyle("#1a5c3a")}>
                    PNG (Transparent)
                  </button>
                  <button onClick={downloadSVG} style={btnStyle("#1a3a5c")}>
                    SVG (Scalable)
                  </button>
                  <button onClick={copyToClipboard} style={btnStyle("#3a1a5c")}>
                    Copy to Clipboard
                  </button>
                  <button onClick={saveSignature} style={btnStyle("#5c3a1a")}>
                    Save for Reuse
                  </button>
                </div>
              )}

              {/* Stamp tab */}
              {activeTab === "stamp" && (
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontFamily: "sans-serif",
                      color: "#9a8a70",
                      marginBottom: 12,
                    }}
                  >
                    Upload a document image, then drag your signature to position it.
                  </div>
                  {!docPreview ? (
                    <div
                      onClick={() => docInputRef.current?.click()}
                      style={{
                        border: "2px dashed rgba(240,208,144,0.25)",
                        borderRadius: 10,
                        padding: "32px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                      <div style={{ color: "#f0d090", fontFamily: "sans-serif", fontSize: 14 }}>
                        Upload Document
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#9a8a70", fontFamily: "sans-serif", marginTop: 4 }}
                      >
                        PNG, JPG supported
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="doc-preview-area"
                        style={{ position: "relative", background: "#f5f5f0", borderRadius: 8, overflow: "hidden" }}
                        onMouseMove={handleDocMouseMove}
                        onMouseUp={() => setIsDraggingStamp(false)}
                      >
                        {docPreview !== "placeholder" ? (
                          <img src={docPreview} alt="doc" style={{ width: "100%", display: "block" }} />
                        ) : (
                          <div style={{ padding: 32, color: "#555", fontFamily: "sans-serif", textAlign: "center" }}>
                            <div style={{ marginBottom: 8 }}>{docFile?.name}</div>
                            <div style={{ color: "#999", fontSize: 12 }}>Drag signature below</div>
                            <div style={{ height: 160 }} />
                          </div>
                        )}
                        {currentVariantData && (
                          <div
                            ref={stampRef}
                            onMouseDown={handleStampMouseDown}
                            style={{
                              position: "absolute",
                              left: stampPos.x,
                              top: stampPos.y,
                              cursor: "grab",
                              transform: `rotate(${rotation}deg)`,
                              border: "2px dashed rgba(201,169,110,0.7)",
                              borderRadius: 4,
                              padding: 2,
                            }}
                          >
                            <img
                              src={currentVariantData}
                              alt="stamp"
                              style={{ width: (scale / 100) * 200, height: "auto", display: "block" }}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: 10,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => { setDocPreview(null); setDocFile(null); }}
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 10,
                            padding: "10px 18px",
                            cursor: "pointer",
                            color: "#e8e4dc",
                            fontFamily: "sans-serif",
                            fontSize: 13,
                          }}
                        >
                          Change Document
                        </button>
                        <button
                          onClick={applyStamp}
                          style={{
                            background: "linear-gradient(135deg, #c9a96e, #f0d090)",
                            border: "none",
                            borderRadius: 10,
                            padding: "10px 24px",
                            cursor: "pointer",
                            color: "#1a1a1a",
                            fontFamily: "sans-serif",
                            fontSize: 13,
                            fontWeight: "bold",
                          }}
                        >
                          Apply &amp; Download
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    ref={docInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleDocUpload}
                  />
                </div>
              )}

              {/* Saved tab */}
              {activeTab === "saved" && (
                <div>
                  {savedSignatures.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9a8a70",
                        fontFamily: "sans-serif",
                        fontSize: 13,
                        padding: 24,
                      }}
                    >
                      No saved signatures yet. Click "Save for Reuse" to save one.
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {savedSignatures.map((s) => (
                        <div
                          key={s.id}
                          style={{
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            padding: 12,
                            background: "rgba(255,255,255,0.03)",
                            flex: "0 0 160px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "repeating-conic-gradient(#2a2a3a 0% 25%, #1e1e2e 0% 50%) 0 0/16px 16px",
                              borderRadius: 6,
                              padding: 6,
                              marginBottom: 8,
                            }}
                          >
                            <img
                              src={s.variants["black"]}
                              alt="saved"
                              style={{ width: "100%", display: "block" }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#9a8a70",
                              fontFamily: "sans-serif",
                              marginBottom: 6,
                            }}
                          >
                            {s.label}
                          </div>
                          <button
                            onClick={() => loadSaved(s)}
                            style={{
                              background: "rgba(240,208,144,0.1)",
                              border: "1px solid rgba(240,208,144,0.3)",
                              borderRadius: 6,
                              padding: "3px 10px",
                              cursor: "pointer",
                              color: "#f0d090",
                              fontFamily: "sans-serif",
                              fontSize: 11,
                            }}
                          >
                            Load
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Footer actions */}
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => { setStep(2); setProcessedVariants(null); }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#e8e4dc",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                  }}
                >
                  ← Redo Signature
                </button>
                <button
                  onClick={() => { setStep(1); setMode(null); setProcessedVariants(null); }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    cursor: "pointer",
                    color: "#e8e4dc",
                    fontFamily: "sans-serif",
                    fontSize: 13,
                  }}
                >
                  ↩ Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes sigFadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
          input[type=range] { height: 4px; cursor: pointer; accent-color: #c9a96e; }
        `}</style>
      </div>
    </div>
  );
}
