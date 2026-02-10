// Declare global variable for TS (will be defined by esbuild)
declare const imgbbApiKey: string;

export async function uploadToImgbb(file: File, onProgress?: (percent: number) => void): Promise<string | null> {
	// Check if API key is defined (injected by build process)
	const apiKey = typeof imgbbApiKey !== "undefined" ? imgbbApiKey : "";

	if (!apiKey) {
		alert("ImgBB API Key not found! Please check build configuration.");
		return null;
	}

	const formData = new FormData();
	formData.append("image", file);

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable && onProgress) {
				const percent = (e.loaded / e.total) * 100;
				onProgress(percent);
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
		xhr.send(formData);
	});
}

export function createLoadingBar(): { update: (p: number) => void; remove: () => void } {
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
