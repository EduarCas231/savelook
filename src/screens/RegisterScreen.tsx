import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  useColorScheme, 
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
  SafeAreaView
} from 'react-native'

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
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  
  const isDark = useColorScheme() === 'dark'

  // Animación de entrada
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // ✅ Enviar código de verificación al correo
  const enviarCodigo = async () => {
    if (!correo || !correo.includes('@')) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('https://savelook.duckdns.org:8443/send_verification_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo })
      })

      const result = await res.json()

      if (res.ok) {
        setCodigoEnviado(true)
        setShowCodeModal(true) // Mostrar modal obligatorio
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

  // ✅ Verificar código
  const verificarCodigo = async () => {
    if (!codigo) {
      Alert.alert('Código requerido', 'Por favor ingresa el código de verificación.')
      return
    }

    setIsLoading(true)
    try {
      // Aquí iría la verificación del código con el servidor
      // Por ahora simulamos una verificación exitosa
      setShowCodeModal(false)
      Alert.alert('✅ Código verificado', 'Tu correo ha sido verificado correctamente.')
    } catch (error) {
      Alert.alert('❌ Error', 'El código de verificación es incorrecto.')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Registrar usuario (solo si el código fue verificado)
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
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://savelook.duckdns.org:8443/up_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })

      const result = await response.json()
      console.log('Respuesta del servidor:', result)

      if (response.ok) {
        Alert.alert('✅ Registro exitoso', 'Usuario creado correctamente.', [ 
          { text: 'Aceptar', onPress: () => navigation.navigate('Login') },
        ])
      } else {
        Alert.alert('❌ Error', result.error || 'No se pudo registrar el usuario.')
      }

    } catch (error) {
      console.error('Error al conectar con la API:', error)
      Alert.alert('⚠️ Error de conexión', 'No se pudo conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
    borderColor: isDark ? '#404040' : '#e1e8ed',
    color: isDark ? '#ffffff' : '#000000',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#f8f9fa' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            
            {/* Header con padding superior */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: isDark ? '#ffffff' : '#2c3e50' }]}>
                Crear Cuenta
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? '#bbbbbb' : '#666666' }]}>
                Completa tus datos para registrarte
              </Text>
            </View>

            {/* Sección de Verificación */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#2c3e50' }]}>
                Verificación de Correo
              </Text>
              
              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Correo Electrónico"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity 
                style={[
                  styles.smallButton, 
                  isLoading && styles.buttonDisabled
                ]} 
                onPress={enviarCodigo}
                disabled={isLoading}
              >
                <Text style={styles.smallButtonText}>
                  {isLoading ? 'Enviando...' : (codigoEnviado ? 'Reenviar código' : 'Enviar código')}
                </Text>
              </TouchableOpacity>

              {codigoEnviado && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Código enviado</Text>
                </View>
              )}
            </View>

            {/* Sección de Información Personal */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#2c3e50' }]}>
                Información Personal
              </Text>

              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Contraseña"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput, inputStyle]}
                  placeholder="Nombre"
                  placeholderTextColor={isDark ? '#888888' : '#666666'}
                  value={nombre}
                  onChangeText={setNombre}
                />
                
                <TextInput
                  style={[styles.input, styles.halfInput, inputStyle]}
                  placeholder="Apellidos"
                  placeholderTextColor={isDark ? '#888888' : '#666666'}
                  value={apellidos}
                  onChangeText={setApellidos}
                />
              </View>

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.thirdInput, inputStyle]}
                  placeholder="Edad"
                  placeholderTextColor={isDark ? '#888888' : '#666666'}
                  value={edad}
                  onChangeText={setEdad}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[styles.input, styles.twoThirdInput, inputStyle]}
                  placeholder="Tipo de Sangre (ej: O+, A-, B+)"
                  placeholderTextColor={isDark ? '#888888' : '#666666'}
                  value={tipoSangre}
                  onChangeText={setTipoSangre}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Sección de Ubicación */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#2c3e50' }]}>
                Ubicación
              </Text>

              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Estado"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={estado}
                onChangeText={setEstado}
              />

              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Municipio"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={municipio}
                onChangeText={setMunicipio}
              />

              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Ciudad / Pueblo / Comunidad"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={ciudad}
                onChangeText={setCiudad}
              />
              
              <TextInput
                style={[styles.input, inputStyle]}
                placeholder="Código Postal"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={cp}
                onChangeText={setCp}
                keyboardType="numeric"
              />
            </View>

            {/* Botón de Registro con margen superior */}
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
            
            {/* Enlace para login con padding inferior */}
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Modal para código de verificación */}
        <Modal
          visible={showCodeModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            // No permitir cerrar el modal hasta verificar el código
            Alert.alert('Verificación requerida', 'Debes ingresar el código para continuar.')
          }}
        >
          <SafeAreaView style={styles.modalOverlay}>
            <View style={[styles.modalContent, { 
              backgroundColor: isDark ? '#2d2d2d' : '#ffffff' 
            }]}>
              <Text style={[styles.modalTitle, { 
                color: isDark ? '#ffffff' : '#2c3e50' 
              }]}>
                Verificación de Correo
              </Text>
              
              <Text style={[styles.modalText, { 
                color: isDark ? '#bbbbbb' : '#666666' 
              }]}>
                Hemos enviado un código de verificación a:
              </Text>
              
              <Text style={[styles.emailText, { 
                color: isDark ? '#4dabf7' : '#1971c2' 
              }]}>
                {correo}
              </Text>

              <TextInput
                style={[styles.modalInput, { 
                  backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
                  color: isDark ? '#ffffff' : '#000000',
                  borderColor: isDark ? '#404040' : '#e1e8ed'
                }]}
                placeholder="Ingresa el código de 6 dígitos"
                placeholderTextColor={isDark ? '#888888' : '#666666'}
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="numeric"
                maxLength={6}
                autoFocus={true}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.verifyButton]}
                  onPress={verificarCodigo}
                  disabled={isLoading}
                >
                  <Text style={styles.modalButtonText}>
                    {isLoading ? 'Verificando...' : 'Verificar Código'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.resendLink}
                onPress={enviarCodigo}
                disabled={isLoading}
              >
                <Text style={[styles.resendText, { 
                  color: isDark ? '#4dabf7' : '#1971c2' 
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

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20, // Reducido para Android
    paddingBottom: 40, // Espacio extra en la parte inferior
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 100, // Espacio adicional en el header
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  thirdInput: {
    width: '30%',
  },
  twoThirdInput: {
    width: '65%',
  },
  smallButton: {
    backgroundColor: '#1971c2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1971c2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  smallButtonText: { 
    color: 'white', 
    fontWeight: '600', 
    fontSize: 16 
  },
  verifiedBadge: {
    backgroundColor: '#40c057',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifiedText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2f9e44',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10, // Espacio antes del footer
    shadowColor: '#2f9e44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#868e96',
    shadowColor: '#868e96',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  footer: {
    marginTop: 'auto', // Empuja el footer hacia abajo
    paddingBottom: 30, // Espacio extra para botones de navegación de Android
  },
  linkButton: { 
    alignItems: 'center', 
    paddingVertical: 10,
  },
  linkText: { 
    color: '#1971c2', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#2f9e44',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
  },
})

export default RegisterScreen