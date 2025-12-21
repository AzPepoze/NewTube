const fs = require("fs");
const path = require("path");

const type_file_name = "StyleShift.d.ts";

const types_dir = path.join(__dirname, "../devs/types");
const styleshift_types_dir = path.join(types_dir, "styleshift");
const build_in_functions_dir = path.join(styleshift_types_dir, "build-in-functions");
const normal_functions_path = path.join(build_in_functions_dir, "normal.d.ts");
const extension_functions_path = path.join(build_in_functions_dir, "extension.d.ts");
const style_shift_path = path.join(types_dir, type_file_name);

const normal_functions_content = fs.readFileSync(normal_functions_path, "utf-8");
const extension_functions_content = fs.readFileSync(extension_functions_path, "utf-8");

let types_sub_dir_content = "";
fs.readdirSync(styleshift_types_dir).forEach((file) => {
	const file_path = path.join(styleshift_types_dir, file);
	if (fs.statSync(file_path).isFile()) {
		types_sub_dir_content += fs.readFileSync(file_path, "utf-8") + "\n";
	}
});

const default_export = `
export function Set_Value(id: string, value: any): void;
export function Get_Value(id: string): any;
`;

const combined_content =
	`${default_export}\n${normal_functions_content}\n${extension_functions_content}\n${types_sub_dir_content}`
		.replaceAll("declare", "")
		.replaceAll('import { Category } from "../types/store";', "");

fs.writeFileSync(style_shift_path, `declare global {\n${combined_content}\n}\nexport {};`, "utf-8");

fs.readdirSync(types_dir).forEach((file) => {
	if (file !== type_file_name) {
		try {
			fs.unlinkSync(path.join(types_dir, file));
		} catch (error) {}
		try {
			fs.rmSync(path.join(types_dir, file), { recursive: true });
		} catch (error) {}
	}
});

console.log("Types built successfully!");

export {};
