import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

export type Hoodie3DProps = {
  color: string;
  drawstringColor: string;
  text: string;
  textColor: string;
  font: string;
  textSize: number;
  image: string | null;
  imageOpacity: number;
  placement: "front" | "back" | "left-sleeve" | "right-sleeve" | "hood";
  autoRotate?: boolean;
  style: "Regular" | "Oversized" | "Zip-up" | "Cropped" | "Heavyweight";
};

export type Hoodie3DHandle = {
  exportHD: () => string | null;
};

function buildDecalTexture(
  text: string,
  textColor: string,
  font: string,
  textSize: number,
  image: string | null,
  imageOpacity: number,
): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  function drawText() {
    if (!text) return;
    const lines = text.split("\n");
    const fs = textSize * 6;
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fs}px "${font}", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((line, i) => {
      ctx.fillText(line, size / 2, size / 2 + (i - (lines.length - 1) / 2) * fs * 1.05);
    });
  }

  if (image) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      ctx.globalAlpha = imageOpacity / 100;
      const ratio = Math.min(size / img.width, size / img.height) * 0.7;
      const w = img.width * ratio;
      const h = img.height * ratio;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2 - 50, w, h);
      ctx.globalAlpha = 1;
      drawText();
      tex.needsUpdate = true;
    };
  }
  drawText();
  return tex;
}

// Realistic torso: front & back panels with slight taper, joined by side seams
function TorsoShape({
  color,
  widthScale,
  heightScale,
}: {
  color: string;
  widthScale: number;
  heightScale: number;
}) {
  const geom = useMemo(() => {
    // Lathe-like profile: torso capsule
    const shape = new THREE.Shape();
    shape.moveTo(-0.9, 1.15);
    shape.lineTo(0.9, 1.15);
    shape.lineTo(1.0, 0.5);
    shape.lineTo(0.95, -0.6);
    shape.lineTo(0.85, -1.15);
    shape.lineTo(-0.85, -1.15);
    shape.lineTo(-0.95, -0.6);
    shape.lineTo(-1.0, 0.5);
    shape.lineTo(-0.9, 1.15);
    const extrude = new THREE.ExtrudeGeometry(shape, {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.12,
      bevelSegments: 6,
      curveSegments: 24,
    });
    extrude.translate(0, 0, -0.275);
    extrude.computeVertexNormals();
    return extrude;
  }, []);

  return (
    <mesh castShadow receiveShadow geometry={geom} scale={[widthScale, heightScale, 1]}>
      <meshStandardMaterial color={color} roughness={0.88} metalness={0.02} />
    </mesh>
  );
}

function Sleeve({
  side,
  color,
  widthScale,
  heightScale,
  decal,
}: {
  side: "left" | "right";
  color: string;
  widthScale: number;
  heightScale: number;
  decal: THREE.CanvasTexture | null;
}) {
  const dir = side === "left" ? -1 : 1;
  const angle = (dir * Math.PI) / 2.4;

  const geom = useMemo(() => {
    // Tapered sleeve using LatheGeometry
    const pts = [
      new THREE.Vector2(0.35, -0.9),
      new THREE.Vector2(0.32, -0.4),
      new THREE.Vector2(0.3, 0.1),
      new THREE.Vector2(0.28, 0.6),
      new THREE.Vector2(0.27, 0.9),
    ];
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group
      position={[dir * 1.0 * widthScale, 0.55 * heightScale, 0]}
      rotation={[0, 0, angle]}
    >
      <mesh castShadow geometry={geom}>
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Ribbed cuff */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.22, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.02} />
      </mesh>
      {decal && (
        <mesh position={[0, 0.2, 0.31]} rotation={[0, 0, -angle]}>
          <planeGeometry args={[0.45, 0.45]} />
          <meshStandardMaterial map={decal} transparent alphaTest={0.01} />
        </mesh>
      )}
    </group>
  );
}

function Hood({
  color,
  drawstringColor,
  heightScale,
  widthScale,
  decal,
}: {
  color: string;
  drawstringColor: string;
  heightScale: number;
  widthScale: number;
  decal: THREE.CanvasTexture | null;
}) {
  const hoodGeom = useMemo(() => {
    // Half-sphere hood, slightly egg-shaped
    const g = new THREE.SphereGeometry(0.62, 32, 24, 0, Math.PI * 2, 0, Math.PI / 1.9);
    g.scale(1.05, 1.15, 1.1);
    return g;
  }, []);

  const openingGeom = useMemo(() => {
    // Dark inner opening ring
    return new THREE.TorusGeometry(0.5, 0.09, 16, 32);
  }, []);

  return (
    <group position={[0, 1.15 * heightScale, -0.08]} scale={[widthScale, 1, 1]}>
      <mesh castShadow receiveShadow geometry={hoodGeom}>
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Hood opening rim */}
      <mesh position={[0, -0.05, 0.35]} rotation={[Math.PI / 2.4, 0, 0]} geometry={openingGeom}>
        <meshStandardMaterial color="#0a0a0a" roughness={0.95} />
      </mesh>
      {/* Drawstrings */}
      <mesh position={[-0.14, -0.32, 0.42]}>
        <cylinderGeometry args={[0.018, 0.018, 0.7, 12]} />
        <meshStandardMaterial color={drawstringColor} roughness={0.55} />
      </mesh>
      <mesh position={[0.14, -0.32, 0.42]}>
        <cylinderGeometry args={[0.018, 0.018, 0.7, 12]} />
        <meshStandardMaterial color={drawstringColor} roughness={0.55} />
      </mesh>
      {/* Drawstring aglets */}
      <mesh position={[-0.14, -0.7, 0.42]}>
        <cylinderGeometry args={[0.025, 0.02, 0.06, 12]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.14, -0.7, 0.42]}>
        <cylinderGeometry args={[0.025, 0.02, 0.06, 12]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {decal && (
        <mesh position={[0, 0.15, 0.55]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial map={decal} transparent alphaTest={0.01} />
        </mesh>
      )}
    </group>
  );
}

