import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';

type MemoryInfo = {
  total_gb: number;
  used_gb: number;
  percentage: number;
};

// type ProcessInfo = {
//   name: string;
//   pid: string;
//   cpu_usage: number;
// };

function App() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [memory, setMemory] = useState<MemoryInfo | null>(null);
  // const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    async function updateSystemData() {
      const cpuResult = await invoke<number>('get_cpu_usage');
      const memoryResult = await invoke<MemoryInfo>('get_memory_info');
      // const processResult = await invoke<ProcessInfo[]>('get_top_processes');

      setCpu(cpuResult);
      setMemory(memoryResult);
      // setProcesses(processResult);
    }

    updateSystemData();

    const interval = setInterval(updateSystemData, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <div className="info-card">
        {cpu !== null && (
          <div>
            <h2>CPU</h2>
            <p className="percent_usage">{cpu.toFixed(1)} %</p>
            <progress value={cpu} max="100" />
          </div>
        )}
      </div>
      <div className="info-card">
        {memory ? (
          <div>
            <h2>RAM</h2>
            <p className="percent_usage">{memory.percentage.toFixed(1)} %</p>
            <progress value={memory.percentage} max="100" />
            <p className="info-card__subtitle">
              {memory.used_gb.toFixed(1)} GB von {memory.total_gb.toFixed(1)} GB
              verwendet
            </p>
          </div>
        ) : (
          <p>RAM wird ermittelt...</p>
        )}
      </div>
      <div>
        {/* <h2>Top 5 Prozesse</h2> */}
        {/* {processes.map((process) => (
          <div key={process.pid}>
            <strong>{process.name}</strong>
            {' — '}
            {process.cpu_usage.toFixed(1)} %
          </div>
        ))} */}
      </div>
    </main>
  );
}

export default App;
