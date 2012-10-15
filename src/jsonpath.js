/*global define*/
define([], function () {
    "use strict";
    var mod = {};

    mod._compilePath = function (path) {
        return path.split(/ *\. */g).map(function (token) {
            return token.trim();
        });
    };

    mod.get = function (path, obj, defaultValue) {
        var result = obj, i, j, subPath, newResult, key;

        if (path.trim() === "") {
            return obj;
        } else {
            path = mod._compilePath(path);

            if (path.length > 0 && path[0] === "$") {
                path = path.slice(1);
            }

            for (i = 0; result !== undefined && i < path.length; i += 1) {
                subPath = path[i];

                if (subPath === "*") {
                    newResult = [];

                    for (key in result) {
                        if (result.hasOwnProperty(key)) {
                            newResult.push(result[key]);
                        }
                    }

                    result = newResult;
                } else {
                    if (Array.isArray(result)) {
                        newResult = [];

                        for (j = 0; j < result.length; j += 1) {
                            newResult.push(result[j][subPath]);
                        }

                        result = newResult;
                    } else {
                        result = result[subPath];
                    }
                }
            }
        }

        if (result === undefined) {
            result = defaultValue;
        }

        return result;
    };

    return mod;
});
