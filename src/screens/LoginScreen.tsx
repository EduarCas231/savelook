import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native'

const { width, height } = Dimensions.get('window')

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))
  
  const isDark = useColorScheme() === 'dark'

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña')
      return
    }

    setIsLoading(true)
    try {
      // Simular proceso de login
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Login:', { email, password })
      // Aquí iría la llamada a tu API
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const gradientColors = isDark 
    ? ['#0c0c0c', '#1a1a1a', '#2d2d2d']
    : ['#ffffff', '#f8f9fa', '#e9ecef']

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0c0c0c' : '#ffffff' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.container,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            
            {/* Header Section */}
            <View style={styles.header}>
              <View style={[
                styles.logoContainer,
                { backgroundColor: isDark ? '#2d2d2d' : '#e3f2fd' }
              ]}>
                <Text style={[
                  styles.logoText,
                  { color: isDark ? '#4dabf7' : '#1971c2' }
                ]}>
                  🔐
                </Text>
              </View>
              <Text style={[
                styles.title, 
                { color: isDark ? '#ffffff' : '#1a1a1a' }
              ]}>
                Bienvenido
              </Text>
              <Text style={[
                styles.subtitle,
                { color: isDark ? '#bbbbbb' : '#666666' }
              ]}>
                Inicia sesión en tu cuenta
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[
                  styles.label,
                  { color: isDark ? '#e0e0e0' : '#555555' }
                ]}>
                  Correo Electrónico
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                      borderColor: isDark ? '#404040' : '#e0e0e0',
                      color: isDark ? '#ffffff' : '#000000',
                      shadowColor: isDark ? '#000' : '#e0e0e0'
                    }
                  ]}
                  placeholder="tu@email.com"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={[
                  styles.label,
                  { color: isDark ? '#e0e0e0' : '#555555' }
                ]}>
                  Contraseña
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                      borderColor: isDark ? '#404040' : '#e0e0e0',
                      color: isDark ? '#ffffff' : '#000000',
                      shadowColor: isDark ? '#000' : '#e0e0e0'
                    }
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? '#888888' : '#999999'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[
                  styles.forgotText,
                  { color: isDark ? '#4dabf7' : '#1971c2' }
                ]}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={[
                  styles.button,
                  isLoading && styles.buttonDisabled
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={[
                        styles.loadingDot,
                        { backgroundColor: isDark ? '#ffffff' : '#ffffff' }
                      ]} />
                      <View style={[
                        styles.loadingDot,
                        { backgroundColor: isDark ? '#ffffff' : '#ffffff' }
                      ]} />
                      <View style={[
                        styles.loadingDot,
                        { backgroundColor: isDark ? '#ffffff' : '#ffffff' }
                      ]} />
                    </View>
                  ) : (
                    <>
                      <Text style={styles.buttonText}>Ingresar</Text>
                      <Text style={styles.buttonIcon}>→</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#404040' : '#e0e0e0' }
                ]} />
                <Text style={[
                  styles.dividerText,
                  { color: isDark ? '#888888' : '#999999' }
                ]}>
                  o
                </Text>
                <View style={[
                  styles.divider,
                  { backgroundColor: isDark ? '#404040' : '#e0e0e0' }
                ]} />
              </View>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={[
                  styles.registerText,
                  { color: isDark ? '#bbbbbb' : '#666666' }
                ]}>
                  ¿No tienes cuenta?
                </Text>
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={[
                    styles.registerButtonText,
                    { color: isDark ? '#4dabf7' : '#1971c2' }
                  ]}>
                    Regístrate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[
                styles.footerText,
                { color: isDark ? '#666666' : '#999999' }
              ]}>
                Al ingresar aceptas nuestros{'\n'}
                <Text style={styles.footerLink}>Términos y Condiciones</Text>
              </Text>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 90,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    borderWidth: 2,
    padding: 18,
    borderRadius: 16,
    fontSize: 16,
    fontWeight: '500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1971c2',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#1971c2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 15,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 15,
    fontWeight: '500',
    marginRight: 5,
  },
  registerButton: {
    padding: 5,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    fontWeight: '600',
  },
})

export default LoginScreen