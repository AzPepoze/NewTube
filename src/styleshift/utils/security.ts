import { create_notification } from "../build-in-functions/extension";
import { logger } from "../build-in-functions/logger";

export const dangerous_patterns = [
	/eval/i,
	/new function/i,
	/(?<!@)\bimport\b/i,
	/fetch/i,
	/xmlhttprequest/i,
	/xhr/i,
	/<\/?script>/i,
	/document\.createElement\s*\(\s*['"]script['"]\s*\)/i,
	/\.write\s*\(/i,
	/\.execcommand\s*\(/i,
	/\.cookie\s*=/i,
	/localstorage/i,
	/sessionstorage/i,
	/indexeddb/i,
	/opendatabase/i,
	/postmessage/i,
	/sendbeacon/i,
	/importscripts/i,
	/createobjecturl/i,
	/revokeobjecturl/i,
	/webkitrequestfilesystem/i,
	/webkitresolvelocalfilesystemurl/i,
	/showopenfilepicker/i,
	/showsavefilepicker/i,
	/showdirectorypicker/i,
	/new\s+worker\s*\(/i,
	/new\s+sharedworker\s*\(/i,
	/new\s+blob\s*\(/i,
	/url\.createobjecturl\s*\(/i,
	/\.__proto__\s*=/i,
	/\.constructor\s*=/i,
	/javascript:/i,
	/reflect\.(apply|construct|defineproperty|get|set|deleteproperty|ownkeys)/i,
	/globalthis\./i,
	/window\[(["'`"]).*\1\]/i,
	/new\s+eventsource\s*\(/i,
	/webassembly\./i,
	/\.contenteditable\s*=/i,
	/\?callback=/i,
	/new\s+proxy\s*\(/i,
	/function\.prototype\.tostring/i,
	/intl\./i,
	/symbol\./i,
];

export function is_safe_code(code: string, code_name: string): boolean {
	if (!code) return false;
	const lowered_case_code = code.toLowerCase();

	for (const pattern of dangerous_patterns) {
		if (pattern.test(lowered_case_code)) {
			const match = lowered_case_code.match(pattern);
			if (match) {
				const match_index = match.index;

				const before_match = lowered_case_code.slice(0, match_index);
				const line_number = before_match.split("\n").length;
				const char_position = match_index - before_match.lastIndexOf("\n");

				const code_lines = lowered_case_code.split("\n");
				const error_line = code_lines[line_number - 1];

				const is_comment = error_line.replaceAll(" ", "").replaceAll("\t", "").startsWith("//");
				if (is_comment) {
					continue;
				}

				const start_context = Math.max(0, char_position - 15);
				const end_context = Math.min(error_line.length, char_position + match[0].length + 15);
				const context_snippet = error_line.slice(start_context, end_context);

				const highlighted_error = context_snippet.replace(
					match[0],
					`<span style="color: red; text-decoration: underline;">${match[0]}</span>`,
				);

				create_notification({
					icon: "🚫",
					title: "StyleShift - Error",
					content: `<b>"${match[0]}"</b> is not allowed.<br>Found at line: <b>${line_number}</b>, character: <b>${char_position}</b><br>From: <b>${code_name}</b><br><br><pre>${highlighted_error}</pre>`,
					timeout: 0,
				});

				logger.warn("security", match, pattern);
			}
			return false;
		}
	}

	return true;
}
