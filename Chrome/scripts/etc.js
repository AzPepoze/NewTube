let AzCached = {}
let Loaded = false

async function MainLoad(GetLoadArray) {
    if (GetLoadArray == null) {
        return AzCached
        // console.log("Load", GetLoadArray, AzCached[GetLoadArray])
    } else {
        if (Loaded == false) {
            console.log("Not loaded")
            await sleep(100)
            return await MainLoad(GetLoadArray)
        } else {
            return AzCached[GetLoadArray]
        }
    }

    // if (GetLoad == null) {
    //     await chrome.storage.local.get(GetLoadArray).then((Loaded) => {
    //         if (GetLoadArray == null) {
    //             GetLoad = Loaded
    //         } else {
    //             GetLoad = Loaded[GetLoadArray]
    //             AzCached[GetLoadArray] = GetLoad
    //             // console.log("FirstLoad", GetLoadArray, AzCached[GetLoadArray])
    //         }
    //     })
    // }
}

async function GetLoad(GetLoad) {
    // let Start = performance.now()
    let ThisLoad = await MainLoad(GetLoad)
    // console.log("Loaded", GetLoad, ThisLoad)
    // console.log(GetLoad, performance.now() - Start)
    return ThisLoad
}

async function LoadCached() {
    if (true) {
        await chrome.storage.local.get("CachedSave").then((Loaded) => {
            AzCached = Loaded["CachedSave"]
        })

        console.log(AzCached)

        if (AzCached == null) {
            AzCached = {}
        } else {
            if (AzCached["CachedSave"]) {
                delete AzCached["CachedSave"]
            }
            console.log("Loaded Cached")
        }

        Loaded = true
    }
}

LoadCached()

async function MainSave(TheSave) {
    let OriginTheSave = TheSave
    //console.log("Save", TheSave)
    if (true) {
        Object.keys(TheSave).forEach(function (ThisKey) {
            AzCached[ThisKey] = TheSave[ThisKey]
            //console.log("SaveToCached", ThisKey, TheSave[ThisKey])
        })
    }

    // console.log()
    await chrome.storage.local.set({ "CachedSave": AzCached })
}

async function LoadToConsole(GetLoadArray) {
    let Get = await MainLoad(GetLoadArray)
    console.log(Get)
}

async function ClearSave() {
    await chrome.storage.local.clear()
    AzCached = {}
}

const RGBtoHSV = function (color) {
    var r, g, b, h, s, v;
    r = color[0];
    g = color[1];
    b = color[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);


    v = max;
    delta = max - min;
    if (max != 0)
        s = delta / max;        // s
    else {
        // r = g = b = 0        // s = 0, v is undefined
        s = 0;
        h = -1;
        return [h, s, undefined];
    }
    if (r === max)
        h = (g - b) / delta;      // between yellow & magenta
    else if (g === max)
        h = 2 + (b - r) / delta;  // between cyan & yellow
    else
        h = 4 + (r - g) / delta;  // between magenta & cyan
    h *= 60;                // degrees
    if (h < 0)
        h += 360;
    if (isNaN(h))
        h = 0;
    return [h, s, v];
};

const HSVtoRGB = function (color) {
    var i;
    var h, s, v, r, g, b;
    h = color[0];
    s = color[1];
    v = color[2];
    if (s === 0) {
        // achromatic (grey)
        r = g = b = v;
        return [r, g, b];
    }
    h /= 60;            // sector 0 to 5
    i = Math.floor(h);
    f = h - i;          // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        default:        // case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return [r, g, b];
}

function calculateAndSortPalette(palette) {
    // This Function Created by Chat GPT XD

    // ฟังก์ชันคำนวณค่า luminance ของสี
    function luminance(color) {
        return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
    }

    // ฟังก์ชันคำนวณค่า saturation ของสี
    function saturation(color) {
        var r = color[0] / 255;
        var g = color[1] / 255;
        var b = color[2] / 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);

        var s = 0;
        if (max !== 0) {
            s = (max - min) / max;
        }

        return s;
    }

    // ฟังก์ชันคำนวณค่า highlightScore ของสี
    function highlightScore(color) {
        var lum = luminance(color);
        var sat = saturation(color);

        // ถ้าสีไม่ได้อยู่ในช่วง Grayscale (luminance น้อยกว่า 30 หรือมากกว่า 220 หรือ saturation น้อยกว่า 0.05) ให้คะแนนเป็น 0
        if (lum < 30 || lum > 220 || sat < 0.05) {
            return 0;
        }

        // คะแนนสำหรับ Highlight โดยให้ความสำคัญแต่ละองศาเป็นส่วน 0.6 ของ luminance และ 0.4 ของ saturation
        return 0.6 * lum + 0.4 * sat;
    }

    // คำนวณ highlightScore และเก็บค่า index ไว้พร้อมกับสีใน palette
    var paletteWithScores = palette.map(function (color, index) {
        return { color: color, score: highlightScore(color), index: index };
    });

    // เรียงลำดับ palette ตามค่า highlightScore จากมากไปหาน้อย
    paletteWithScores.sort(function (a, b) {
        return b.score - a.score;
    });

    // สร้าง palette ใหม่ที่เรียงลำดับตาม highlightScore
    var sortedPalette = paletteWithScores.map(function (item) {
        return item.color;
    });

    return sortedPalette;
}

function invert(rgb) {
    rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
    for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
    return rgb
}

function sleep(delay) { return new Promise((resolve) => setTimeout(resolve, delay)) }

async function waitForElmByID(selector) {
    return new Promise(resolve => {
        if (document.getElementById(selector)) {
            return resolve(document.getElementById(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.getElementById(selector)) {
                resolve(document.getElementById(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function TryFindElement(selector, attemp) {
    if (attemp == null) {
        attemp = 10
    }

    if (attemp > 0) {
        let element = document.querySelector(selector)

        if (element == null) {
            attemp--
            await sleep(1000)
            console.log("TryAgain")
            return await TryFindElement(selector, attemp)
        } else {
            return element
        }
    } else {
        return
    }
}

async function AutoTheaterMode() {
    if (await GetLoad("AutoTheaterT") == true) {
        let GetTheaterButton = await TryFindElement(`.ytp-size-button`)
        if (GetTheaterButton) {
            let IsPlayerInNormalMode = await TryFindElement(`#player .html5-video-player`)
            console.log(IsPlayerInNormalMode)
            if (IsPlayerInNormalMode) {
                console.log(GetTheaterButton)
                GetTheaterButton.click()
                await sleep(1000)
                IsPlayerInNormalMode = await TryFindElement(`#player .html5-video-player`)
                if (IsPlayerInNormalMode) {
                    AutoTheaterMode()
                }
            }
        }
    }
}


async function WhenYoutubeChangePage() {
    AutoTheaterMode()
}

window.addEventListener('yt-page-data-updated', WhenYoutubeChangePage)
WhenYoutubeChangePage()