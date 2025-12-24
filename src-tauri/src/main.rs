#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Emitter;
use std::fs::write;

#[tauri::command]
fn save_to_file(filename: String, content: String) -> Result<(), String> {
    write(filename, content).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_to_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
