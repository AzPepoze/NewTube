import { refreshExtensionState } from "@core/index";
import { saveToStorage } from "@core/storage/manager";
import {
	getAddOnItems,
	updateStyleShiftItems,
} from "@settings/registry/items";
import type {
	Category,
	SeparateCategory,
} from "@settings/types/styleshiftTypes";
import {
	addDrag,
	addDropTarget,
	clearDropTargets,
} from "@ui/settings/reorder";

export interface SettingsWindowProps {
	internalSettings: (Category | SeparateCategory)[];
	externalSettings: Category[];
	devOnlyItems: Category[];
	isDeveloperMode: boolean;
	isDevModulesLoaded: boolean;
	onAddCategory: (name: string) => void;
}

export class SettingsWindowController {
	// State
	searchQuery = $state("");
	scrollContainer = $state<HTMLElement | null>(null);
	leftSidebar = $state<HTMLElement | null>(null);
	activeCategoryLabel = $state("");
	sidebarWidth = $state(200);

	// Props reference
	#props: SettingsWindowProps;

	constructor(props: SettingsWindowProps) {
		this.#props = props;
	}

	// Derived data
	internalData = $derived.by(() => {
		return this.#filterAndProcess(this.#props.internalSettings, this.#props.externalSettings, true);
	});

	externalCategoriesData = $derived.by(() => {
		return this.#filterAndProcess(this.#props.externalSettings, this.#props.internalSettings, false) as Category[];
	});

	buildInItemsData = $derived.by(() => {
		return this.internalData.filter((item) => this.isHeaderItem(item) || !item.editable);
	});

	addOnItemsData = $derived.by(() => {
		return [
			...this.internalData.filter((item) => !this.isHeaderItem(item) && item.editable),
			...this.externalCategoriesData,
		];
	});

	sidebarData = $derived.by(() => {
		const result: (Category | SeparateCategory)[] = [];
		if (this.buildInItemsData.length > 0) {
			result.push({ isHeader: true, label: "BUILD-IN" }, ...this.buildInItemsData);
		}
		if (this.addOnItemsData.length > 0) {
			result.push({ isHeader: true, label: "ADD-ON" }, ...this.addOnItemsData);
		}
		return result;
	});

	// Helpers
	isHeaderItem(item: Category | SeparateCategory): item is SeparateCategory {
		return "isHeader" in item;
	}

	#getVisibleSettings(settings: any[]) {
		return settings.filter((s) => s.type !== "conditionSetting" || this.#props.isDeveloperMode);
	}

	#mergeDevItems(categories: (Category | SeparateCategory)[], allCategories: (Category | SeparateCategory)[], pushMissing: boolean = true) {
		if (!this.#props.isDevModulesLoaded || !this.#props.isDeveloperMode) return categories;

		for (const devCategory of this.#props.devOnlyItems.filter((item) => !this.isHeaderItem(item))) {
			const label = (devCategory as Category).category;
			const target = categories.find((item) => !this.isHeaderItem(item) && (item as Category).category === label) as Category;

			if (target) {
				target.settings = [...target.settings, ...devCategory.settings];
			} else if (pushMissing && !allCategories.some((item) => !this.isHeaderItem(item) && (item as Category).category === label)) {
				categories.push(devCategory);
			}
		}
		return categories;
	}

	#filterAndProcess(items: (Category | SeparateCategory)[], otherItems: (Category | SeparateCategory)[], pushMissing: boolean) {
		const processed = items.map((item) => {
			if (this.isHeaderItem(item)) return item;
			return { ...item, settings: this.#getVisibleSettings(item.settings) };
		});

		const merged = this.#mergeDevItems(processed, otherItems, pushMissing);
		return this.searchQuery ? this.#applySearch(merged) : merged;
	}

	#applySearch(categories: (Category | SeparateCategory)[]) {
		const query = this.searchQuery.toLowerCase();

		return categories
			.map((item) => {
				if (this.isHeaderItem(item)) return item;

				const matches = item.settings.filter((s: any) => {
					const name = s.name?.toLowerCase() || "";
					const desc = s.description?.toLowerCase() || "";
					return name.includes(query) || desc.includes(query);
				});

				return { ...item, settings: matches };
			})
			.filter((item) => this.isHeaderItem(item) || item.settings.length > 0);
	}

	// Actions
	async moveCategory(category: Category, direction: "up" | "down") {
		const addOnItems = getAddOnItems();
		const index = addOnItems.indexOf(category);
		if (index === -1) return;

		const newIndex = direction === "up" ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= addOnItems.length) return;

		const [movedItem] = addOnItems.splice(index, 1);
		addOnItems.splice(newIndex, 0, movedItem);

		await saveToStorage("addOnStyleShiftItems", addOnItems);
		await updateStyleShiftItems();
		refreshExtensionState();
	}

	setupDragAndDrop(node: HTMLElement, item: Category | SeparateCategory) {
		if (this.isHeaderItem(item) || !this.#props.isDeveloperMode || !(item as Category).editable) return;

		const dragHandle = node.querySelector(".drag-handle") as HTMLElement;
		if (dragHandle) {
			addDrag(dragHandle, node, this.leftSidebar, item);
			addDropTarget(node, this.leftSidebar!, item, "category");
		}
	}

	clearTargets() {
		clearDropTargets();
	}

	handleScroll = () => {
		if (!this.scrollContainer) return;
		const containerRect = this.scrollContainer.getBoundingClientRect();
		const activeFrame = Array.from(this.scrollContainer.querySelectorAll(".styleshift-category-frame")).find((frame) => {
			const rect = frame.getBoundingClientRect();
			return rect.top <= containerRect.top + 100 && rect.bottom > containerRect.top + 100;
		}) as HTMLElement;

		if (activeFrame?.dataset.category) {
			this.activeCategoryLabel = activeFrame.dataset.category;
		}
	};

	handleResizeStart = (event: MouseEvent) => {
		event.preventDefault();
		const startX = event.clientX;
		const startWidth = this.sidebarWidth;

		const onMouseMove = (moveEvent: MouseEvent) => {
			this.sidebarWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
			if (this.leftSidebar) {
				this.leftSidebar.style.width = `${this.sidebarWidth}px`;
			}
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	handleAddCategory = () => {
		const categoryName = prompt("Enter category name:");
		if (categoryName) {
			this.#props.onAddCategory(categoryName);
		}
	};

	scrollToCategory = (parts: { text: string }) => {
		const target = this.scrollContainer?.querySelector(
			`.styleshift-category-frame[data-category="${parts.text}"]`,
		);
		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
			this.activeCategoryLabel = parts.text;
		}
	};
}
