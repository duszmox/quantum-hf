import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

export interface MeshCanvasProps {
  children?: React.ReactNode;
  className?: string;
}

export default function MeshCanvas({ children, className }: MeshCanvasProps) {
  return (
    <Canvas
      className={`w-full h-full bg-black ${className || ""}`}
      camera={{
        position: new Vector3(2, 2, 2),
      }}
    >
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <ambientLight intensity={Math.PI / 2} />
      <OrbitControls enableDamping={false} maxDistance={3} />
      {children}
    </Canvas>
  );
}
