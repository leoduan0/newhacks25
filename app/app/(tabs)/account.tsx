import { View, Text, StyleSheet, Image } from 'react-native'

export default function AccountPage() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://ui-avatars.com/api/?name=Demo+Cracy&background=1a73e8&color=fff',
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Demo Cracy</Text>
      <Text style={styles.email}>demo@example.com</Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Been a member since</Text>
        <Text style={styles.infoValue}>Yesterday</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  email: {
    color: '#666',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    width: '90%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoTitle: {
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    color: '#555',
  },
})
