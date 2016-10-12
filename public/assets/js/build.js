({
    baseUrl: "../../",
    include: ["vendor/bower_installed/almond/almond", "assets/js/require_main"],
    mainConfigFile: "require_main.js",
    out: "require_main.built.js",
    wrapShim: true,
    preserveLicenseComments: false,
    findNestedDependencies: true,
    optimize: "uglify"
});