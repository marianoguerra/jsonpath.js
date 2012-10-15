/*global require window*/
require.config({
    baseUrl: "../",
    paths: {
        jasmine: "lib/jasmine",
        jasmineHtml: "lib/jasmine-html",
        jquery: "//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.2/jquery.min"
    },

    shim: {
        jasmine: { exports: "jasmine" },
        jasmineHtml: {
            deps: ['jasmine'],
            exports: "jasmine.HtmlReporterHelpers"
        }
    }
});

require([
    "jquery",
    "jasmine",
    "jasmineHtml",

    "test/jsonpath"
],

    function ($, jasmine, JasmineHtmlReporter/* this tests are not used*/) {
        "use strict";
        var
            jasmineEnv = jasmine.getEnv(),
            htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.updateInterval = 1000;
        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        $(function () {
            jasmineEnv.execute();
        });
    });
