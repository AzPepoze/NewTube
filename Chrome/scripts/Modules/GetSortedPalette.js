function GetSortedPalette(palette) {

    function CalScore(color){
        var HSV = RGBtoHSV(color)
        var score = (HSV[1]*150) + (HSV[2] / 255 * 100)
        console.log(HSV)
        return score
    }

    palette = palette.map(function (color, index) {
        return {color : color, score : CalScore(color),HSV : RGBtoHSV(color)};
    });

    console.log(palette)
     
    palette.sort(function (a, b) {
        return b.score - a.score;
    });

    var sortedPalette = palette.map(function(item) {
        return item.color;
    });
 
    return sortedPalette;
 }