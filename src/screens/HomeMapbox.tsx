import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
  StatusBar,
  useColorScheme,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@rnmapbox/maps';
import { useUser } from '../context/UserContext';
import { homeMapboxStyles as styles, getDynamicStyles } from '../styles/HomeMapboxStyles';
import { MAPBOX_ACCESS_TOKEN, API_BASE_URL } from '@env';
import defaultPerfil from '../assets/images/default-perfil.jpg';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

// Constantes para mejor mantenibilidad
const MAP_THEMES = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark'
};

const MAP_STYLES = {
  STREET: 'street',
  SATELLITE: 'satellite',
  OUTDOORS: 'outdoors'
};

// Estilos de mapa Apple Maps con soporte real para modo oscuro
const APPLE_MAP_STYLES = {
  light: 'mapbox://styles/mapbox/streets-v12', // Estilo claro tipo Apple Maps
  dark: 'mapbox://styles/mapbox/dark-v11', // Estilo oscuro con mejor contraste
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12'
};

const ANIMATION_DURATION = 300;
const DEFAULT_LOCATION = [-99.1332, 19.4326]; // CDMX como fallback

// Icono SVG minimalista para ubicación
const LocationIcon = ({ color = '#007AFF', size = 24 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{
      width: size * 0.5,
      height: size * 0.5,
      borderRadius: size * 0.25,
      backgroundColor: color,
      borderWidth: 2,
      borderColor: 'white'
    }} />
    <View style={{
      position: 'absolute',
      top: -size * 0.25,
      width: 2,
      height: size * 0.25,
      backgroundColor: color,
    }} />
  </View>
);

