use serde::Serialize;
use sysinfo::System;
use std::sync::Mutex;

#[derive(Serialize)]
struct MemoryInfo {
    total_gb: f64,
    used_gb: f64,
    percentage: f64
}

struct AppState {
    system: Mutex<System>,
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

#[tauri::command]
fn get_cpu_usage(state: tauri::State<AppState>) -> f32 {

    let mut system = state.system.lock().unwrap();

    system.refresh_cpu_usage();

    system.global_cpu_usage()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut system = System::new_all();

    system.refresh_cpu_usage();

    tauri::Builder::default()
        .manage(AppState {
            system: Mutex::new(system),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_memory_info,
            get_cpu_usage
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}