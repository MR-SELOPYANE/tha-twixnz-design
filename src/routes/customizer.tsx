import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import frontMockup from "@/assets/hoodie-mockup-front.png";
import backMockup from "@/assets/hoodie-mockup-back.png";

export const Route = createFileRoute("/customizer")({
  head: () => ({
    meta: [
      { title: "Customizer — Tha Twinz" },
      {
        name: "description",
        content:
          "Design your own custom hoodie. Add text, colors, graphics, and preview in real-time.",
      },
    ],
  }),
  component: Customizer,
});

type Side = "front" | "back";
type Placement = "front" | "back" | "left-sleeve" | "right-sleeve" | "hood";
type HoodieStyle = "Regular" | "Oversized" | "Zip-up" | "Cropped" | "Heavyweight";
type Fabric = "Cotton 320gsm" | "Fleece 400gsm" | "French Terry" | "Organic Blend";
type SizeOpt = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type FontKey = "Bebas Neue" | "Inter" | "Impact" | "Courier New" | "Georgia";
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

const FONTS: FontKey[] = ["Bebas Neue", "Inter", "Impact", "Courier New", "Georgia"];
const SIZES: SizeOpt[] = ["XS", "S", "M", "L", "XL", "XXL"];
const PLACEMENTS: { key: Placement; label: string; icon: typeof Shirt }[] = [
  { key: "front", label: "Front", icon: Shirt },
  { key: "back", label: "Back", icon: Shirt },
  { key: "left-sleeve", label: "L. Sleeve", icon: MoveHorizontal },
  { key: "right-sleeve", label: "R. Sleeve", icon: MoveHorizontal },
  { key: "hood", label: "Hood", icon: Crown },
];

function Customizer() {
  const [side, setSide] = useState<Side>("front");
  const [style, setStyle] = useState<HoodieStyle>("Oversized");
  const [fabric, setFabric] = useState<Fabric>("Cotton 320gsm");
  const [sizeOpt, setSizeOpt] = useState<SizeOpt>("M");
  const [hoodieColor, setHoodieColor] = useState("#0a0a0a");
  const [drawstringColor, setDrawstringColor] = useState("#ffffff");

  const [placement, setPlacement] = useState<Placement>("front");

  const [text, setText] = useState("DREAM\nCREATE\nINSPIRE");
  const [textColor, setTextColor] = useState("#7c3aed");
  const [textSize, setTextSize] = useState(48);
  const [textRotation, setTextRotation] = useState(0);
  const [font, setFont] = useState<FontKey>("Bebas Neue");
  const [textEffect, setTextEffect] = useState<TextEffect>("none");
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);

  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const [imgScale, setImgScale] = useState(100);
  const [imgRotation, setImgRotation] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(90);
  const fileRef = useRef<HTMLInputElement>(null);

  const [quantity, setQuantity] = useState(1);

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

  // Show design overlay only when previewing the side that matches placement
  const showOverlay =
    (side === "front" && placement === "front") ||
    (side === "back" && (placement === "back" || placement === "hood")) ||
    placement === "left-sleeve" ||
    placement === "right-sleeve";

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-4xl">CUSTOMIZER</h1>
            <p className="text-sm text-muted-foreground">Design your one-of-one.</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-border px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-secondary">
              <Save className="w-4 h-4" /> Save
            </button>
            <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-glow">
              <Download className="w-4 h-4" /> Export HD
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Preview */}
          <div className="bg-gradient-card border border-border rounded-2xl p-6 relative overflow-hidden min-h-[600px]">
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-background/60 backdrop-blur p-1 rounded-lg border border-border">
              {(["front", "back"] as Side[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider rounded ${
                    side === s
                      ? "bg-gradient-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              className="absolute top-4 right-4 z-10 p-2 bg-background/60 backdrop-blur border border-border rounded-lg"
              title="360° (preview)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <div className="absolute inset-0 grid place-items-center">
              <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl" />
              <motion.div
                key={side}
                initial={{ opacity: 0, rotateY: -30 }}
                animate={{ opacity: 1, rotateY: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md aspect-square"
                style={{ perspective: 1000 }}
              >
                {/* Hoodie tinted */}
                <div
                  className="absolute inset-0"
                  style={{ filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5))` }}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      backgroundColor: hoodieColor,
                      maskImage: `url(${side === "front" ? frontMockup : backMockup})`,
                      WebkitMaskImage: `url(${side === "front" ? frontMockup : backMockup})`,
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  />
                </div>

                {/* Drawstring accent (front only) */}
                {side === "front" && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-[18%] w-[18%] h-1 rounded-full opacity-80"
                    style={{ backgroundColor: drawstringColor }}
                  />
                )}

                {/* Design overlay */}
                {showOverlay && (
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div
                      className="relative"
                      style={{
                        width:
                          placement === "left-sleeve" || placement === "right-sleeve"
                            ? "18%"
                            : placement === "hood"
                            ? "30%"
                            : "55%",
                        height:
                          placement === "left-sleeve" || placement === "right-sleeve"
                            ? "15%"
                            : placement === "hood"
                            ? "20%"
                            : "45%",
                        transform: `translate(${
                          placement === "left-sleeve"
                            ? "-140%"
                            : placement === "right-sleeve"
                            ? "140%"
                            : "0%"
                        }, ${placement === "hood" ? "-110%" : "0%"})`,
                      }}
                    >
                      {uploadedImg && (
                        <img
                          src={uploadedImg}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain"
                          style={{
                            opacity: imgOpacity / 100,
                            transform: `scale(${imgScale / 100}) rotate(${imgRotation}deg)`,
                          }}
                        />
                      )}
                      {text && (
                        <div
                          className="absolute inset-0 grid place-items-center text-center leading-none whitespace-pre-line"
                          style={{
                            color: textColor,
                            fontSize: textSize,
                            fontFamily: font,
                            transform: `translate(${textX}px, ${textY}px) rotate(${textRotation}deg)`,
                            textShadow,
                          }}
                        >
                          {text}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur border border-border rounded-full px-4 py-2 text-xs text-muted-foreground">
              {style} · {fabric} · Size {sizeOpt} · {placement.replace("-", " ")}
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