const HomeMapbox = () => {
  const navigation = useNavigation();
  const { user, clearUser } = useUser();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));
  const [mapTheme, setMapTheme] = useState(MAP_THEMES.SYSTEM);
  const [mapStyle, setMapStyle] = useState(MAP_STYLES.STREET);
  const [showTraffic, setShowTraffic] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = useMemo(() =>
    mapTheme === MAP_THEMES.SYSTEM ? colorScheme === 'dark' : mapTheme === MAP_THEMES.DARK,
    [mapTheme, colorScheme]
  );

  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  // Estilos dinámicos para el menú
  const dynamicStyles = useMemo(() => getDynamicStyles(isDark), [isDark]);

  // Check if user is logged in
  const checkUserSession = useCallback(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  // Permission handling
  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Ubicación',
            message: 'SaveLook necesita acceso a tu ubicación para mostrar tu posición en el mapa',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Permitir',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error solicitando permisos:', error);
        return false;
      }
    }
    return true; // iOS maneja permisos diferente
  }, []);

  // Location handling
  const getCurrentLocation = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la ubicación para usar esta función');
        return;
      }

      // Primero obtener ubicación rápida, luego precisa
      Geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const newLocation = [longitude, latitude];
          setLocation(newLocation);
        },
        (error) => {
          console.error('Error obteniendo ubicación rápida:', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 60000,
        }
      );

      // Luego obtener ubicación precisa
      setTimeout(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            const newLocation = [longitude, latitude];
            setLocation(newLocation);
          },
          (error) => {
            console.error('Error obteniendo ubicación precisa:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        );
      }, 1000);
    } catch (error) {
      console.error('Error en getCurrentLocation:', error);
    }
  }, [requestLocationPermission]);

  // Camera controls
  const goToMyLocation = useCallback(() => {
    if (cameraRef.current && location) {
      cameraRef.current.setCamera({
        centerCoordinate: location,
        zoomLevel: 16,
        pitch: is3D ? 45 : 0,
        heading: 0,
        animationDuration: 1000,
      });
    }
  }, [location, is3D]);

  const toggle3D = useCallback(() => {
    setIs3D(prev => {
      const newIs3D = !prev;
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          pitch: newIs3D ? 45 : 0,
          animationDuration: 800,
        });
      }
      return newIs3D;
    });
  }, []);



  // Menu animations
  const toggleMenu = useCallback(() => {
    const toValue = showMenu ? -300 : 0;

    Animated.timing(slideAnim, {
      toValue,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (showMenu) {
        setShowMenu(false);
      }
    });

    if (!showMenu) {
      setShowMenu(true);
    }
  }, [showMenu, slideAnim]);

  // Map style configuration - Con soporte real para modo oscuro
  const getMapStyleURL = useCallback(() => {
    // Para estilos que no son "street", usamos los estilos específicos
    if (mapStyle === MAP_STYLES.SATELLITE) {
      return APPLE_MAP_STYLES.satellite;
    }
    if (mapStyle === MAP_STYLES.OUTDOORS) {
      return APPLE_MAP_STYLES.outdoors;
    }
    
    // Para el estilo "street", cambiamos entre claro y oscuro según el tema
    return isDark ? APPLE_MAP_STYLES.dark : APPLE_MAP_STYLES.light;
  }, [isDark, mapStyle]);

  // Theme options configuration
  const themeOptions = useMemo(() => [
    { value: MAP_THEMES.SYSTEM, label: 'Sistema' },
    { value: MAP_THEMES.LIGHT, label: 'Claro' },
    { value: MAP_THEMES.DARK, label: 'Oscuro' }
  ], []);

  const styleOptions = useMemo(() => [
    { value: MAP_STYLES.STREET, label: 'Calles' },
    { value: MAP_STYLES.SATELLITE, label: 'Satélite' },
    { value: MAP_STYLES.OUTDOORS, label: 'Exterior' }
  ], []);

  // User display name
  const userDisplayName = useMemo(() => {
    if (!user) return 'Usuario';
    return `${user.nombre || ''} ${user.apellidos || ''}`.trim() || 'Usuario';
  }, [user]);

  // Initialize app
  useEffect(() => {
    checkUserSession();
    
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      getCurrentLocation();
    });
  }, [checkUserSession, getCurrentLocation]);

  // Loading state
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        {user?.imagen_look ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${user.imagen_look}` }}
            style={styles.profileImage}
            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            onLoad={() => console.log('Image loaded successfully')}
          />
        ) : (
          <Image
            source={defaultPerfil}
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>

      
      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={toggleMenu}
      >
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            onPress={toggleMenu}
            activeOpacity={1}
          />

          <Animated.View
            style={[
              dynamicStyles.menuContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            {/* User Profile Section */}
            <View style={dynamicStyles.userProfile}>
              <View style={styles.profileRow}>
                {user?.imagen_look ? (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${user.imagen_look}` }}
                    style={styles.menuProfileImage}
                    onError={(error) => console.log('Menu image load error:', error.nativeEvent.error)}
                    onLoad={() => console.log('Menu image loaded successfully')}
                  />
                ) : (
                  <Image
                    source={defaultPerfil}
                    style={styles.menuProfileImage}
                  />
                )}
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => navigation.navigate('PerfilScreen')}
                >
                  <View style={styles.editIconMinimal}>
                    <View style={styles.editIconLine1} />
                    <View style={styles.editIconLine2} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={dynamicStyles.userName} numberOfLines={1}>
                {userDisplayName}
              </Text>
              <Text style={dynamicStyles.userEmail} numberOfLines={1}>
                {user?.correo || 'Sin email'}
              </Text>
            </View>

            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={dynamicStyles.menuTitle}>Configuración</Text>
              <TouchableOpacity
                onPress={toggleMenu}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={dynamicStyles.closeMenuText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Map Theme Section */}
            <View style={styles.menuSection}>
              <Text style={dynamicStyles.sectionTitle}>Tema del mapa</Text>
              {themeOptions.map(theme => (
                <TouchableOpacity
                  key={theme.value}
                  style={[
                    dynamicStyles.menuOption,
                    mapTheme === theme.value && dynamicStyles.selectedOption
                  ]}
                  onPress={() => setMapTheme(theme.value)}
                >
                  <Text style={dynamicStyles.optionText}>
                    {theme.label}
                  </Text>
                  {mapTheme === theme.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Map Style Section */}
            <View style={styles.menuSection}>
              <Text style={dynamicStyles.sectionTitle}>Estilo del mapa</Text>
              {styleOptions.map(style => (
                <TouchableOpacity
                  key={style.value}
                  style={[
                    dynamicStyles.menuOption,
                    mapStyle === style.value && dynamicStyles.selectedOption
                  ]}
                  onPress={() => setMapStyle(style.value)}
                >
                  <Text style={dynamicStyles.optionText}>
                    {style.label}
                  </Text>
                  {mapStyle === style.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Traffic Section */}
            <View style={styles.menuSection}>
              <Text style={dynamicStyles.sectionTitle}>Tráfico</Text>
              <TouchableOpacity
                style={[
                  dynamicStyles.menuOption,
                  showTraffic && dynamicStyles.selectedOption
                ]}
                onPress={() => setShowTraffic(prev => !prev)}
              >
                <Text style={dynamicStyles.optionText}>
                  Mostrar tráfico
                </Text>
                {showTraffic && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Logout Section */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={dynamicStyles.menuOption}
                onPress={async () => {
                  await clearUser();
                  navigation.navigate('Login');
                }}
              >
                <Text style={[dynamicStyles.optionText, { color: '#FF3B30' }]}>
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Map Controls */}
      <View style={styles.controlsContainer}>
        {/* 2D/3D Toggle */}
        <TouchableOpacity
          style={[
            styles.controlButton, 
            styles.toggleButton,
            isDark && styles.controlButtonDark
          ]}
          onPress={toggle3D}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.controlButtonText,
            isDark && styles.controlButtonTextDark
          ]}>
            {is3D ? '3D' : '2D'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* Location Button - Bottom Right con icono minimalista */}
      <TouchableOpacity
        style={[
          styles.locationButton,
          isDark && styles.locationButtonDark
        ]}
        onPress={goToMyLocation}
        activeOpacity={0.7}
      >
        <LocationIcon color={isDark ? "#FFFFFF" : "#007AFF"} size={20} />
      </TouchableOpacity>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={getMapStyleURL()}
          compassEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={location}
            zoomLevel={16}
            pitch={is3D ? 45 : 0}
            heading={0}
            animationMode={'flyTo'}
          />



          {/* Apple Maps-like styling layers */}
          <MapboxGL.FillLayer
            id="water-color"
            sourceID="composite"
            sourceLayerID="water"
            style={{
              fillColor: isDark ? '#1a1a2e' : '#a8d8f0',
              fillOpacity: 0.8
            }}
          />

          <MapboxGL.FillLayer
            id="park-color"
            sourceID="composite"
            sourceLayerID="landuse"
            filter={['in', 'class', 'park', 'recreation_ground', 'grass']}
            style={{
              fillColor: isDark ? '#2d4a2b' : '#c8e6c9',
              fillOpacity: 0.7
            }}
          />

          <MapboxGL.LineLayer
            id="road-primary"
            sourceID="composite"
            sourceLayerID="road"
            filter={['in', 'class', 'primary', 'trunk']}
            style={{
              lineColor: isDark ? '#4a4a4a' : '#ffffff',
              lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 2, 18, 8],
              lineOpacity: 0.9
            }}
          />

          <MapboxGL.LineLayer
            id="road-secondary"
            sourceID="composite"
            sourceLayerID="road"
            filter={['in', 'class', 'secondary', 'tertiary']}
            style={{
              lineColor: isDark ? '#3a3a3a' : '#f8f8f8',
              lineWidth: ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 6],
              lineOpacity: 0.8
            }}
          />

          {/* 3D Buildings - Only when 3D mode */}
          {is3D && (
            <MapboxGL.FillExtrusionLayer
              id="3d-buildings"
              sourceID="composite"
              sourceLayerID="building"
              filter={['==', 'extrude', 'true']}
              minZoomLevel={14}
              style={{
                fillExtrusionColor: isDark ? '#8A8A8A' : '#E0E0E0',
                fillExtrusionHeight: ['interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'height']],
                fillExtrusionBase: ['get', 'min_height'],
                fillExtrusionOpacity: isDark ? 1.0 : 0.8
              }}
            />
          )}

          {/* Traffic Layer */}
          {showTraffic && (
            <MapboxGL.VectorSource
              id="mapbox-traffic"
              url="mapbox://mapbox.mapbox-traffic-v1"
            >
              <MapboxGL.LineLayer
                id="traffic"
                sourceID="mapbox-traffic"
                sourceLayerID="traffic"
                style={{
                  lineColor: [
                    'case',
                    ['==', ['get', 'congestion'], 'low'], '#4CAF50',
                    ['==', ['get', 'congestion'], 'moderate'], '#FF9800',
                    ['==', ['get', 'congestion'], 'heavy'], '#F44336',
                    ['==', ['get', 'congestion'], 'severe'], '#9C27B0',
                    '#2196F3'
                  ],
                  lineWidth: [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    10, 1,
                    18, 8
                  ],
                  lineOpacity: 0.8
                }}
              />
            </MapboxGL.VectorSource>
          )}

          {/* User Location Marker - Más pequeño y simple */}
          <MapboxGL.PointAnnotation
            id="userLocation"
            coordinate={location}
          >
            <View style={styles.smallMarker} />
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </View>
    </SafeAreaView>
  );
};

export default HomeMapbox;