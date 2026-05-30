import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Type, Image as ImageIcon, Palette, Layers, Sparkles, RotateCw, Download, Save } from "lucide-react";
import frontMockup from "@/assets/hoodie-mockup-front.png";
import backMockup from "@/assets/hoodie-mockup-back.png";

export const Route = createFileRoute("/customizer")({
  head: () => ({
    meta: [
      { title: "Customizer — Tha Twinz" },
      { name: "description", content: "Design your own custom hoodie. Add text, colors, graphics, and preview in real-time." },
    ],
  }),
  component: Customizer,
});

type Side = "front" | "back";
type HoodieStyle = "Regular" | "Oversized" | "Zip-up";

const HOODIE_COLORS = ["#0a0a0a", "#1f1f1f", "#ffffff", "#7c3aed", "#10b981", "#3b82f6", "#ef4444"];
const STYLE_PRICE: Record<HoodieStyle, number> = { Regular: 699, Oversized: 749, "Zip-up": 799 };

function Customizer() {
  const [side, setSide] = useState<Side>("front");
  const [style, setStyle] = useState<HoodieStyle>("Oversized");
  const [hoodieColor, setHoodieColor] = useState("#0a0a0a");
  const [text, setText] = useState("DREAM\nCREATE\nINSPIRE");
  const [textColor, setTextColor] = useState("#7c3aed");
  const [textSize, setTextSize] = useState(48);
  const [textRotation, setTextRotation] = useState(0);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const price = STYLE_PRICE[style] + (text ? 30 : 0) + (uploadedImg ? 50 : 0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImg(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl">CUSTOMIZER</h1>
            <p className="text-sm text-muted-foreground">Design your one-of-one.</p>
          </div>
          <div className="flex gap-2">
            <button className="border border-border px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-secondary"><Save className="w-4 h-4" /> Save</button>
            <button className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-md text-sm flex items-center gap-2 shadow-glow"><Download className="w-4 h-4" /> Export HD</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Preview */}
          <div className="bg-gradient-card border border-border rounded-2xl p-6 relative overflow-hidden min-h-[600px]">
            <div className="absolute top-4 left-4 z-10 flex gap-1 bg-background/60 backdrop-blur p-1 rounded-lg border border-border">
              {(["front","back"] as Side[]).map(s => (
                <button key={s} onClick={() => setSide(s)}
                  className={`px-3 py-1 text-xs uppercase tracking-wider rounded ${side === s ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
            <button className="absolute top-4 right-4 z-10 p-2 bg-background/60 backdrop-blur border border-border rounded-lg" title="360° (preview)">
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
                <div className="absolute inset-0" style={{ filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5))` }}>
                  <div className="relative w-full h-full" style={{ backgroundColor: hoodieColor, maskImage: `url(${side === "front" ? frontMockup : backMockup})`, WebkitMaskImage: `url(${side === "front" ? frontMockup : backMockup})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} />
                </div>
                {/* Design overlay */}
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                  <div className="relative" style={{ width: "55%", height: "45%" }}>
                    {uploadedImg && (
                      <img src={uploadedImg} alt="" className="absolute inset-0 w-full h-full object-contain opacity-90" />
                    )}
                    {text && (
                      <div
                        className="absolute inset-0 grid place-items-center text-center font-display leading-none whitespace-pre-line"
                        style={{ color: textColor, fontSize: textSize, transform: `rotate(${textRotation}deg)` }}
                      >
                        {text}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur border border-border rounded-full px-4 py-2 text-xs text-muted-foreground">
              Front · Back · Sleeves · Hood
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gradient-card border border-border rounded-2xl p-5 space-y-6 overflow-y-auto max-h-[80vh]">
            <Section icon={Layers} title="Style">
              <select value={style} onChange={e => setStyle(e.target.value as HoodieStyle)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm">
                {(Object.keys(STYLE_PRICE) as HoodieStyle[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </Section>

            <Section icon={Palette} title="Hoodie Color">
              <div className="grid grid-cols-7 gap-2">
                {HOODIE_COLORS.map(c => (
                  <button key={c} onClick={() => setHoodieColor(c)} style={{ background: c }}
                    className={`aspect-square rounded-md border-2 ${hoodieColor === c ? "border-primary" : "border-border"}`} />
                ))}
              </div>
            </Section>

            <Section icon={Type} title="Add Text">
              <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
                placeholder="Your message..."
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm resize-none" />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="text-xs">
                  <span className="text-muted-foreground">Size</span>
                  <input type="range" min={16} max={96} value={textSize} onChange={e => setTextSize(+e.target.value)} className="w-full accent-primary" />
                </label>
                <label className="text-xs">
                  <span className="text-muted-foreground">Rotate</span>
                  <input type="range" min={-45} max={45} value={textRotation} onChange={e => setTextRotation(+e.target.value)} className="w-full accent-primary" />
                </label>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Color</span>
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-10 h-8 bg-transparent border border-border rounded" />
              </div>
            </Section>

            <Section icon={ImageIcon} title="Upload Graphic">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()}
                className="w-full border border-dashed border-border rounded-md py-6 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition">
                {uploadedImg ? "Replace image" : "Click to upload"}
              </button>
              {uploadedImg && (
                <button onClick={() => setUploadedImg(null)} className="w-full text-xs text-muted-foreground mt-2 hover:text-destructive">Remove</button>
              )}
            </Section>

            <Section icon={Sparkles} title="AI Design Assistant">
              <div className="flex gap-2">
                <input placeholder="Describe your design..." className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm" />
                <button className="bg-gradient-primary text-primary-foreground px-3 rounded-md text-sm">Generate</button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Coming soon — AI will sketch concepts from your prompt.</p>
            </Section>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="font-display text-3xl">R{price}.00</span>
              </div>
              <button className="w-full bg-gradient-primary text-primary-foreground py-3 rounded-md font-semibold shadow-glow">Add to Cart</button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">🌱 This design saves ~18L of water vs fast fashion.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      {children}
    </div>
  );
}
