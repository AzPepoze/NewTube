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

async function TryFindElement(selector, attemp) {
    if (attemp == null) {
        attemp = 10
    }

    if (attemp > 0) {
        let element = document.querySelector(selector)

        if (element == null) {
            attemp--
            await sleep(1000)
            if (DebugMode) {
                console.log("TryAgain")
            }
            return await TryFindElement(selector, attemp)
        } else {
            return element
        }
    } else {
        return
    }
}

async function GetDocumentBody() {
    var DocumentBody = document.body

    if (DocumentBody) {
        return DocumentBody
    } else {
        await sleep(100)
        return await GetDocumentBody()
    }
}

async function GetDocumentHead() {
    var DocumentHead = document.head

    if (DocumentHead) {
        return DocumentHead
    } else {
        await sleep(100)
        return await GetDocumentBody()
    }
}

async function RemoveNewLine(Text) {
    if (Text.includes("\n")) {
        Text = Text.replaceAll("\n", "")
        return await RemoveNewLine(Text)
    } else {
        return await Text
    }
}

function ExportFile(data, filename, type) {
    var file = new Blob([data], { type: type })
    var a = document.createElement("a"),
        url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }, 0)
}

async function RunAllCallback(array, args) {
    array.filter(callback => !!callback).map(callback => callback(args))
    // for (var callback of array) {
    //     if (!callback) continue
    //     await callback()
    //     await sleep(0)
    // }
}

async function RunAllCallbackOBJ(OBJ, args) {
    //Object.values(OBJ).filter(callback => !!callback).map(callback => callback(args))
    for (var callback of Object.values(OBJ)) {
        if (!callback) continue
        await callback(args)
        await sleep(0)
    }
}

async function RunAllCallbackMAP(MAP, args) {
    Array.from(MAP.values()).filter(callback => !!callback).map(callback => callback(args))
    // for (var callback of MAP.values()) {
    //     if (!callback) continue
    //     await callback(args)
    //     await sleep(0)
    // }
}

function ELementChange(element, callback, config) {
    if (DebugMode) {
        console.log(element, callback)
    }
    var WatchChange = new MutationObserver(callback)
    WatchChange.observe(element, config)
    return WatchChange
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function DistanceFromRootTop(element, root) {
    const elementRect = element.getBoundingClientRect();
    const rootRect = root ? root.getBoundingClientRect() : document.documentElement.getBoundingClientRect();

    const rootTop = rootRect.top

    const elementTop = elementRect.top
    const elementBottom = elementRect.top + elementRect.height

    const distance = Math.min(
        Math.abs(rootTop - elementTop),
        Math.abs(rootTop - elementBottom),
    )

    return distance;
}

function CopyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

async function WaitDocumentLoaded() {
    return new Promise(async resolve => {
        var Loop = setInterval(function () {
            if (document.readyState === "complete") {
                clearInterval(Loop);
                resolve()
            }
        }, 100);
    })
}

function WhenElementRemove(targetElement, callback) {
    var observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode === targetElement) {
                        callback();
                        observer.disconnect();
                        return;
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true });
}

//--------------------------------------------------------------------------
// isElementInViewport
//--------------------------------------------------------------------------

