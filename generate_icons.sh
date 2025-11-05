#!/bin/bash

# Script para generar iconos de la aplicación
# Requiere ImageMagick instalado: sudo apt install imagemagick

SOURCE_IMAGE="src/assets/images/savelook.png"

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: No se encuentra la imagen fuente $SOURCE_IMAGE"
    exit 1
fi

echo "Generando iconos para Android..."

# Android - mipmap folders
convert "$SOURCE_IMAGE" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
convert "$SOURCE_IMAGE" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert "$SOURCE_IMAGE" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert "$SOURCE_IMAGE" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert "$SOURCE_IMAGE" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

# Android - round icons
convert "$SOURCE_IMAGE" -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
convert "$SOURCE_IMAGE" -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
convert "$SOURCE_IMAGE" -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
convert "$SOURCE_IMAGE" -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
convert "$SOURCE_IMAGE" -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

echo "Generando iconos para iOS..."

# iOS - AppIcon sizes
mkdir -p ios/savelook/Images.xcassets/AppIcon.appiconset

convert "$SOURCE_IMAGE" -resize 20x20 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-20.png
convert "$SOURCE_IMAGE" -resize 40x40 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-20@2x.png
convert "$SOURCE_IMAGE" -resize 60x60 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-20@3x.png
convert "$SOURCE_IMAGE" -resize 29x29 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-29.png
convert "$SOURCE_IMAGE" -resize 58x58 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-29@2x.png
convert "$SOURCE_IMAGE" -resize 87x87 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-29@3x.png
convert "$SOURCE_IMAGE" -resize 40x40 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-40.png
convert "$SOURCE_IMAGE" -resize 80x80 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-40@2x.png
convert "$SOURCE_IMAGE" -resize 120x120 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-40@3x.png
convert "$SOURCE_IMAGE" -resize 60x60 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-60@2x.png
convert "$SOURCE_IMAGE" -resize 180x180 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-60@3x.png
convert "$SOURCE_IMAGE" -resize 76x76 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-76.png
convert "$SOURCE_IMAGE" -resize 152x152 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-76@2x.png
convert "$SOURCE_IMAGE" -resize 167x167 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-83.5@2x.png
convert "$SOURCE_IMAGE" -resize 1024x1024 ios/savelook/Images.xcassets/AppIcon.appiconset/Icon-1024.png

echo "¡Iconos generados exitosamente!"
echo "Recuerda limpiar y reconstruir tu proyecto después de cambiar los iconos."