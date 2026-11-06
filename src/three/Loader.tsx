import { Html, useProgress } from "@react-three/drei";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="font-mono text-xs text-muted whitespace-nowrap">
        Loading globe… {Math.round(progress)}%
      </p>
    </Html>
  );
};

export default Loader;
