use serde::Serialize;
use sysinfo::System;

#[derive(Serialize)]
struct MemoryInfo {
    total_gb: f64,
    used_gb: f64,
    percentage: f64
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}, hier ist Rust!", name)
}

#[tauri::command]
fn get_memory_info() -> MemoryInfo {
    let mut system = System::new_all();
    system.refresh_memory();

    let total = system.total_memory() as f64;
    let used = system.used_memory() as f64;

    MemoryInfo {
        total_gb: total / 1000.0 / 1000.0 / 1000.0,
        used_gb: used / 1000.0 / 1000.0 / 1000.0,
        percentage: (used / total) * 100.0,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_memory_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}