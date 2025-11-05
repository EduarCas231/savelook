#!/bin/bash

SOURCE_IMAGE="src/assets/images/savelook.png"

# Función para crear icono redondo sin fondo blanco
create_clean_round_icon() {
    local size=$1
    local output=$2
    
    # Eliminar fondo blanco y crear icono con fondo transparente
    convert "$SOURCE_IMAGE" \
        -fuzz 10% -transparent white \
        -resize ${size}x${size} \
        -background transparent \
        -gravity center \
        -extent ${size}x${size} \
        "$output"
}

echo "Generando iconos redondos sin fondo blanco..."

# Android - iconos sin fondo blanco
create_clean_round_icon 48 android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png
create_clean_round_icon 72 android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png
create_clean_round_icon 96 android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png
create_clean_round_icon 144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png
create_clean_round_icon 192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png

create_clean_round_icon 48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
create_clean_round_icon 72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
create_clean_round_icon 96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
create_clean_round_icon 144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
create_clean_round_icon 192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png

echo "¡Iconos sin fondo blanco generados!"