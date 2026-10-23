use serde::Serialize;
use sysinfo::System;
use std::sync::Mutex;

#[cfg(target_os = "windows")]
fn memory_divisor() -> f64 {
    1024.0 * 1024.0 * 1024.0
}

#[cfg(target_os = "linux")]
fn memory_divisor() -> f64 {
    1000.0 * 1000.0 * 1000.0
}

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
fn get_memory_info(state: tauri::State<AppState>) -> MemoryInfo {
    let mut system = state.system.lock().unwrap();

    system.refresh_memory();

    let total = system.total_memory() as f64;
    let used = system.used_memory() as f64;

    let divisor = memory_divisor();

    MemoryInfo {
        total_gb: total / divisor,
        used_gb: used / divisor,
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
            get_cpu_usage,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}