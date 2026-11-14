import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Type,
  Image as ImageIcon,
  Palette,
  Layers,
  Sparkles,
  RotateCw,
  Download,
  Save,
  Ruler,
  Shirt,
  Crown,
  MoveHorizontal,
  Move,
  Undo2,
  Redo2,
} from "lucide-react";
import { Hoodie3D, type Hoodie3DHandle } from "@/components/customizer/Hoodie3D";
import { CUSTOM_FONTS, type FontKey } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { pushHistorySnapshot, redoHistory, undoHistory } from "@/lib/design-history";

export const Route = createFileRoute("/customizer")({
  head: () => ({
    meta: [
      { title: "Custom Hoodie Designer — THA TWINZ" },
      {
        name: "description",
        content:
          "Design a THA TWINZ hoodie with custom colors, fabrics, fit, text, graphics, and a live 3D preview.",
      },
      { property: "og:title", content: "Custom Hoodie Designer — THA TWINZ" },
      {
        property: "og:description",
        content: "Customize your hoodie and preview every detail in 3D.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Customizer,
});

type Side = "front" | "back";
type Placement = "front" | "back" | "left-sleeve" | "right-sleeve" | "hood";
type HoodieStyle = "Regular" | "Oversized" | "Zip-up" | "Cropped" | "Heavyweight";
type Fabric = "Cotton 320gsm" | "Fleece 400gsm" | "French Terry" | "Organic Blend";
type SizeOpt = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type TextEffect = "none" | "outline" | "shadow" | "glow";

const HOODIE_COLORS = [
  "#0a0a0a",
  "#1f1f1f",
  "#3a3a3a",
  "#ffffff",
  "#e7e5e4",
  "#7c3aed",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#f59e0b",
  "#ec4899",
  "#1e3a8a",
  "#064e3b",
  "#7f1d1d",
];

const STYLE_PRICE: Record<HoodieStyle, number> = {
  Regular: 699,
  Oversized: 749,
  "Zip-up": 799,
  Cropped: 729,
  Heavyweight: 899,
};

const FABRIC_PRICE: Record<Fabric, number> = {
  "Cotton 320gsm": 0,
  "Fleece 400gsm": 80,
  "French Terry": 60,
  "Organic Blend": 120,
};

const FONTS = CUSTOM_FONTS;
const SIZES: SizeOpt[] = ["XS", "S", "M", "L", "XL", "XXL"];
const PLACEMENTS: { key: Placement; label: string; icon: typeof Shirt }[] = [
  { key: "front", label: "Front", icon: Shirt },
  { key: "back", label: "Back", icon: Shirt },
  { key: "left-sleeve", label: "L. Sleeve", icon: MoveHorizontal },
  { key: "right-sleeve", label: "R. Sleeve", icon: MoveHorizontal },
  { key: "hood", label: "Hood", icon: Crown },
];

type HoodieDesign = {
  style: HoodieStyle;
  fabric: Fabric;
  sizeOpt: SizeOpt;
  hoodieColor: string;
  drawstringColor: string;
  placement: Placement;
  text: string;
  textColor: string;
  textSize: number;
  textRotation: number;
  font: FontKey;
  textEffect: TextEffect;
  textX: number;
  textY: number;
  uploadedImg: string | null;
  imgScale: number;
  imgRotation: number;
  imgOpacity: number;
  quantity: number;
};

const MAX_HISTORY = 50;

function useDesignHistory(initialDesign: HoodieDesign) {
  const [design, setDesign] = useState(initialDesign);
  const designRef = useRef(design);
  const undoStack = useRef<HoodieDesign[]>([]);
  const redoStack = useRef<HoodieDesign[]>([]);
  const pendingBefore = useRef<HoodieDesign | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPending = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    if (!pendingBefore.current) return;
    undoStack.current = pushHistorySnapshot(undoStack.current, pendingBefore.current, MAX_HISTORY);
    pendingBefore.current = null;
  }, []);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  const update = useCallback(
    <Key extends keyof HoodieDesign>(key: Key, value: HoodieDesign[Key]) => {
      if (Object.is(designRef.current[key], value)) return;
      if (!pendingBefore.current) pendingBefore.current = designRef.current;
      redoStack.current = [];
      const nextDesign = { ...designRef.current, [key]: value };
      designRef.current = nextDesign;
      setDesign(nextDesign);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(flushPending, 300);
    },
    [flushPending],
  );

  const undo = useCallback(() => {
    flushPending();
    const transition = undoHistory(
      designRef.current,
      undoStack.current,
      redoStack.current,
      MAX_HISTORY,
    );
    if (!transition) return;
    undoStack.current = transition.undo;
    redoStack.current = transition.redo;
    designRef.current = transition.current;
    setDesign(transition.current);
  }, [flushPending]);

  const redo = useCallback(() => {
    flushPending();
    const transition = redoHistory(
      designRef.current,
      undoStack.current,
      redoStack.current,
      MAX_HISTORY,
    );
    if (!transition) return;
    undoStack.current = transition.undo;
    redoStack.current = transition.redo;
    designRef.current = transition.current;
    setDesign(transition.current);
  }, [flushPending]);

  return {
    design,
    update,
    undo,
    redo,
    canUndo: pendingBefore.current !== null || undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
  };
}

function Customizer() {
  const [side, setSide] = useState<Side>("front");
  const history = useDesignHistory({
    style: "Oversized",
    fabric: "Cotton 320gsm",
    sizeOpt: "M",
    hoodieColor: "#0a0a0a",
    drawstringColor: "#ffffff",
    placement: "front",
    text: "DREAM\nCREATE\nINSPIRE",
    textColor: "#7c3aed",
    textSize: 48,
    textRotation: 0,
    font: "Bebas Neue",
    textEffect: "none",
    textX: 0,
    textY: 0,
    uploadedImg: null,
    imgScale: 100,
    imgRotation: 0,
    imgOpacity: 90,
    quantity: 1,
  });
  const {
    style,
    fabric,
    sizeOpt,
    hoodieColor,
    drawstringColor,
    placement,
    text,
    textColor,
    textSize,
    textRotation,
    font,
    textEffect,
    textX,
    textY,
    uploadedImg,
    imgScale,
    imgRotation,
    imgOpacity,
    quantity,
  } = history.design;
  const setStyle = (value: HoodieStyle) => history.update("style", value);
  const setFabric = (value: Fabric) => history.update("fabric", value);
  const setSizeOpt = (value: SizeOpt) => history.update("sizeOpt", value);
  const setHoodieColor = (value: string) => history.update("hoodieColor", value);
  const setDrawstringColor = (value: string) => history.update("drawstringColor", value);
  const setPlacement = (value: Placement) => history.update("placement", value);
  const setText = (value: string) => history.update("text", value);
  const setTextColor = (value: string) => history.update("textColor", value);
  const setTextSize = (value: number) => history.update("textSize", value);
  const setTextRotation = (value: number) => history.update("textRotation", value);
  const setFont = (value: FontKey) => history.update("font", value);
  const setTextEffect = (value: TextEffect) => history.update("textEffect", value);
  const setTextX = (value: number) => history.update("textX", value);
  const setTextY = (value: number) => history.update("textY", value);
  const setUploadedImg = (value: string | null) => history.update("uploadedImg", value);
  const setImgScale = (value: number) => history.update("imgScale", value);
  const setImgRotation = (value: number) => history.update("imgRotation", value);
  const setImgOpacity = (value: number) => history.update("imgOpacity", value);
  const setQuantity = (value: number) => history.update("quantity", value);
  const fileRef = useRef<HTMLInputElement>(null);

  const [autoRotate, setAutoRotate] = useState(false);
  const hoodieRef = useRef<Hoodie3DHandle>(null);

  const exportHD = () => {
    const url = hoodieRef.current?.exportHD();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `tha-twinz-design-${Date.now()}.png`;
    a.click();
  };

  const textCharges = text ? 30 : 0;
  const imgCharges = uploadedImg ? 50 : 0;
  const placementCharge =
    placement === "left-sleeve" || placement === "right-sleeve" || placement === "hood" ? 40 : 0;
  const unitPrice =
    STYLE_PRICE[style] + FABRIC_PRICE[fabric] + textCharges + imgCharges + placementCharge;
  const price = unitPrice * quantity;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImg(reader.result as string);
    reader.readAsDataURL(f);
  };

  const textShadow =
    textEffect === "outline"
      ? `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000`
      : textEffect === "shadow"
      ? `0 4px 12px rgba(0,0,0,0.6)`
      : textEffect === "glow"
      ? `0 0 18px ${textColor}`
      : "none";

  // (side state unused with 3D preview; kept for compatibility)
  void side;


  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-4xl">CUSTOMIZER</h1>
            <p className="text-sm text-muted-foreground">Design your one-of-one.</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={history.undo}
              disabled={!history.canUndo}
              aria-label="Undo last design change"
              title="Undo last design change"
            >
              <Undo2 />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={history.redo}
              disabled={!history.canRedo}
              aria-label="Redo design change"
              title="Redo design change"
            >
              <Redo2 />
            </Button>
            <button className="border border-border px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-secondary">
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              onClick={exportHD}
              className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-glow"
            >
              <Download className="w-4 h-4" /> Export HD
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* 3D Preview */}
          <div className="bg-gradient-card border border-border rounded-2xl p-2 relative overflow-hidden min-h-[600px]">
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-background/70 backdrop-blur p-1 rounded-lg border border-border">
              {(["front", "side", "back"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s === "side" ? "front" : (s as Side))}
                  className="px-3 py-1 text-xs uppercase tracking-wider rounded text-muted-foreground hover:text-foreground"
                  title={`View ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setAutoRotate((r) => !r)}
              className={`absolute top-4 right-4 z-10 p-2 backdrop-blur border border-border rounded-lg ${
                autoRotate ? "bg-primary text-primary-foreground" : "bg-background/70"
              }`}
              title="360° auto-rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <div className="absolute inset-0">
              <Hoodie3D
                ref={hoodieRef}
                color={hoodieColor}
                drawstringColor={drawstringColor}
                text={text}
                textColor={textColor}
                font={font}
                textSize={textSize}
                image={uploadedImg}
                imageOpacity={imgOpacity}
                placement={placement}
                autoRotate={autoRotate}
                style={style}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur border border-border rounded-full px-4 py-2 text-xs text-muted-foreground pointer-events-none">
              {style} · {fabric} · Size {sizeOpt} · {placement.replace("-", " ")} · drag to rotate
            </div>
          </div>


          {/* Controls */}
          <div className="bg-gradient-card border border-border rounded-2xl p-5 space-y-6 overflow-y-auto max-h-[80vh]">
            <Section icon={Layers} title="Style">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as HoodieStyle)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
              >
                {(Object.keys(STYLE_PRICE) as HoodieStyle[]).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Section>

            <Section icon={Shirt} title="Fabric">
              <select
                value={fabric}
                onChange={(e) => setFabric(e.target.value as Fabric)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm"
              >
                {(Object.keys(FABRIC_PRICE) as Fabric[]).map((f) => (
                  <option key={f}>
                    {f} {FABRIC_PRICE[f] ? `(+R${FABRIC_PRICE[f]})` : ""}
                  </option>
                ))}
              </select>
            </Section>

            <Section icon={Ruler} title="Size">
              <div className="grid grid-cols-6 gap-1">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSizeOpt(s)}
                    className={`py-2 text-xs rounded-md border ${
                      sizeOpt === s
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={Palette} title="Hoodie Color">
              <div className="grid grid-cols-7 gap-2">
                {HOODIE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setHoodieColor(c)}
                    style={{ background: c }}
                    className={`aspect-square rounded-md border-2 ${
                      hoodieColor === c ? "border-primary" : "border-border"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-muted-foreground flex-1">Drawstring</span>
                <input
                  type="color"
                  value={drawstringColor}
                  onChange={(e) => setDrawstringColor(e.target.value)}
                  className="w-10 h-8 bg-transparent border border-border rounded"
                />
              </div>
            </Section>

            <Section icon={Move} title="Print Placement">
              <div className="grid grid-cols-5 gap-1">
                {PLACEMENTS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPlacement(p.key)}
                    className={`flex flex-col items-center gap-1 py-2 text-[10px] rounded-md border ${
                      placement === p.key
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <p.icon className="w-3.5 h-3.5" />
                    {p.label}
                  </button>
                ))}
              </div>
            </Section>

            <Section icon={Type} title="Add Text">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Your message..."
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm resize-none"
              />
              <select
                value={font}
                onChange={(e) => setFont(e.target.value as FontKey)}
                className="w-full mt-2 bg-input border border-border rounded-md px-3 py-2 text-sm"
              >
                {FONTS.map((f) => (
                  <option key={f} style={{ fontFamily: f }}>
                    {f}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="text-xs">
                  <span className="text-muted-foreground">Size</span>
                  <input
                    type="range"
                    min={16}
                    max={120}
                    value={textSize}
                    onChange={(e) => setTextSize(+e.target.value)}
                    className="w-full accent-primary"
                  />
                </label>
                <label className="text-xs">
                  <span className="text-muted-foreground">Rotate</span>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={textRotation}
                    onChange={(e) => setTextRotation(+e.target.value)}
                    className="w-full accent-primary"
                  />
                </label>
                <label className="text-xs">
                  <span className="text-muted-foreground">Move X</span>
                  <input
                    type="range"
                    min={-80}
                    max={80}
                    value={textX}
                    onChange={(e) => setTextX(+e.target.value)}
                    className="w-full accent-primary"
                  />
                </label>
                <label className="text-xs">
                  <span className="text-muted-foreground">Move Y</span>
                  <input
                    type="range"
                    min={-80}
                    max={80}
                    value={textY}
                    onChange={(e) => setTextY(+e.target.value)}
                    className="w-full accent-primary"
                  />
                </label>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Color</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-8 bg-transparent border border-border rounded"
                />
                <select
                  value={textEffect}
                  onChange={(e) => setTextEffect(e.target.value as TextEffect)}
                  className="flex-1 bg-input border border-border rounded-md px-2 py-1 text-xs"
                >
                  <option value="none">No effect</option>
                  <option value="outline">Outline</option>
                  <option value="shadow">Drop shadow</option>
                  <option value="glow">Neon glow</option>
                </select>
              </div>
            </Section>

            <Section icon={ImageIcon} title="Upload Graphic">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border rounded-md py-6 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition"
              >
                {uploadedImg ? "Replace image" : "Click to upload"}
              </button>
              {uploadedImg && (
                <>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <label className="text-xs">
                      <span className="text-muted-foreground">Scale</span>
                      <input
                        type="range"
                        min={20}
                        max={200}
                        value={imgScale}
                        onChange={(e) => setImgScale(+e.target.value)}
                        className="w-full accent-primary"
                      />
                    </label>
                    <label className="text-xs">
                      <span className="text-muted-foreground">Rotate</span>
                      <input
                        type="range"
                        min={-180}
                        max={180}
                        value={imgRotation}
                        onChange={(e) => setImgRotation(+e.target.value)}
                        className="w-full accent-primary"
                      />
                    </label>
                    <label className="text-xs">
                      <span className="text-muted-foreground">Opacity</span>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={imgOpacity}
                        onChange={(e) => setImgOpacity(+e.target.value)}
                        className="w-full accent-primary"
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => setUploadedImg(null)}
                    className="w-full text-xs text-muted-foreground mt-2 hover:text-destructive"
                  >
                    Remove
                  </button>
                </>
              )}
            </Section>

            <Section icon={Sparkles} title="AI Design Assistant">
              <div className="flex gap-2">
                <input
                  placeholder="Describe your design..."
                  className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm"
                />
                <button className="bg-gradient-primary text-primary-foreground px-3 rounded-md text-sm">
                  Generate
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Coming soon — AI will sketch concepts from your prompt.
              </p>
            </Section>

            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 text-sm w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="font-display text-3xl">R{price}.00</span>
              </div>
              <button className="w-full bg-gradient-primary text-primary-foreground py-3 rounded-md font-semibold shadow-glow">
                Add to Cart
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                🌱 This design saves ~18L of water vs fast fashion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      {children}
    </div>
  );
}
