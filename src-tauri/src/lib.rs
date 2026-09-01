use sysinfo::System;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}, hier ist Rust!", name)
}

#[tauri::command]
fn get_memory_usage() -> f32 {
    let mut system = System::new_all();
    system.refresh_memory();

    let total = system.total_memory() as f32;
    let used = system.used_memory() as f32;

    (used / total) * 100.0
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_memory_usage])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
