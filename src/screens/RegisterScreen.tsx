import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  useColorScheme, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView,
  Image,
  PermissionsAndroid
} from 'react-native'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { registerScreenStyles as styles } from '../styles/RegisterScreenStyles'
import { API_BASE_URL } from '@env'

const RegisterScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('')
  const [codigo, setCodigo] = useState('')
  const [codigoEnviado, setCodigoEnviado] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [edad, setEdad] = useState('')
  const [estado, setEstado] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [cp, setCp] = useState('')
  const [tipoSangre, setTipoSangre] = useState('')
  const [descripcionLook, setDescripcionLook] = useState('')
  const [imagenLook, setImagenLook] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  
  const isDark = useColorScheme() === 'dark'

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const enviarCodigo = async () => {
    if (!correo || !correo.includes('@')) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/send_verification_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      })

      const result = await res.json()

      if (res.ok) {
        setCodigoEnviado(true)
        setShowCodeModal(true)
        Alert.alert('📧 Código enviado', 'Revisa tu correo para obtener el código de verificación.')
      } else {
        Alert.alert('❌ Error', result.error || 'No se pudo enviar el código.')
      }
    } catch (error) {
      Alert.alert('⚠️ Error de conexión', 'No se pudo conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const verificarCodigo = async () => {
    if (!codigo) {
      Alert.alert('Código requerido', 'Por favor ingresa el código de verificación.')
      return
    }

    setIsLoading(true)
    try {
      setShowCodeModal(false)
      Alert.alert('✅ Código verificado', 'Tu correo ha sido verificado correctamente.')
    } catch (error) {
      Alert.alert('❌ Error', 'El código de verificación es incorrecto.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!codigoEnviado) {
      Alert.alert('Verificación requerida', 'Debes verificar tu correo electrónico antes de registrarte.')
      return
    }

    if (!nombre || !apellidos || !edad || !estado || !password) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos obligatorios.')
      return
    }

    const usuario = {
      correo,
      password,
      codigo,
      nombre,
      apellidos,
      edad,
      estado,
      municipio,
      ciudad,
      cp,
      tipoSangre,
      descripcion_look: descripcionLook,
      imagen_look: imagenLook?.uri || null,
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/up_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })

      const result = await response.json()

      if (response.ok) {
        Alert.alert('✅ Registro exitoso', 'Usuario creado correctamente.', [ 
          { text: 'Aceptar', onPress: () => navigation.navigate('Login') },
        ])
      } else {
        Alert.alert('❌ Error', result.error || 'No se pudo registrar el usuario.')
      }

    } catch (error) {
      Alert.alert('⚠️ Error de conexión', 'No se pudo conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectImage = () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        { text: 'Cámara', onPress: () => openCamera() },
        { text: 'Galería', onPress: () => openGallery() },
        { text: 'Cancelar', style: 'cancel' }
      ]
    )
  }

  const openCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'La aplicación necesita acceso a la cámara para tomar fotos',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        )
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permiso denegado', 'Se necesita permiso de cámara para tomar fotos')
          return
        }
      } catch (err) {
        return
      }
    }

    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false,
        saveToPhotos: false
      },
      (response) => {
        if (response.didCancel) {
          console.log('Usuario canceló la cámara')
        } else if (response.errorMessage) {
          Alert.alert('Error', 'No se pudo abrir la cámara')
        } else if (response.assets && response.assets[0]) {
          setImagenLook(response.assets[0])
        }
      }
    )
  }

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        includeBase64: false
      },
      (response) => {
        if (response.didCancel) {
          console.log('Usuario canceló la galería')
        } else if (response.errorMessage) {
          Alert.alert('Error', 'No se pudo abrir la galería')
        } else if (response.assets && response.assets[0]) {
          setImagenLook(response.assets[0])
        }
      }
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f8fafc' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            
            {/* Header Minimalista */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={[
                  styles.logoIcon,
                  { color: isDark ? '#60a5fa' : '#2563eb' }
                ]}>
                  👤
                </Text>
              </View>
              <Text style={[
                styles.title,
                { color: isDark ? '#f8fafc' : '#0f172a' }
              ]}>
                Crear Cuenta
              </Text>
              <Text style={[
                styles.subtitle,
                { color: isDark ? '#94a3b8' : '#64748b' }
              ]}>
                Únete a nuestra comunidad
              </Text>
            </View>

            {/* Sección de Verificación - Más compacta */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[
                  styles.sectionTitle,
                  { color: isDark ? '#f1f5f9' : '#1e293b' }
                ]}>
                  Verificación
                </Text>
                {codigoEnviado && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Enviado</Text>
                  </View>
                )}
              </View>

              <View style={styles.emailContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      flex: 1
                    }
                  ]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={correo}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={[
                    styles.verificationButton,
                    isLoading && styles.buttonDisabled
                  ]} 
                  onPress={enviarCodigo}
                  disabled={isLoading}
                >
                  <Text style={styles.verificationButtonText}>
                    {isLoading ? '...' : (codigoEnviado ? 'Reenviar' : 'Enviar')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sección de Credenciales */}
            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                { color: isDark ? '#f1f5f9' : '#1e293b' }
              ]}>
                Credenciales
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }
                ]}
                placeholder="Contraseña"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Sección de Información Personal */}
            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                { color: isDark ? '#f1f5f9' : '#1e293b' }
              ]}>
                Información Personal
              </Text>

              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    styles.halfInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="Nombre"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={nombre}
                  onChangeText={setNombre}
                />
                
                <TextInput
                  style={[
                    styles.input,
                    styles.halfInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="Apellidos"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={apellidos}
                  onChangeText={setApellidos}
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    styles.thirdInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="Edad"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={edad}
                  onChangeText={setEdad}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[
                    styles.input,
                    styles.twoThirdInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="Tipo de sangre"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={tipoSangre}
                  onChangeText={setTipoSangre}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Sección de Ubicación */}
            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                { color: isDark ? '#f1f5f9' : '#1e293b' }
              ]}>
                Ubicación
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }
                ]}
                placeholder="Estado"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={estado}
                onChangeText={setEstado}
              />

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }
                ]}
                placeholder="Municipio"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={municipio}
                onChangeText={setMunicipio}
              />

              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    styles.twoThirdInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="Ciudad"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={ciudad}
                  onChangeText={setCiudad}
                />
                
                <TextInput
                  style={[
                    styles.input,
                    styles.thirdInput,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                    }
                  ]}
                  placeholder="CP"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={cp}
                  onChangeText={setCp}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Sección de Perfil */}
            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                { color: isDark ? '#f1f5f9' : '#1e293b' }
              ]}>
                Perfil
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#f1f5f9' : '#0f172a',
                  }
                ]}
                placeholder="Descripción personal (opcional)"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={descripcionLook}
                onChangeText={setDescripcionLook}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity 
                style={[
                  styles.imageButton,
                  {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                  }
                ]}
                onPress={selectImage}
              >
                {imagenLook ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: imagenLook.uri }} style={styles.selectedImage} />
                    <Text style={[
                      styles.imageButtonText,
                      { color: isDark ? '#60a5fa' : '#2563eb' }
                    ]}>
                      Cambiar imagen
                    </Text>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={[
                      styles.imagePlaceholderIcon,
                      { color: isDark ? '#64748b' : '#94a3b8' }
                    ]}>
                      
                    </Text>
                    <Text style={[
                      styles.imageButtonText,
                      { color: isDark ? '#94a3b8' : '#64748b' }
                    ]}>
                      Seleccionar imagen
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Botón de Registro */}
            <TouchableOpacity 
              style={[
                styles.button,
                (!codigoEnviado || isLoading) && styles.buttonDisabled
              ]} 
              onPress={handleRegister}
              disabled={!codigoEnviado || isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>
            
            {/* Enlace para login */}
            <View style={styles.footer}>
              <Text style={[
                styles.footerText,
                { color: isDark ? '#64748b' : '#94a3b8' }
              ]}>
                ¿Ya tienes cuenta?
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[
                  styles.footerLink,
                  { color: isDark ? '#60a5fa' : '#2563eb' }
                ]}>
                  Inicia sesión
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Modal para código de verificación - Mejorado */}
        <Modal
          visible={showCodeModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            Alert.alert('Verificación requerida', 'Debes ingresar el código para continuar.')
          }}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={[styles.modalContent, { 
              backgroundColor: isDark ? '#1e293b' : '#ffffff' 
            }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { 
                  color: isDark ? '#f1f5f9' : '#1e293b' 
                }]}>
                  Verificación
                </Text>
                <Text style={[styles.modalSubtitle, { 
                  color: isDark ? '#94a3b8' : '#64748b' 
                }]}>
                  Ingresa el código enviado a:
                </Text>
                <Text style={[styles.emailText, { 
                  color: isDark ? '#60a5fa' : '#2563eb' 
                }]}>
                  {correo}
                </Text>
              </View>

              <TextInput
                style={[styles.modalInput, { 
                  backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  borderColor: isDark ? '#334155' : '#e2e8f0'
                }]}
                placeholder="Código de 6 dígitos"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="numeric"
                maxLength={6}
                autoFocus={true}
                textAlign="center"
              />

              <TouchableOpacity 
                style={[styles.modalButton, styles.verifyButton]}
                onPress={verificarCodigo}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>
                  {isLoading ? 'Verificando...' : 'Verificar Código'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.resendLink}
                onPress={enviarCodigo}
                disabled={isLoading}
              >
                <Text style={[styles.resendText, { 
                  color: isDark ? '#60a5fa' : '#2563eb' 
                }]}>
                  ¿No recibiste el código? Reenviar
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default RegisterScreen