export interface MinimizedWindow {
	id: string;
	title: string;
	restore: () => void;
}

class WindowManager {
	minimized_windows = $state<MinimizedWindow[]>([]);

	add_window(window: MinimizedWindow) {
		if (!this.minimized_windows.find((w) => w.id === window.id)) {
			this.minimized_windows.push(window);
		}
	}

	remove_window(id: string) {
		this.minimized_windows = this.minimized_windows.filter((w) => w.id !== id);
	}
}

export const window_manager = new WindowManager();
