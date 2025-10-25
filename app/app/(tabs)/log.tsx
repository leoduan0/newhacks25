import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'

const mockLogs = [
  {
    id: '1',
    store: 'BMO Store',
    vendor: 'BMO Vendor',
    phone: '123-456-7890',
    date: '2025-10-25',
    total: 42.5,
    items: [
      { name: 'Milk', price: 3.5 },
      { name: 'Bread', price: 2.0 },
    ],
  },
  {
    id: '2',
    store: 'SuperMart',
    vendor: 'Super Vendor',
    phone: '987-654-3210',
    date: '2025-10-24',
    total: 30.0,
    items: [
      { name: 'Eggs', price: 5.0 },
      { name: 'Apples', price: 4.5 },
    ],
  },
]

export default function Log() {
  const router = useRouter()

  const RenderItem = React.memo(({ item }) => {
    const scale = new Animated.Value(1)

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
    }
    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
    }

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/transactiondetails',
              params: { transaction: JSON.stringify(item) },
            })
          }
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.cardWrapper}
        >
          <View
            colors={['#4ca1af', '#f0f0f0ff']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientCard}
          >
            <View style={styles.row}>
              <View style={styles.storeIcon}>
                <MaterialCommunityIcons name="store" size={24} color="#fff" />
              </View>
              <Text style={styles.store}>{item.store}</Text>
              <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.phone}>{item.phone}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  })

  return (
    <View style={styles.container}>
      <FlatList
        data={mockLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RenderItem item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    paddingTop: 40,
    paddingHorizontal: 12,
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
  gradientCard: { borderRadius: 15, padding: 18 },
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
    backgroundColor: '#3f2a9dff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  store: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  phone: { fontSize: 14, color: '#f0f0f0' },
  date: { fontSize: 14, color: '#54c747ff' },
  total: { fontSize: 16, fontWeight: '600', color: '#1cba40ff' },
})
