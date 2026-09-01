import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [memory, setMemory] = useState<number | null>(null);

  async function checkMemory() {
    const result = await invoke<number>("get_memory_usage");
    setMemory(result);
  }

  return (
    <main className="container">
      <h1>System Monitor</h1>

      <button onClick={checkMemory}>RAM-Auslastung prüfen</button>

      {memory !== null && (
        <p>RAM-Auslastung: {memory.toFixed(1)}</p>
      )}
    </main>
  );
}

export default App;
