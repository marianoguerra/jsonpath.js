/*global define*/
(function (root, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.JsonPath = factory());
        });
    } else {
        // Browser globals
        root.JsonPath = factory();
    }
}(this, function () {
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

    mod.set = function (path, value, obj) {
        var node = obj, subPath, i, isLastSubPath;

        if (obj === undefined) {
            obj = {};
            node = obj;
        }

        path = mod._compilePath(path);

        obj[path] = value;

        for (i = 0; i < path.length; i += 1) {
            subPath = path[i];

            isLastSubPath = (i + 1 === path.length);

            if (node[subPath] === undefined) {
                // if last one
                if (isLastSubPath) {
                    node[subPath] = value;
                } else {
                    node[subPath] = {};
                }
            } else if (isLastSubPath) {
                node[subPath] = value;
            }

            node = node[subPath];
        }

        return obj;
    };

    // receive a mapping of paths in key and paths in value
    // extract the value of path in src with the key and set it
    // to the path in value in dest
    mod.extract = function (mapping, src, dest, defaultValue) {
        var i, srcPath, destPath, srcValue;

        if (dest === undefined) {
            dest = {};
        }

        if (Array.isArray(mapping)) {
            // if it's an array then each object has a srcPath and destPath
            // field
            for (i = 0; i < mapping.length; i += 1) {
                srcPath  = mapping[i].srcPath;
                destPath = mapping[i].destPath;

                srcValue = mod.get(srcPath, src, defaultValue);
                mod.set(destPath, srcValue, dest);
            }

        } else {
            // if it's not an array then use keys as source path and values
            // as dest paths
            for (srcPath in mapping) {
                destPath = mapping[srcPath];

                srcValue = mod.get(srcPath, src, defaultValue);
                mod.set(destPath, srcValue, dest);
            }
        }

        return dest;
    };

    return mod;
}));
