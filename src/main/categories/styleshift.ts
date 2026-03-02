import { Category } from "../../styleshift/types/store";
import { toggleCustomize } from "../../styleshift/ui/highlight";

export const styleshiftCategory: Category = {
    category: "🛠️ StyleShift",
    settings: [
        {
            type: "button",
            id: "StyleShiftToggleCustomize",
            name: "Customize Elements",
            description:
                "Enables element selection mode. Click on any element on the page to customize its styles, colors, and visibility.",
            icon: "edit",
            clickFunction: toggleCustomize,
        },
    ],
};
