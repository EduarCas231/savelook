import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { UserProvider } from './src/context/UserContext'
import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import HomeMapbox from './src/screens/HomeMapbox'
import PerfilScreen from './src/screens/PerfilScreen'


const Stack = createStackNavigator()

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="HomeMapbox" component={HomeMapbox} />
          <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
}

export default App