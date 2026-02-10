export interface MinimizedWindow {
	id: string;
	title: string;
	restore: () => void;
}

class WindowManager {
	minimizedWindows = $state<MinimizedWindow[]>([]);

	addWindow(window: MinimizedWindow) {
		if (!this.minimizedWindows.find((w) => w.id === window.id)) {
			this.minimizedWindows.push(window);
		}
	}

	removeWindow(id: string) {
		this.minimizedWindows = this.minimizedWindows.filter((w) => w.id !== id);
	}
}

export const windowManager = new WindowManager();
