const fs = require('fs');
const files = [
    'resources/js/Pages/Admin/Users/Index.jsx',
    'resources/js/Pages/Admin/Menus/Index.jsx',
    'resources/js/Pages/Admin/InstagramPosts/Index.jsx',
    'resources/js/Pages/Admin/HeroBanners/Index.jsx',
    'resources/js/Pages/Admin/Galleries/Index.jsx'
];

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/(const\s+handle(?:Edit\w*|MenuEdit)\s*=\s*\([^)]*\)\s*=>\s*\{)/g, "$1\n        window.scrollTo({ top: 0, behavior: 'smooth' });");
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
});
