use tauri::{AppHandle, WindowUrl, WindowBuilder, Manager};

use crate::utils;

pub fn spawn_window(app_handle: AppHandle) {
    if let Some(window) = app_handle.get_window("creation") {
        window.set_focus().expect("creation window should focus");
        return;
    }
    std::thread::spawn(move || {
        let window = WindowBuilder::new(
            &app_handle,
            "creation",
            WindowUrl::App("/creation".into()),
        )
        .center()
        .title("Create new note")
        .skip_taskbar(true)
        // .focused(true)
        .visible(false)
        .always_on_top(true)
        .build()
        .expect("creation window should open");

        if let Some((window_size, window_pos)) = utils::window::placement(&window, 0.5, 800, 600) {
            window
                .set_size(window_size)
                .expect("creation window size configuration must be succeed");
            window
                .set_position(window_pos)
                .expect("creation window position configuration must be succeed");
        }
        window
            .show()
            .expect("creation window visibility configuration must succeed");
    });
}
