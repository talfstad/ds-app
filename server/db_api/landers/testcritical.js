var critical = require('critical');

critical.generate({
    base: '/Users/alfstad/buildcave/landerds/server/staging/21c0410a621d4717f20cb72e5cdfe87d/landertoupload',
    src: 'index.html',
    dest: 'css/stylehome.css',
    ignore: ['@font-face',/url\(/]
});