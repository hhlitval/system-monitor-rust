import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type MemoryInfo = {
  total_gb: number;
  used_gb: number;
  percentage: number;
};

function App() {
  const [memory, setMemory] = useState<MemoryInfo | null>(null);

  useEffect(() => {
    async function updateMemory() {
      const result = await invoke<MemoryInfo>("get_memory_info");
      setMemory(result);
    }

    updateMemory();

    const interval = setInterval(updateMemory, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>System Monitor</h1>

      {memory ? (
        <div>
          <h2>RAM</h2>

          <p>{memory.percentage.toFixed(1)} %</p>

          <progress
            value={memory.percentage}
            max="100"
          />

          <p>
            {memory.used_gb.toFixed(1)} GB von{" "}
            {memory.total_gb.toFixed(1)} GB verwendet
          </p>
        </div>
      ) : (
        <p>RAM wird ermittelt...</p>
      )}
    </main>
  );
}

export default App;
