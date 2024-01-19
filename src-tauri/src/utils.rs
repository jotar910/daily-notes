pub mod window {
    use tauri::{LogicalPosition, LogicalSize, Window};

    pub fn placement(
        window: &Window,
        percentage: f32,
        min_width: u32,
        min_height: u32,
    ) -> Option<(LogicalSize<u32>, LogicalPosition<u32>)> {
        let monitor = window
            .current_monitor()
            .expect("monitor must exists on window context");

        if let Some(monitor) = monitor {
            let monitor_size = monitor.size();
            let window_size = LogicalSize {
                width: relative_size(monitor_size.width, percentage, min_width),
                height: relative_size(monitor_size.height, percentage, min_height),
            };
            let window_pos = LogicalPosition {
                x: (monitor_size.width - window_size.width) / 2,
                y: (monitor_size.height - window_size.height) / 2,
            };
            return Some((window_size, window_pos));
        }
        return None;
    }

    fn relative_size(size: u32, percentage: f32, min: u32) -> u32 {
        let res = ((size as f32) * percentage) as u32;
        let min = min.min(size);
        res.max(min)
    }
}

pub mod paths {
    pub fn database() -> String {
       return configs() + "/database.sqlite";
    }

    pub fn settings() -> String {
        return configs() + "/settings.json";
    }

    fn configs() -> String {
        return home() + "/.config/daily-notes"; 
    }

    fn home() -> String {
        let home_dir = dirs::home_dir().expect("home directory must be defined");
        return home_dir.to_str().unwrap().to_string();
    }
}
