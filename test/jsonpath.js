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

        it("should allow setting an attribute without an object", function () {
            var obj = JsonPath.set("name", "mariano");

            expect(obj.name).toBe("mariano");
        });

        it("should allow setting an attribute on an existing object", function () {
            var obj = {name: "mariano"};

            JsonPath.set("age", 27, obj);
            expect(obj.name).toBe("mariano");
            expect(obj.age).toBe(27);
        });

        it("should allow setting a deep attribute on an object", function () {
            var obj = {name: "mariano"};

            obj = JsonPath.set("cat.age", 12, obj);

            expect(obj.name).toBe("mariano");
            expect(obj.cat.age).toBe(12);
        });

        it("should override old value if existent", function () {
            var obj = JsonPath.set("a.b.c", 12, {a: {b: {c: 5}}});

            expect(obj.a.b.c).toBe(12);
        });

        it("should build path when it's halfway created", function () {
            var obj = JsonPath.set("a.b.c", 12, {a: {}});

            expect(obj.a.b.c).toBe(12);
        });

        it("should set in all cases", function () {
            var obj;

            obj = JsonPath.set("a", 12);
            expect(obj.a).toBe(12);

            obj = JsonPath.set("a.b", 12);
            expect(obj.a.b).toBe(12);

            obj = JsonPath.set("a.b.c", 12);
            expect(obj.a.b.c).toBe(12);

            obj = JsonPath.set("a.b.c.d", 12);
            expect(obj.a.b.c.d).toBe(12);

            obj = JsonPath.set("a.b.c", 12, {});
            expect(obj.a.b.c).toBe(12);

            obj = JsonPath.set("a.b.c", 12, {d: "hi"});
            expect(obj.a.b.c).toBe(12);
            expect(obj.d).toBe("hi");

            obj = JsonPath.set("a.b.c", 12, {a: {}});
            expect(obj.a.b.c).toBe(12);

            obj = JsonPath.set("a.b.c", 12, {a: {b: {}}});
            expect(obj.a.b.c).toBe(12);

            obj = JsonPath.set("a.b.c", 12, {a: {b: {c: 13}}});
            expect(obj.a.b.c).toBe(12);

            obj = JsonPath.set("a.b.c", 12, {a: {b: {c: {d: 4}}}});
            expect(obj.a.b.c).toBe(12);
        });

        it("should extract values and set them in another object", function () {
            var
                key,
                dest,
                src = {
                    "name": "bob",
                    "location": "bikini bottom",
                    "age": 10,
                    "pet": "gary",
                    "friends": {
                        "patrick": "starfish",
                        "sandy": "squirrel"
                    }
                };

            dest = JsonPath.extract({}, {}, {});
            expect(Object.keys(dest).length).toBe(0);

            dest = JsonPath.extract({}, {a: 42}, {});
            expect(Object.keys(dest).length).toBe(0);

            dest = JsonPath.extract({
                "name": "the.name",
                "location": "the.location.of.it",
                "age": "age",
                "friends.patrick": "star"
            }, src, {});

            expect(dest.the.name).toBe("bob");
            expect(dest.age).toBe(10);
            expect(dest.the.location.of.it).toBe("bikini bottom");
            expect(dest.star).toBe("starfish");

            dest = JsonPath.extract({
                "age": "theAge"
            }, src, {theAge: 12});

            expect(dest.theAge).toBe(10);

            dest = JsonPath.extract({
                "doesntExist": "theAge"
            }, src, {}, 40);

            expect(dest.theAge).toBe(40);

            dest = JsonPath.extract({
                "doesntExist": "theAge"
            }, src, {theAge: 12}, 40);

            expect(dest.theAge).toBe(40);
        });
    });

});
