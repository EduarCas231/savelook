import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native'
import { loginStyles as styles } from '../styles/LoginStyles'
import { API_BASE_URL } from '@env'

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
      const response = await fetch(`${API_BASE_URL}/get_users`)
      const data = await response.json()

      console.log("Usuarios encontrados:", data)

      // Buscar coincidencia exacta
      const usuario = data.find(
        u => u.correo === email && u.password === password
      )

      if (usuario) {
        console.log("Login exitoso:", usuario)
        navigation.navigate('HomeMapbox')
      } else {
        Alert.alert("Credenciales incorrectas", "Email o contraseña no coinciden")
      }

    } catch (error) {
      console.error("Error en login:", error)
      Alert.alert("Error", "No se pudo conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#0a0a0a' : '#f8fafc' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

            {/* Header Section - Más minimalista */}
            <View style={styles.header}>
              <View style={[
                styles.logoContainer,
                { 
                  backgroundColor: 'transparent',
                  marginBottom: 8
                }
              ]}>
                
              </View>
              <Text style={[
                styles.title,
                { 
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  fontSize: 28,
                  fontWeight: '300',
                  letterSpacing: -0.5
                }
              ]}>
                Bienvenido
              </Text>
              <Text style={[
                styles.subtitle,
                { 
                  color: isDark ? '#94a3b8' : '#64748b',
                  fontSize: 16,
                  marginTop: 8
                }
              ]}>
                Inicia sesión para continuar
              </Text>
            </View>

            {/* Form Section - Más limpio */}
            <View style={styles.formContainer}>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      borderWidth: 1.5,
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      fontSize: 16,
                      borderRadius: 12
                    }
                  ]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      color: isDark ? '#f1f5f9' : '#0f172a',
                      borderWidth: 1.5,
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      fontSize: 16,
                      borderRadius: 12
                    }
                  ]}
                  placeholder="Contraseña"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
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
                  { 
                    color: isDark ? '#60a5fa' : '#2563eb',
                    fontSize: 14,
                    fontWeight: '500'
                  }
                ]}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Login Button - Más elegante */}
              <TouchableOpacity
                style={[
                  styles.button,
                  isLoading && styles.buttonDisabled,
                  {
                    backgroundColor: isDark ? '#2563eb' : '#1d4ed8',
                    borderRadius: 12,
                    height: 56,
                    shadowColor: isDark ? '#2563eb' : '#1d4ed8',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <View style={styles.buttonContent}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={[styles.loadingDot, { backgroundColor: '#fff' }]} />
                      <View style={[styles.loadingDot, { backgroundColor: '#fff' }]} />
                      <View style={[styles.loadingDot, { backgroundColor: '#fff' }]} />
                    </View>
                  ) : (
                    <>
                      <Text style={[
                        styles.buttonText,
                        {
                          fontSize: 16,
                          fontWeight: '600',
                          letterSpacing: 0.5
                        }
                      ]}>
                        Ingresar
                      </Text>
                      <Text style={[
                        styles.buttonIcon,
                        {
                          fontSize: 20,
                          marginLeft: 8
                        }
                      ]}>
                        
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Register Link - Más sutil */}
              <View style={styles.registerContainer}>
                <Text style={[
                  styles.registerText,
                  { 
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: 15
                  }
                ]}>
                  ¿No tienes cuenta?
                </Text>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={[
                    styles.registerButtonText,
                    { 
                      color: isDark ? '#60a5fa' : '#2563eb',
                      fontSize: 15,
                      fontWeight: '600',
                      marginLeft: 6
                    }
                  ]}>
                    Regístrate
                  </Text>
                </TouchableOpacity>
              </View>

            </View>

            {/* Footer - Más discreto */}
            <View style={styles.footer}>
              <Text style={[
                styles.footerText,
                { 
                  color: isDark ? '#475569' : '#94a3b8',
                  fontSize: 13,
                  textAlign: 'center',
                  lineHeight: 18
                }
              ]}>
                Al ingresar aceptas nuestros{' '}
                <Text style={[
                  styles.footerLink,
                  { 
                    color: isDark ? '#60a5fa' : '#2563eb',
                    fontWeight: '500'
                  }
                ]}>
                  Términos y Condiciones
                </Text>
              </Text>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen