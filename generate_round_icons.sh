#!/bin/bash

# Script mejorado para generar iconos redondos de la aplicación
# Requiere ImageMagick instalado: sudo apt install imagemagick

SOURCE_IMAGE="src/assets/images/savelook.png"

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: No se encuentra la imagen fuente $SOURCE_IMAGE"
    exit 1
fi

echo "Generando iconos redondos para Android..."

# Función para crear icono redondo con padding
create_round_icon() {
    local size=$1
    local output=$2
    
    # Crear un icono con padding del 20% para que se vea bien en círculo
    local inner_size=$((size * 80 / 100))
    
    # Crear canvas transparente del tamaño final
    convert -size ${size}x${size} xc:transparent \
        \( "$SOURCE_IMAGE" -resize ${inner_size}x${inner_size} \) \
        -gravity center -composite \
        "$output"
}

# Android - iconos redondos con padding apropiado
create_round_icon 48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
create_round_icon 72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
create_round_icon 96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
create_round_icon 144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
create_round_icon 192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

# También actualizar los iconos normales con el mismo padding
create_round_icon 48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
create_round_icon 72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
create_round_icon 96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
create_round_icon 144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
create_round_icon 192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

echo "¡Iconos redondos generados exitosamente!"
echo "Los iconos ahora tienen padding apropiado para verse bien en formato circular."
echo "Recuerda limpiar y reconstruir tu proyecto: cd android && ./gradlew clean"