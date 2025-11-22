import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const homeMapboxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  
  // Menu Button
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 50,
    left: 10,
    zIndex: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  defaultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultAvatarText: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  // Controls Container - Solo para el botón 2D/3D
  controlsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 60,
    right: 15,
    zIndex: 10,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOpacity: 0.4,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  controlButtonTextDark: {
    color: '#FFFFFF',
  },

  // Location Button - Inferior Derecha
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 7,
  },
  locationButtonDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  locationIcon: {
    fontSize: 24,
  },

  // Menu Styles - Base (se sobrescriben dinámicamente)
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuBackdrop: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: Math.min(width * 0.8, 300),
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  
  // User Profile in Menu
  userProfile: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  menuProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  menuDefaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuDefaultAvatarText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  editIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  editIconMinimal: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  editIconLine1: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    top: 2,
    left: 2,
    transform: [{ rotate: '45deg' }],
  },
  editIconLine2: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    backgroundColor: '#FFFFFF',
    bottom: 0,
    left: 0,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Menu Header
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeMenuText: {
    fontSize: 20,
    fontWeight: '300',
  },

  // Menu Sections
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    // Se define dinámicamente
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },

  // Small Marker - Punto de ubicación más pequeño
  smallMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

// Estilos dinámicos para modo oscuro/claro
export const getDynamicStyles = (isDark) => ({
  menuContainer: {
    ...homeMapboxStyles.menuContainer,
    backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
  },
  userName: {
    ...homeMapboxStyles.userName,
    color: isDark ? '#FFFFFF' : '#000000',
  },
  userEmail: {
    ...homeMapboxStyles.userEmail,
    color: isDark ? '#8E8E93' : '#666666',
  },
  menuTitle: {
    ...homeMapboxStyles.menuTitle,
    color: isDark ? '#FFFFFF' : '#000000',
  },
  closeMenuText: {
    ...homeMapboxStyles.closeMenuText,
    color: isDark ? '#8E8E93' : '#666666',
  },
  sectionTitle: {
    ...homeMapboxStyles.sectionTitle,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  menuOption: {
    ...homeMapboxStyles.menuOption,
    backgroundColor: 'transparent',
  },
  selectedOption: {
    ...homeMapboxStyles.selectedOption,
    backgroundColor: isDark ? '#2C2C2E' : '#F0F8FF',
  },
  optionText: {
    ...homeMapboxStyles.optionText,
    color: isDark ? '#FFFFFF' : '#333333',
  },
  userProfile: {
    ...homeMapboxStyles.userProfile,
    borderBottomColor: isDark ? '#38383A' : '#F0F0F0',
  },
});

export default homeMapboxStyles;