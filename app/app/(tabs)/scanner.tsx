import { Ionicons } from '@expo/vector-icons'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function ScannerPage() {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  const [uploading, setUploading] = useState(false)
  const cameraRef = useRef<CameraView | null>(null)

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  async function takePictureAndUpload() {
    if (!cameraRef.current) return

    try {
      setUploading(true)
      const photo = await cameraRef.current.takePictureAsync({ base64: true })

      const response = await fetch(
        'https://newhacks25-as2x.onrender.com/scan',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: photo.base64 }),
        },
      )

      if (!response.ok) throw new Error('Upload failed')
      Alert.alert('✅ Success', 'Receipt uploaded successfully!')
    } catch (err) {
      console.error(err)
      Alert.alert('❌ Error', 'Failed to upload receipt.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <View style={styles.controls}>
        {/* Flip Camera */}
        <TouchableOpacity
          onPress={toggleCameraFacing}
          style={styles.iconButton}
        >
          <Ionicons name="camera-reverse-outline" size={36} color="white" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          onPress={takePictureAndUpload}
          style={styles.captureButton}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="camera-outline" size={40} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
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
    bottom: 60,
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
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
})