function Hoodie({ props }: { props: Hoodie3DProps }) {
  const group = useRef<THREE.Group>(null);

  const decals = useMemo(() => {
    const build = () =>
      buildDecalTexture(
        props.text,
        props.textColor,
        props.font,
        props.textSize,
        props.image,
        props.imageOpacity,
      );
    return {
      front: props.placement === "front" ? build() : null,
      back: props.placement === "back" ? build() : null,
      leftSleeve: props.placement === "left-sleeve" ? build() : null,
      rightSleeve: props.placement === "right-sleeve" ? build() : null,
      hood: props.placement === "hood" ? build() : null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.placement,
    props.text,
    props.textColor,
    props.font,
    props.textSize,
    props.image,
    props.imageOpacity,
  ]);

  const widthScale =
    props.style === "Oversized" ? 1.15 : props.style === "Heavyweight" ? 1.1 : 1;
  const heightScale = props.style === "Cropped" ? 0.78 : 1;

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      <TorsoShape color={props.color} widthScale={widthScale} heightScale={heightScale} />

      {/* Front print */}
      {decals.front && (
        <mesh position={[0, 0.15 * heightScale, 0.4]} scale={[widthScale, heightScale, 1]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial map={decals.front} transparent alphaTest={0.01} roughness={0.9} />
        </mesh>
      )}
      {/* Back print */}
      {decals.back && (
        <mesh
          position={[0, 0.15 * heightScale, -0.4]}
          rotation={[0, Math.PI, 0]}
          scale={[widthScale, heightScale, 1]}
        >
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial map={decals.back} transparent alphaTest={0.01} roughness={0.9} />
        </mesh>
      )}

      <Hood
        color={props.color}
        drawstringColor={props.drawstringColor}
        heightScale={heightScale}
        widthScale={widthScale}
        decal={decals.hood}
      />

      <Sleeve
        side="left"
        color={props.color}
        widthScale={widthScale}
        heightScale={heightScale}
        decal={decals.leftSleeve}
      />
      <Sleeve
        side="right"
        color={props.color}
        widthScale={widthScale}
        heightScale={heightScale}
        decal={decals.rightSleeve}
      />

      {/* Kangaroo pouch pocket */}
      <mesh position={[0, -0.55 * heightScale, 0.4]} scale={[widthScale, 1, 1]}>
        <boxGeometry args={[1.35, 0.55, 0.06]} />
        <meshStandardMaterial color={props.color} roughness={0.92} />
      </mesh>
      {/* Pocket seam shadow */}
      <mesh position={[0, -0.28 * heightScale, 0.435]} scale={[widthScale, 1, 1]}>
        <boxGeometry args={[1.35, 0.005, 0.02]} />
        <meshStandardMaterial color="#000" opacity={0.35} transparent />
      </mesh>

      {/* Ribbed waistband */}
      <mesh
        castShadow
        position={[0, -1.22 * heightScale, 0]}
        scale={[widthScale, 1, 1]}
      >
        <boxGeometry args={[1.82, 0.22, 0.72]} />
        <meshStandardMaterial color={props.color} roughness={0.55} />
      </mesh>

      {/* Zipper (Zip-up only) */}
      {props.style === "Zip-up" && (
        <mesh position={[0, -0.05, 0.42]} scale={[1, heightScale, 1]}>
          <boxGeometry args={[0.035, 2.25, 0.015]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.85} roughness={0.25} />
        </mesh>
      )}

      {/* Brand tag */}
      <mesh position={[0.4, 0.95 * heightScale, 0.401]}>
        <planeGeometry args={[0.12, 0.05]} />
        <meshStandardMaterial color="#ffffff" opacity={0.85} transparent />
      </mesh>
    </group>
  );
}

function Exporter({ exportRef }: { exportRef: React.MutableRefObject<(() => string | null) | null> }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    exportRef.current = () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    };
    return () => {
      exportRef.current = null;
    };
  }, [gl, scene, camera, exportRef]);
  return null;
}

export const Hoodie3D = forwardRef<Hoodie3DHandle, Hoodie3DProps>(function Hoodie3D(props, ref) {
  const exportRef = useRef<(() => string | null) | null>(null);

  useImperativeHandle(ref, () => ({
    exportHD: () => (exportRef.current ? exportRef.current() : null),
  }));

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.3, 4.8], fov: 32 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 2, -3]} intensity={0.45} color="#a78bfa" />
      <directionalLight position={[0, -2, 4]} intensity={0.25} />
      <Suspense fallback={null}>
        <Hoodie props={props} />
        <Environment preset="studio" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.55} blur={2.8} far={4} scale={6} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        autoRotate={props.autoRotate}
        autoRotateSpeed={1.5}
        minDistance={3}
        maxDistance={7}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
      <Exporter exportRef={exportRef} />
    </Canvas>
  );
});
