import { Ionicons } from '@expo/vector-icons'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_IP!}/scan`

export default function ScannerPage() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [uploading, setUploading] = useState(false)
  const cameraRef = useRef<CameraView | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  async function fromLibrary() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
    })

    if (!result.canceled && result.assets[0].base64) {
      uploadImage(result.assets[0].base64)
    }
  }

  async function fromCamera() {
    if (!cameraRef.current) return

    const photo = await cameraRef.current.takePictureAsync({ base64: true })

    await uploadImage(photo.base64)
  }

  async function uploadImage(photo: string | undefined) {
    try {
      setUploading(true)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: photo }),
      })

      if (!response.ok) throw new Error('Upload failed')
      Alert.alert('✅ Success', 'Receipt uploaded successfully!')
    } catch (err) {
      console.error(err)
      Alert.alert('❌ Error', 'Failed to upload receipt.')
    } finally {
      setUploading(false)
    }
  }

  if (!permission) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant permission" />
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={styles.iconButton}
          >
            <Ionicons name="camera-reverse-outline" size={36} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={fromCamera}
            style={styles.captureButton}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="camera-outline" size={40} color="white" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={fromLibrary} style={styles.iconButton}>
            <Ionicons name="image-outline" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 90,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 50,
    padding: 12,
  },
  captureButton: {
    backgroundColor: '#007AFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
})
