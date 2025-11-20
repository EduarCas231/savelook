import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  InteractionManager,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import { homeMapboxStyles as styles } from '../styles/HomeMapboxStyles';

MapboxGL.setAccessToken('pk.eyJ1IjoiZWR1YXJjYXMiLCJhIjoiY21pNmU0OXNuMHp2czJqbzU1a2EwajJ2NyJ9.AkkDvt6A5atxwXfoYCSXgw');



const HomeMapbox = () => {
  const [location, setLocation] = useState([-99.1332, 19.4326]);
  const [isReady, setIsReady] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  const getUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://savelook.duckdns.org:8443/get_users');
      const data = await response.json();
      setUser(data[0]);
    } catch (error) {
      console.error('Error cargando usuario:', error);
      Alert.alert('Error', 'No se pudo cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'SaveLook necesita acceso a tu ubicación',
          buttonNeutral: 'Preguntar después',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Permitir',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Error', 'Permiso de ubicación denegado');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const newLocation = [position.coords.longitude, position.coords.latitude];
        setLocation(newLocation);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }, [requestPermission]);

  const goToMyLocation = useCallback(() => {
    if (cameraRef.current && location) {
      cameraRef.current.setCamera({
        centerCoordinate: location,
        zoomLevel: 16,
        animationDuration: 1000,
      });
    }
  }, [location]);

  const toggleProfile = useCallback(() => {
    setShowProfile(prev => !prev);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      await getUserData();
      InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
        getCurrentLocation();
      });
    };
    
    initializeApp();
  }, [getUserData, getCurrentLocation]);

  if (!isReady) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Botón de perfil */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={toggleProfile}
        activeOpacity={0.8}
      >
        {user?.imagen_look ? (
          <Image source={{ uri: user.imagen_look }} style={styles.profileImage} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.defaultAvatarText}>👤</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Botón de ubicación */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={goToMyLocation}
        activeOpacity={0.8}
      >
        <Text style={styles.locationIcon}>📍</Text>
      </TouchableOpacity>

      {/* Modal de perfil */}
      <Modal
        visible={showProfile}
        transparent
        animationType="fade"
        onRequestClose={toggleProfile}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {user?.imagen_look ? (
              <Image source={{ uri: user.imagen_look }} style={styles.modalAvatar} />
            ) : (
              <View style={[styles.modalAvatar, styles.defaultModalAvatar]}>
                <Text style={styles.defaultModalAvatarText}>👤</Text>
              </View>
            )}
            
            <Text style={styles.userName}>{user?.nombre || 'Usuario' }</Text> <Text style={styles.userName}>{user?.apellidos || 'Apellidos' }</Text>
            <Text style={styles.userEmail}>{user?.correo || 'Sin email'}</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mapa */}
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={location}
          zoomLevel={14}
        />
        
        <MapboxGL.PointAnnotation
          id="userLocation"
          coordinate={location}
        >
          <View style={styles.marker} />
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
    </SafeAreaView>
  );
};



export default HomeMapbox;
