import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Image } from 'react-native'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isDark = useColorScheme() === 'dark'

  const handleLogin = () => {
    console.log('Login:', { email, password })
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#2c3e50' }]}>Iniciar Sesión</Text>
      <TextInput
        style={[styles.input, { 
          backgroundColor: isDark ? '#2d2d2d' : 'white',
          borderColor: isDark ? '#404040' : '#e1e8ed',
          color: isDark ? '#ffffff' : '#000000'
        }]}
        placeholder="Email"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: isDark ? '#2d2d2d' : 'white',
          borderColor: isDark ? '#404040' : '#e1e8ed',
          color: isDark ? '#ffffff' : '#000000'
        }]}
        placeholder="Contraseña"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 50,
  },
  input: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default LoginScreen