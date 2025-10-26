import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// Mock data without hardcoded total
export const mockLogs = [
  {
    id: '1',
    store: 'BMO Store',
    category: 'Bank',
    date: '2025-10-25',
    items: [
      { name: 'Milk', price: 3.5 },
      { name: 'Bread', price: 2.0 },
    ],
  },
  {
    id: '2',
    store: 'SuperMart',
    category: 'Food',
    date: '2025-10-24',
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

    // calculate total dynamically
    const total = item.items.reduce((sum, i) => sum + i.price, 0)

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/transactiondetails',
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
  card: {
    borderRadius: 15,
    padding: 18,
    backgroundColor: '#111174ff', // solid nice color
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
  store: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  category: { fontSize: 14, color: '#f0f0f0', fontStyle: 'italic' },
  date: { fontSize: 14, color: '#54c747ff' },
  total: { fontSize: 16, fontWeight: '600', color: '#1cba40ff' },
})








// import { MaterialCommunityIcons } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import React from 'react'
// import {
//   Animated,
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native'

// // Mock data without hardcoded total
// const mockLogs = [
//   {
//     id: '1',
//     store: 'BMO Store',
//     category: 'Bank',
//     date: '2025-10-25',
//     items: [
//       { name: 'Milk', price: 3.5 },
//       { name: 'Bread', price: 2.0 },
//     ],
//   },
//   {
//     id: '2',
//     store: 'SuperMart',
//     category: 'Food',
//     date: '2025-10-24',
//     items: [
//       { name: 'Eggs', price: 5.0 },
//       { name: 'Apples', price: 4.5 },
//     ],
//   },
// ]


// export default function Log() {
//   const router = useRouter()

//   const RenderItem = React.memo(({ item }) => {
//     const scale = new Animated.Value(1)

//     const onPressIn = () => {
//       Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()
//     }
//     const onPressOut = () => {
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
//     }

//     // calculate total dynamically
//     const total = item.items.reduce((sum, i) => sum + i.price, 0)

//     return (
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() =>
//             router.push({
//               pathname: '/transactiondetails',
//               params: { transaction: JSON.stringify({ ...item, total }) },
//             })
//           }
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           style={styles.cardWrapper}
//         >
//           <View style={styles.card}>
//             <View style={styles.row}>
//               <View style={styles.storeIcon}>
//                 <MaterialCommunityIcons name="store" size={24} color="#fff" />
//               </View>
//               <Text style={styles.store}>{item.store}</Text>
//               <Text style={styles.total}>${total.toFixed(2)}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.category}>{item.category}</Text>
//               <Text style={styles.date}>{item.date}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
//     )
//   })

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockLogs}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => <RenderItem item={item} />}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eef2f7',
//     paddingTop: 40,
//     paddingHorizontal: 12,
//   },
//   cardWrapper: {
//     marginBottom: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 7,
//     elevation: 4,
//   },
//   card: {
//     borderRadius: 15,
//     padding: 18,
//     backgroundColor: '#111174ff', // solid nice color
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   storeIcon: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#1a1a1a',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   store: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
//   category: { fontSize: 14, color: '#f0f0f0', fontStyle: 'italic' },
//   date: { fontSize: 14, color: '#54c747ff' },
//   total: { fontSize: 16, fontWeight: '600', color: '#1cba40ff' },
// })
