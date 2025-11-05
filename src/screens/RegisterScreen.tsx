import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, useColorScheme } from 'react-native'

const RegisterScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [edad, setEdad] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [tipoSangre, setTipoSangre] = useState('')
  const isDark = useColorScheme() === 'dark'

  const handleRegister = () => {
    console.log('Registro:', { nombre, apellidos, edad, localidad, tipoSangre })
  }

  const inputStyle = {
    backgroundColor: isDark ? '#2d2d2d' : 'white',
    borderColor: isDark ? '#404040' : '#e1e8ed',
    color: isDark ? '#ffffff' : '#000000'
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa' }]}>
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#2c3e50' }]}>Crear Usuario</Text>
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Nombre"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={nombre}
        onChangeText={setNombre}
      />
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Apellidos"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={apellidos}
        onChangeText={setApellidos}
      />
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Edad"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Localidad"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={localidad}
        onChangeText={setLocalidad}
      />
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder="Tipo de Sangre (ej: O+, A-, B+)"
        placeholderTextColor={isDark ? '#888888' : '#666666'}
        value={tipoSangre}
        onChangeText={setTipoSangre}
        autoCapitalize="characters"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 60,
  },
  input: {
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#27ae60',
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
    marginBottom: 40,
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
})

export default RegisterScreen