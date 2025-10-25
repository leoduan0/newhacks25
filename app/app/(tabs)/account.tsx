import { supabase } from '../../utils/supabase'
import { useEffect, useState } from 'react'
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native'

export default function Account() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
    else setUser(null)
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>You are not signed in.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account</Text>
      <Text style={styles.label}>ID: {user.id}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Sign Out" onPress={handleSignOut} color="#FF3B30" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
})
