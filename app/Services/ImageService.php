<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Compress and optimize uploaded image (default max width 1920px for HD displays, WebP format).
     *
     * @param  UploadedFile  $file
     * @param  string  $directory
     * @param  int  $maxWidth
     * @param  int  $quality
     * @return string Public storage URL path e.g. '/storage/banners/filename.webp'
     */
    public static function compressAndStore(UploadedFile $file, string $directory = 'uploads', int $maxWidth = 1920, int $quality = 85): string
    {
        $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = Str::slug($filename) . '-' . time() . '.webp';
        $relativeStoragePath = $directory . '/' . $filename;
        $fullDestinationPath = storage_path('app/public/' . $relativeStoragePath);

        // Ensure target directory exists
        $targetDir = dirname($fullDestinationPath);
        if (! file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Try using Intervention Image (v3) if class exists
        if (class_exists(\Intervention\Image\ImageManager::class)) {
            try {
                $manager = \Intervention\Image\ImageManager::gd();
                $image = $manager->read($file->getRealPath());

                // Scale down only if width > $maxWidth
                if ($image->width() > $maxWidth) {
                    $image->scale(width: $maxWidth);
                }

                // Encode to WebP with high quality
                $encoded = $image->toWebp($quality);
                file_put_contents($fullDestinationPath, (string) $encoded);

                return '/storage/' . $relativeStoragePath;
            } catch (\Throwable $e) {
                // Fallback to standard Laravel storage if processing fails
            }
        }

        // Native PHP GD Fallback if intervention is loading or unavailable
        try {
            $imageInfo = getimagesize($file->getRealPath());
            if ($imageInfo) {
                $mime = $imageInfo['mime'];
                $srcImage = match ($mime) {
                    'image/jpeg', 'image/jpg' => imagecreatefromjpeg($file->getRealPath()),
                    'image/png' => imagecreatefrompng($file->getRealPath()),
                    'image/webp' => imagecreatefromwebp($file->getRealPath()),
                    default => null,
                };

                if ($srcImage) {
                    $origW = imagesx($srcImage);
                    $origH = imagesy($srcImage);

                    if ($origW > $maxWidth) {
                        $newW = $maxWidth;
                        $newH = (int) round(($origH / $origW) * $maxWidth);
                    } else {
                        $newW = $origW;
                        $newH = $origH;
                    }

                    $dstImage = imagecreatetruecolor($newW, $newH);
                    if ($mime === 'image/png' || $mime === 'image/webp') {
                        imagealphablending($dstImage, false);
                        imagesavealpha($dstImage, true);
                    }

                    imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
                    imagewebp($dstImage, $fullDestinationPath, $quality);

                    imagedestroy($srcImage);
                    imagedestroy($dstImage);

                    return '/storage/' . $relativeStoragePath;
                }
            }
        } catch (\Throwable $e) {
            // Silence & fallback to raw store
        }

        // Default direct store if GD fails
        $path = $file->store($directory, 'public');
        return '/storage/' . $path;
    }
}
