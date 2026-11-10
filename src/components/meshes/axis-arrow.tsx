import { Billboard, Center, Text3D, type FontData } from "@react-three/drei";
import fontJson from "@/fonts/fira-mono-medium.json";
import { useMemo } from "react";
import * as THREE from "three";

const font = fontJson as unknown as FontData;

export default function Arrow({
  color = "red",
  label = "",
  labelSize = 0.1,
  thickness = 0.012,
  end = new THREE.Vector3(0, 1, 0),
}) {
  const transform = useMemo(() => {
    // SOURCE: https://discourse.threejs.org/t/how-do-i-align-a-cylinder-along-an-axis/30860
    const distance = end.length();

    const direction = end.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction,
    );

    return { quaternion, length: distance };
  }, [end]);

  const coneHeight = thickness * 6;
  const shaftLength = Math.max(0, transform.length - coneHeight);

  return (
    <group
      position={[0, 0, 0]}
      quaternion={transform.quaternion}
    >
      <mesh position={[0, shaftLength / 2, 0]}>
        <cylinderGeometry args={[thickness, thickness, shaftLength, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, shaftLength + coneHeight / 2, 0]}>
        <coneGeometry args={[thickness * 2.5, coneHeight, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Billboard position={[0, transform.length  + 0.15, 0]}>
          <Center>
            <Text3D
              font={font}
              size={labelSize}
              height={0.01}
              curveSegments={6}
            >
              {label}
              <meshStandardMaterial color={color} />
            </Text3D>
          </Center>
        </Billboard>
      )}
    </group>
  );
}
