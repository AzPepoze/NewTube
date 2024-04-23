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

function invert(rgb) {
    rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
    for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
    return rgb
}

async function GetSampleColor(element) {
    var colorThief = new ColorThief();

    var mostcolor = colorThief.getColor(element);
    var MostColorHSV = RGBtoHSV(mostcolor)

    console.log(mostcolor)
    console.log(MostColorHSV)

    if (MostColorHSV[1] > 0.2 && MostColorHSV[2] > 100) {
        ChooseColor = mostcolor
        console.log("Choose MostColor")
    } else {
        var palette = colorThief.getPalette(element, 10);
        palette = GetSortedPalette(palette)
        ChooseColor = palette[0]
        console.log("Choose Palette")
    }

    return ChooseColor
}