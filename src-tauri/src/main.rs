#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::{save_to_file, insert_text_system};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_to_file,
            insert_text_system
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
