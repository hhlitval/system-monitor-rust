import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

type MemoryInfo = {
  total_gb: number;
  used_gb: number;
  percentage: number;
};

function App() {
  const [memory, setMemory] = useState<MemoryInfo | null>(null);
  const [cpu, setCpu] = useState<number | null>(null);

  useEffect(() => {
    async function updateMemory() {
      const result = await invoke<MemoryInfo>("get_memory_info");
      const cpuResult = await invoke<number>("get_cpu_usage");

      setMemory(result);
      setCpu(cpuResult);
    }

    updateMemory();

    const interval = setInterval(updateMemory, 1000);

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
      {cpu !== null && (
  <div>
    <h2>CPU</h2>
    <p>{cpu.toFixed(1)} %</p>

    <progress
      value={cpu}
      max="100"
    />
  </div>
)}
    </main>
  );
}

export default App;
