/*global define describe it expect*/
define(["jasmine", "src/jsonpath"],
    function (Jasmine, JsonPath) {
    "use strict";

    describe("jsonpath", function () {
        var
            obj1 = {
                "foo": 42,
                "bar": "hello",
                "baz": {
                    "foo": 43
                }
            },
            deeplyNested = { "a": {"b": {"c": {"d": {"e": {"f": 1, "g": 2}}}}}},
            deeplyNested1 = { "a": {"b": {"c": {"d":
                {"e": {"f": 1, "g": 2},
                 "h": {"f": 3, "g": 4}}}}}};

        function checkPath(path, value, expected, defaultVal, op) {
            return expect(JsonPath.get(path, value, defaultVal)).toBe(expected);
        }

        function checkPathEqual(path, value, expected, defaultVal, op) {
            return expect(JsonPath.get(path, value, defaultVal)).toEqual(expected);
        }

        it("should be available", function () {
            expect(JsonPath).not.toBe(undefined);
        });

        it("should return the original object on empty path", function () {
            function check(value) {
                checkPath("", value, value);
            }

            check(42);
            check(null);
            check();
            check([]);
            check({});
            check([1]);
            check("asd");
            check({a: 2});
        });

        it("should return the attribute if path is just an attribute", function () {
            checkPath("$.foo", obj1, 42);
            checkPath("$.bar", obj1, "hello");
        });

        it("should return default if result is undefined", function () {
            checkPath("$.asd", obj1, "not found", "not found");
        });

        it("should return the correct value with nested path", function () {
            checkPath("$.baz.foo", obj1, 43);
        });

        it("should return the correct value with deeply nested path", function () {
            checkPath("$.a.b.c.d.e.f", deeplyNested, 1);
            checkPath("$.a.b.c.d.e.g", deeplyNested, 2);
        });

        it("should return default value with deeply nested path", function () {
            checkPath("$.a.b.c.d.e.h", deeplyNested, 3, 3);
            checkPath("$.a.b.c.h", deeplyNested, 4, 4);
            checkPath("$.h", deeplyNested, 5, 5);
        });

        it("should return all childs when * is used", function () {
            checkPathEqual("$.a.b.c.d.e.*", deeplyNested, [1, 2]);
        });

        it("should return all childs when *.something is used", function () {
            checkPathEqual("$.a.b.c.d.*.f", deeplyNested1, [1, 3]);
        });
    });

});
