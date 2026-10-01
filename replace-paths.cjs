const fs = require('fs');
const files = [
    'resources/views/app.blade.php',
    'resources/js/Layouts/GuestLayout.jsx',
    'resources/js/Layouts/AuthenticatedLayout.jsx',
    'resources/js/Components/StorySection.jsx',
    'resources/js/Components/Navbar.jsx',
    'resources/js/Components/LoadingScreen.jsx',
    'resources/js/Components/Footer.jsx'
];

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/\/images\/logo\.png/g, '/images/logo.webp')
         .replace(/\/images\/ourstory\.png/g, '/images/ourstory.webp')
         .replace(/type="image\/png" href="\/images\/logo\.webp"/g, 'type="image/webp" href="/images/logo.webp"');
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
});
