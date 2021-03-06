"use strict";
var mp = function(mp) {
    mp.dye = {
        getChannel: getChannel,
        parseDyeString: parseDyeString,
        dyeImage: dyeImage
    };
    var channel = [null, "R", "G", "Y", "B", "M", "C", "W"];
    function getChannel(color) {
        var r = color[0], g = color[1], b = color[2],
            max = Math.max(r, g, b);

        if (max == 0) {
            // Black
            return { channel: null, intensity: 0 };
        }

        var min = Math.min(r, g, b), intensity = r + g + b;

        var idx;

        if (min != max && (min != 0 || (intensity != max && intensity != 2 * max))) {
            // Not pure
            idx = 0;
        } else {
            idx = (r != 0) | ((g != 0) << 1) | ((b != 0) << 2);
        }

        return { channel: channel[idx], intensity: max };
    }
    /*
     * Return a dye specification from a dye string.
     */
    function parseDyeString(dyeString) {
        /* TODO */
    }
    /*
     * Dye the internal image data based on the specification provided by dyeData.
     * The specification can be generated from a dyeString by parseDyeString.
     * The array passed in will be modified.
     */
    function dyeImage(imageData, dyeData) {
        for (var p = 0; p < imageData.length; p += 4) {
            var pixel = [imageData[p], imageData[p + 1], imageData[p + 2]];
            var alpha = imageData[p + 3];
            if (!alpha) {
                continue;
            }

            var channel = getChannel(pixel);
            var channelId = channel.channel;

            if (!channelId || !(channelId in dyeData) || !dyeData[channelId].length) {
                continue;
            }

            var intensity = channel.intensity;
            var val = intensity * dyeData[channelId].length
            var i = Math.floor(val / 255);
            var t = val - i * 255;
            if (!t) {
                --i;
                imageData[p    ] = dyeData[channelId][i][0];
                imageData[p + 1] = dyeData[channelId][i][1];
                imageData[p + 2] = dyeData[channelId][i][2];
                continue;
            }

            imageData[p    ] = ((255 - t) * (i && dyeData[channelId][i - 1][0]) + t * dyeData[channelId][i][0]) / 255;
            imageData[p + 1] = ((255 - t) * (i && dyeData[channelId][i - 1][1]) + t * dyeData[channelId][i][1]) / 255;
            imageData[p + 2] = ((255 - t) * (i && dyeData[channelId][i - 1][2]) + t * dyeData[channelId][i][2]) / 255;
        }
        /* TODO */
        return imageData;
    }
    return mp;
}(mp || {});