function isElementVerticallyInViewport(elem) {
    var rect = elem.getBoundingClientRect();

    return (
        (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}

//--------------------------------------------------------------------------
// OnScroll
//--------------------------------------------------------------------------

var OnScrollTask = new Map();

async function RunScroll(element) {
    console.log(element)

    if (!OnScrollTask.has(element)) return;
    if (OnScrollTask.get(element).Running) return;

    OnScrollTask.get(element).Running = true;

    var ScrollTop

    if (element == window) {
        ScrollTop = document.documentElement.scrollTop
    } else {
        ScrollTop = element.scrollTop
    }

    await RunAllCallbackMAP(OnScrollTask.get(element).AllFunction, ScrollTop);

    OnScrollTask.get(element).Running = false;
}

/**
 * @param {HTMLBaseElement} element
 * @param {Function} Func
 */

function RunWhenScroll(element, Func, UseGlobalScroll) {
    var UniqueID = Date.now();

    if (!OnScrollTask.has(element)) {
        OnScrollTask.set(element, {
            AllFunction: new Map(),
            Running: false
        });
    }

    OnScrollTask.get(element).AllFunction.set(UniqueID, Func);

    function Stop() {
        OnScrollTask.get(element).AllFunction.delete(UniqueID);
        if (OnScrollTask.get(element).AllFunction.size === 0) {

            var ThisElementToRemove

            if (UseGlobalScroll) {
                ThisElementToRemove = window
            } else {
                ThisElementToRemove = element
            }

            ThisElementToRemove.removeEventListener('scroll', OnScrollTask.get(element).EventListener);

            OnScrollTask.delete(element)
        }
    }

    if (!OnScrollTask.get(element).EventListener) {
        OnScrollTask.get(element).EventListener = function () {
            RunScroll(element);
        };
        if (UseGlobalScroll) {
            window.addEventListener('scroll', OnScrollTask.get(element).EventListener, true);
        } else {
            element.addEventListener('scroll', OnScrollTask.get(element).EventListener, false);
        }
    }

    RunScroll(element)

    return {
        Stop: Stop
    };
}

//--------------------------------------------------------------------------
// Slider
// By ChatGPT XD (90%)
//--------------------------------------------------------------------------

function debounce(func, delay) {
    let timeoutId;
    return function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, arguments);
        }, delay);
    };
}

//--------------------------------------------------------------------------

function CreateSlider(parentElement, min, max, step, value) {
    let slider = document.createElement("div");
    slider.classList.add("NewtubeSlider");
    slider.setAttribute('max', max);
    slider.setAttribute('min', min);
    slider.setAttribute('step', step);
    slider.setAttribute('value', value);
    parentElement.appendChild(slider);

    let progress = document.createElement("div");
    progress.classList.add("NewtubeSlider-progress");
    slider.appendChild(progress);

    let thumb = document.createElement("div");
    thumb.classList.add("NewtubeSlider-thumb");
    thumb.style.userSelect = "none"; // Prevent text selection on thumb
    slider.appendChild(thumb);

    let sliderWidth, thumbWidth, isDragging = false;

    slider.addEventListener("mousedown", function (event) {
        isDragging = true;
        moveThumb(event);
        document.addEventListener("mousemove", moveThumb);
        // Prevent text selection on the entire slider while dragging
        if (event.preventDefault) event.preventDefault();
    });

    document.addEventListener("mouseup", function () {
        if (isDragging == true) {
            isDragging = false;
            document.removeEventListener("mousemove", moveThumb);
            if (Slider.OnChange) {
                let currentValue = parseFloat(slider.getAttribute('value'));
                Slider.OnChange(currentValue);
            }
            // Re-enable text selection after dragging
            document.body.style.userSelect = "";
        }
    });

    function moveThumb(event) {
        if (isDragging) {
            sliderWidth = slider.offsetWidth;
            thumbWidth = thumb.offsetWidth;
            let clickX = event.clientX - slider.getBoundingClientRect().left;
            let position = clickX;

            // Calculate the position based on step
            let stepDecimalPlaces = step.toString().split('.')[1] ? step.toString().split('.')[1].length : 0;
            let newValue = Math.round((position / sliderWidth) * (max - min) / step) * step + min;

            // Clamp the newValue
            newValue = Math.min(max, Math.max(min, newValue));

            let newPosition = ((newValue - min) / (max - min)) * sliderWidth;

            // Clamp the position
            newPosition = Math.max(0, Math.min(newPosition, sliderWidth));

            thumb.style.left = newPosition + "px";
            slider.setAttribute('value', newValue);
            progress.style.width = newPosition + "px";

            if (Slider.OnInput) {
                Slider.OnInput(newValue);
            }
        }
    }

    function updateSlider() {
        max = parseFloat(slider.getAttribute('max')) || 100;
        min = parseFloat(slider.getAttribute('min')) || 0;
        step = parseFloat(slider.getAttribute('step')) || 1;
        value = parseFloat(slider.getAttribute('value')) || 0;

        sliderWidth = slider.offsetWidth;
        let position = ((value - min) / (max - min)) * sliderWidth;
        thumb.style.left = position + "px";
        progress.style.width = position + "px";
    }

    updateSlider();

    const resizeObserver = new ResizeObserver(updateSlider);
    resizeObserver.observe(parentElement);

    var Slider = {
        OnInput: null,
        OnChange: null,
        Element: slider
    };

    return Slider;
}