import { supabase } from '@/utils/supabase'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'

export default function Log() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('records')
        .select(
          `
          id,
          store,
          phone,
          purchase_date,
          items (
            name,
            cost
          )
        `,
        )
        .order('purchase_date', { ascending: false })
      if (error) throw error
      setTransactions(data || [])
    } catch (err) {
      console.error('Error refreshing transactions:', err)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('records')
          .select(
            `
            id,
            store,
            phone,
            purchase_date,
            items (
              name,
              cost
            )
          `,
          )
          .order('purchase_date', { ascending: false })

        if (error) throw error

        setTransactions(data || [])
      } catch (err) {
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const RenderItem = React.memo(({ item }) => {
    const scale = new Animated.Value(1)

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
    }
    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
    }

    const total = Array.isArray(item.items)
      ? item.items.reduce((sum: number, i: any) => sum + (i.cost ?? 0), 0) *
        1.13
      : 0

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/transaction_details',
              params: { transaction: JSON.stringify({ ...item, total }) },
            })
          }
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.cardWrapper}
        >
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.storeIcon}>
                <MaterialCommunityIcons name="store" size={24} color="#fff" />
              </View>
              <Text style={styles.store}>{item.store}</Text>
              <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.date}>
                {new Date(item.purchase_date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  })

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {transactions.map((item) => (
            <RenderItem key={item.id} item={item} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#eef2f7',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  cardWrapper: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 7,
    elevation: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  storeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  store: { fontSize: 18, fontWeight: '700', color: '#000', flex: 1 },
  category: { fontSize: 14, color: '#000', fontStyle: 'italic' },
  date: { fontSize: 14, color: '#54c747ff' },
  total: { fontSize: 16, fontWeight: '600', color: '#1cba40ff' },
})
