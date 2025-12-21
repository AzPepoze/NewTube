// Declare global variable for TS (will be defined by esbuild)
declare const imgbb_api_key: string;

export async function upload_to_imgbb(file: File, on_progress?: (percent: number) => void): Promise<string | null> {
	// Check if API key is defined (injected by build process)
	const api_key = typeof imgbb_api_key !== "undefined" ? imgbb_api_key : "";

	if (!api_key) {
		alert("ImgBB API Key not found! Please check build configuration.");
		return null;
	}

	const form_data = new FormData();
	form_data.append("image", file);

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `https://api.imgbb.com/1/upload?key=${api_key}`);

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable && on_progress) {
				const percent = (e.loaded / e.total) * 100;
				on_progress(percent);
			}
		};

		xhr.onload = () => {
			if (xhr.status === 200) {
				try {
					const response = JSON.parse(xhr.responseText);
					if (response && response.data && response.data.url) {
						resolve(response.data.url);
					} else {
						reject("Invalid response from ImgBB");
					}
				} catch {
					reject("Failed to parse response");
				}
			} else {
				reject(`Upload failed with status ${xhr.status}`);
			}
		};

		xhr.onerror = () => reject("Network error");
		xhr.send(form_data);
	});
}

export function create_loading_bar(): { update: (p: number) => void; remove: () => void } {
	const container = document.createElement("div");
	container.id = "newtube-upload-progress";
	container.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 4px;
        z-index: 999999;
        background: rgba(255,255,255,0.1);
        pointer-events: none;
    `;

	const bar = document.createElement("div");
	bar.style.cssText = `
        width: 0%; height: 100%;
        background: #659aff;
        transition: width 0.2s ease-out;
        box-shadow: 0 0 10px #659aff;
    `;

	container.appendChild(bar);
	document.body.appendChild(container);

	return {
		update: (percent: number) => {
			bar.style.width = `${percent}%`;
		},
		remove: () => {
			bar.style.width = "100%";
			setTimeout(() => {
				container.style.opacity = "0";
				container.style.transition = "opacity 0.5s";
				setTimeout(() => container.remove(), 500);
			}, 200);
		},
	};
}