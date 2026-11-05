import { Canvas } from "@react-three/fiber";

const GlobePanel = () => {
  return (
    <section className="h-full border min-w-5xl">
      <h2>Globe section</h2>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />
      </Canvas>
    </section>
  );
};

export default GlobePanel;
