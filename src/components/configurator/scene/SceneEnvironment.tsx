"use client";

export function SceneGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#0a0a0a" metalness={0.35} roughness={0.85} />
    </mesh>
  );
}
