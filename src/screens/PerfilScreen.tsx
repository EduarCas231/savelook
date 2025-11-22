import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import { API_BASE_URL } from '@env';
import { useUser } from '../context/UserContext';
import defaultPerfil from '../assets/images/default-perfil.jpg';
import PerfilStyles from '../styles/PerfilStyle';

const PerfilScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { user, updateUser } = useUser();

  // Estados de la info del usuario
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [edad, setEdad] = useState(user?.edad?.toString() || '');
  const [estado, setEstado] = useState(user?.estado || '');
  const [municipio, setMunicipio] = useState(user?.municipio || '');
  const [ciudad, setCiudad] = useState(user?.ciudad || '');
  const [cp, setCp] = useState(user?.cp || '');
  const [tipoSangre, setTipoSangre] = useState(user?.tipoSangre || '');
  const [descripcionLook, setDescripcionLook] = useState(user?.descripcion_look || '');

  const [profileImage, setProfileImage] = useState(user?.imagen_look || null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // ---------------------------------------------
  // Seleccionar imagen del dispositivo
  // ---------------------------------------------
  const handleChoosePhoto = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true, // <-- esto envía base64 directo
      quality: 0.7,
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert('Error', 'No se pudo seleccionar la imagen');
        return;
      }

      const base64 = response.assets[0].base64;
      const uri = response.assets[0].uri;

      setProfileImage(uri);

      // Guardar la imagen en base64 en MongoDB
      await uploadProfileImage(base64);
    });
  };

  // ---------------------------------------------
  // Envío de imagen (base64 → imagen_look)
  // ---------------------------------------------
  const uploadProfileImage = async (base64Image) => {
    if (!user?.correo) return;

    setImageLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/update_user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: user.correo,
          imagen_look: base64Image,
        }),
      });

      if (!response.ok) throw new Error('Error al subir imagen');

      // Actualizar contexto global
      await updateUser({ imagen_look: base64Image });
      
      // Actualizar estado local para mostrar la nueva imagen
      setProfileImage(`data:image/jpeg;base64,${base64Image}`);

      Alert.alert('Éxito', 'Foto actualizada');
    } catch (err) {
      Alert.alert('Error', 'No se pudo actualizar la imagen');
    } finally {
      setImageLoading(false);
    }
  };

  // ---------------------------------------------
  // Guardar cambios del perfil
  // ---------------------------------------------
  const handleSave = async () => {
    if (!nombre.trim() || !apellidos.trim() || !edad.trim() || !estado.trim()) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum)) {
      Alert.alert('Error', 'Edad inválida');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/update_user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: user?.correo,
          nombre: nombre.trim(),
          apellidos: apellidos.trim(),
          edad: edadNum,
          estado: estado.trim(),
          municipio: municipio.trim(),
          ciudad: ciudad.trim(),
          cp: cp.trim(),
          tipoSangre: tipoSangre.trim().toUpperCase(),
          descripcion_look: descripcionLook.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'No se pudo actualizar');
        return;
      }

      // Actualizar contexto global
      await updateUser({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        edad: edadNum,
        estado: estado.trim(),
        municipio: municipio.trim(),
        ciudad: ciudad.trim(),
        cp: cp.trim(),
        tipoSangre: tipoSangre.trim().toUpperCase(),
        descripcion_look: descripcionLook.trim(),
      });

      Alert.alert('Éxito', 'Datos actualizados', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);

    } catch (err) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const currentStyles = PerfilStyles(isDark);

  return (
    <SafeAreaView style={currentStyles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={currentStyles.header}>
        <TouchableOpacity 
          style={currentStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={currentStyles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={currentStyles.title}>Editar Perfil</Text>
        <View style={currentStyles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={currentStyles.scrollContent}
        >
          <View style={currentStyles.content}>

            {/* Imagen */}
            <View style={currentStyles.profileImageContainer}>
              <View style={currentStyles.imageWrapper}>
                {profileImage ? (
                  <Image
                    source={{ 
                      uri: profileImage.startsWith('data:') 
                        ? profileImage 
                        : `data:image/jpeg;base64,${profileImage}` 
                    }}
                    style={currentStyles.profileImage}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                  />
                ) : (
                  <Image source={defaultPerfil} style={currentStyles.profileImage} />
                )}

                {imageLoading && (
                  <View style={currentStyles.imageLoader}>
                    <ActivityIndicator size="small" color="#007AFF" />
                  </View>
                )}

                <TouchableOpacity 
                  style={currentStyles.cameraButton}
                  onPress={handleChoosePhoto}
                >
                  <Text style={currentStyles.cameraIcon}>📷</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleChoosePhoto}>
                <Text style={currentStyles.changePhotoText}>
                  {profileImage ? 'Cambiar foto' : 'Agregar foto'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Información personal */}
            <View style={currentStyles.section}>
              <Text style={currentStyles.sectionTitle}>Información Personal</Text>

              <View style={currentStyles.row}>
                <View style={currentStyles.halfInputContainer}>
                  <Text style={currentStyles.label}>Nombre *</Text>
                  <TextInput
                    style={currentStyles.input}
                    value={nombre}
                    onChangeText={setNombre}
                  />
                </View>

                <View style={currentStyles.halfInputContainer}>
                  <Text style={currentStyles.label}>Apellidos *</Text>
                  <TextInput
                    style={currentStyles.input}
                    value={apellidos}
                    onChangeText={setApellidos}
                  />
                </View>
              </View>

              <View style={currentStyles.row}>
                <View style={currentStyles.thirdInputContainer}>
                  <Text style={currentStyles.label}>Edad *</Text>
                  <TextInput
                    style={currentStyles.input}
                    keyboardType="numeric"
                    value={edad}
                    onChangeText={setEdad}
                    maxLength={3}
                  />
                </View>

                <View style={currentStyles.twoThirdInputContainer}>
                  <Text style={currentStyles.label}>Tipo de sangre</Text>
                  <TextInput
                    style={currentStyles.input}
                    value={tipoSangre}
                    onChangeText={setTipoSangre}
                    autoCapitalize="characters"
                    maxLength={3}
                  />
                </View>
              </View>
            </View>

            {/* Ubicación */}
            <View style={currentStyles.section}>
              <Text style={currentStyles.sectionTitle}>Ubicación</Text>

              <View style={currentStyles.inputContainer}>
                <Text style={currentStyles.label}>Estado *</Text>
                <TextInput
                  style={currentStyles.input}
                  value={estado}
                  onChangeText={setEstado}
                />
              </View>

              <View style={currentStyles.inputContainer}>
                <Text style={currentStyles.label}>Municipio</Text>
                <TextInput
                  style={currentStyles.input}
                  value={municipio}
                  onChangeText={setMunicipio}
                />
              </View>

              <View style={currentStyles.row}>
                <View style={currentStyles.twoThirdInputContainer}>
                  <Text style={currentStyles.label}>Ciudad</Text>
                  <TextInput
                    style={currentStyles.input}
                    value={ciudad}
                    onChangeText={setCiudad}
                  />
                </View>

                <View style={currentStyles.thirdInputContainer}>
                  <Text style={currentStyles.label}>CP</Text>
                  <TextInput
                    style={currentStyles.input}
                    value={cp}
                    onChangeText={setCp}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
            </View>

            {/* Descripción */}
            <View style={currentStyles.section}>
              <Text style={currentStyles.sectionTitle}>Descripción Personal</Text>
              <TextInput
                style={currentStyles.textArea}
                value={descripcionLook}
                onChangeText={setDescripcionLook}
                multiline
              />
            </View>

            {/* Botón guardar */}
            <TouchableOpacity
              style={[
                currentStyles.saveButton,
                (loading || imageLoading) && { opacity: 0.6 }
              ]}
              onPress={handleSave}
              disabled={loading || imageLoading}
            >
              {(loading || imageLoading) ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={currentStyles.saveButtonText}>
                  {imageLoading ? 'Subiendo imagen...' : 'Guardar Cambios'}
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PerfilScreen;
