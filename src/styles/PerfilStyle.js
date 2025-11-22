import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const PerfilStyles = (isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0A0A0A' : '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: height * 0.03,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#1A1A1A' : '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#000000',
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#000000',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: isDark ? '#1A1A1A' : '#F0F0F0',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? '#1A1A1A' : '#F0F0F0',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: isDark ? '#007AFF' : '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? '#0A0A0A' : '#FAFAFA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraIcon: {
    fontSize: 16,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  // Campos de solo lectura
  readOnlyField: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: isDark ? '#1A1A1A' : '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? '#2A2A2A' : '#E8E8E8',
  },
  readOnlyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#888888' : '#666666',
    marginBottom: 4,
  },
  readOnlyValue: {
    fontSize: 16,
    fontWeight: '400',
    color: isDark ? '#CCCCCC' : '#333333',
  },
  note: {
    padding: 12,
    backgroundColor: isDark ? '#1A2A3A' : '#E8F4FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  noteText: {
    fontSize: 13,
    color: isDark ? '#88C0FF' : '#0066CC',
    fontStyle: 'italic',
  },
  // Campos editables
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: isDark ? '#E0E0E0' : '#333333',
    letterSpacing: -0.2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: isDark ? '#2A2A2A' : '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#000000',
    fontWeight: '400',
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: isDark ? '#2A2A2A' : '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    color: isDark ? '#FFFFFF' : '#000000',
    fontWeight: '400',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  // Layout de filas
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  thirdInputContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  twoThirdInputContainer: {
    flex: 2,
    marginHorizontal: 6,
  },
  // Botón guardar
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: isDark ? '#2A2A2A' : '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

export default PerfilStyles;