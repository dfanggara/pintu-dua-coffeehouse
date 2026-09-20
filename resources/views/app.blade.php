<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Pintu Dua Coffeehouse</title>
        <meta name="description" inertia content="Tempat ngopi asyik dan modern di Lubang Buaya, Jakarta Timur. Nikmati kopi signature, suasana nyaman, dan pesan tempatmu secara instan di Pintu Dua Coffeehouse.">
        <meta property="og:title" inertia content="Pintu Dua Coffeehouse | Modern Urban Sanctuary">
        <meta property="og:description" inertia content="Tempat ngopi asyik dan modern di Lubang Buaya, Jakarta Timur.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://pintuduacoffee.com">
        <link rel="icon" type="image/png" href="/images/logo.png">

        <!-- Fonts & Icons -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
