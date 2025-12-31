use tauri::command;
use std::fs::write;
use enigo::{Enigo, KeyboardControllable, Key};
use arboard::Clipboard;

#[command]
pub fn save_to_file(filename: String, content: String) -> Result<(), String> {
    write(filename, content).map_err(|e| e.to_string())
}

#[command]
pub fn insert_text_system(text: String) -> Result<(), String> {
    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;
    clipboard
        .set_text(text.clone())
        .map_err(|e| e.to_string())?;

    let mut enigo = Enigo::new();
    enigo.key_down(Key::Control);
    enigo.key_click(Key::Layout('v'));
    enigo.key_up(Key::Control);

    Ok(())
}
