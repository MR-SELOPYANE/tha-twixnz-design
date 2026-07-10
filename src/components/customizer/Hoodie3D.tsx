import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

  drawText();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function Hoodie({ props }: { props: Hoodie3DProps }) {
  const group = useRef<THREE.Group>(null);

  const frontTex = useMemo(
    () =>
      props.placement === "front"
        ? buildDecalTexture(props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity)
        : null,
    [props.placement, props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity],
  );
  const backTex = useMemo(
    () =>
      props.placement === "back"
        ? buildDecalTexture(props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity)
        : null,
    [props.placement, props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity],
  );
  const leftSleeveTex = useMemo(
    () =>
      props.placement === "left-sleeve"
        ? buildDecalTexture(props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity)
        : null,
    [props.placement, props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity],
  );
  const rightSleeveTex = useMemo(
    () =>
      props.placement === "right-sleeve"
        ? buildDecalTexture(props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity)
        : null,
    [props.placement, props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity],
  );
  const hoodTex = useMemo(
    () =>
      props.placement === "hood"
        ? buildDecalTexture(props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity)
        : null,
    [props.placement, props.text, props.textColor, props.font, props.textSize, props.image, props.imageOpacity],
  );

  // dimensions vary slightly by style
  const widthScale =
    props.style === "Oversized" ? 1.15 : props.style === "Cropped" ? 1 : props.style === "Heavyweight" ? 1.1 : 1;
  const heightScale = props.style === "Cropped" ? 0.78 : 1;

  const fabricMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: props.color, roughness: 0.85, metalness: 0.02 }),
    [props.color],
  );

  useEffect(() => {
    fabricMat.color.set(props.color);
  }, [props.color, fabricMat]);

  useFrame(() => {
    // gentle idle
  });

  return (
    <group ref={group} position={[0, -0.2, 0]}>
      {/* Torso */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} scale={[widthScale, heightScale, 1]}>
        <boxGeometry args={[1.8, 2.3, 0.7]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>

      {/* Front print plane */}
      <mesh position={[0, 0.1, 0.351 + 0.001]} scale={[widthScale, heightScale, 1]}>
        <planeGeometry args={[1.3, 1.4]} />
        <meshStandardMaterial
          map={frontTex ?? undefined}
          transparent
          color={frontTex ? "#ffffff" : props.color}
          opacity={frontTex ? 1 : 0}
          roughness={0.9}
        />
      </mesh>

      {/* Back print plane */}
      <mesh position={[0, 0.1, -0.351 - 0.001]} rotation={[0, Math.PI, 0]} scale={[widthScale, heightScale, 1]}>
        <planeGeometry args={[1.3, 1.4]} />
        <meshStandardMaterial
          map={backTex ?? undefined}
          transparent
          color={backTex ? "#ffffff" : props.color}
          opacity={backTex ? 1 : 0}
          roughness={0.9}
        />
      </mesh>

      {/* Hood */}
      <mesh castShadow position={[0, 1.35 * heightScale, -0.15]} scale={[widthScale, heightScale, 1]}>
        <sphereGeometry args={[0.6, 32, 24, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
        <primitive object={fabricMat} attach="material" />
      </mesh>
      {/* Hood print */}
      {hoodTex && (
        <mesh position={[0, 1.35 * heightScale, -0.16]} scale={[widthScale, heightScale, 1]}>
          <planeGeometry args={[0.5, 0.35]} />
          <meshStandardMaterial map={hoodTex} transparent />
        </mesh>
      )}

      {/* Drawstrings */}
      <mesh position={[-0.12, 0.95 * heightScale, 0.36]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55]} />
        <meshStandardMaterial color={props.drawstringColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.12, 0.95 * heightScale, 0.36]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55]} />
        <meshStandardMaterial color={props.drawstringColor} roughness={0.6} />
      </mesh>

      {/* Pouch pocket */}
      <mesh position={[0, -0.55 * heightScale, 0.37]} scale={[widthScale, heightScale, 1]}>
        <boxGeometry args={[1.2, 0.5, 0.05]} />
        <meshStandardMaterial color={props.color} roughness={0.9} />
      </mesh>

      {/* Left Sleeve */}
      <group position={[-1.05 * widthScale, 0.55 * heightScale, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.28, 1.7, 24]} />
          <primitive object={fabricMat} attach="material" />
        </mesh>
        {leftSleeveTex && (
          <mesh position={[0, 0, 0.33]} rotation={[0, 0, -Math.PI / 2.6]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial map={leftSleeveTex} transparent />
          </mesh>
        )}
      </group>

      {/* Right Sleeve */}
      <group position={[1.05 * widthScale, 0.55 * heightScale, 0]} rotation={[0, 0, -Math.PI / 2.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.28, 1.7, 24]} />
          <primitive object={fabricMat} attach="material" />
        </mesh>
        {rightSleeveTex && (
          <mesh position={[0, 0, 0.33]} rotation={[0, 0, Math.PI / 2.6]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial map={rightSleeveTex} transparent />
          </mesh>
        )}
      </group>

      {/* Cuffs */}
      <mesh position={[-1.75 * widthScale, -0.3 * heightScale, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
        <meshStandardMaterial color={props.color} roughness={0.7} />
      </mesh>
      <mesh position={[1.75 * widthScale, -0.3 * heightScale, 0]} rotation={[0, 0, -Math.PI / 2.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
        <meshStandardMaterial color={props.color} roughness={0.7} />
      </mesh>

      {/* Waistband */}
      <mesh position={[0, -1.2 * heightScale, 0]} scale={[widthScale, 1, 1]}>
        <boxGeometry args={[1.8, 0.2, 0.72]} />
        <meshStandardMaterial color={props.color} roughness={0.7} />
      </mesh>

      {/* Zipper (Zip-up only) */}
      {props.style === "Zip-up" && (
        <mesh position={[0, 0, 0.355]} scale={[1, heightScale, 1]}>
          <boxGeometry args={[0.04, 2.2, 0.02]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
        </mesh>
      )}
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
      camera={{ position: [0, 0.5, 5], fov: 35 }}
      gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} />
      <Suspense fallback={null}>
        <Hoodie props={props} />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.45, 0]} opacity={0.4} blur={2.5} far={3} />
      </Suspense>
      <OrbitControls
        enablePan={false}
        autoRotate={props.autoRotate}
        autoRotateSpeed={1.5}
        minDistance={3}
        maxDistance={8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Exporter exportRef={exportRef} />
    </Canvas>
  );
});
