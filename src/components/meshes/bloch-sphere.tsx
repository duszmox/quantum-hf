export default function BlochSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial color="gray" wireframe opacity={0.12} transparent />
    </mesh>
  );
}