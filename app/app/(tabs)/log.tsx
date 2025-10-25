import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
];

export default function Log() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockLogs[0] }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    };

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
          <LinearGradient
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
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f7', paddingTop: 40, paddingHorizontal: 12 },
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
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
});




// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from './App';

// type LogScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Log'
// >;

// // Mock data
// const mockLogs = [
//   {
//     id: '1',
//     store: 'BMO Store',
//     vendor: 'BMO Vendor',
//     phone: '123-456-7890',
//     date: '2025-10-25',
//     total: 42.5,
//     items: [
//       { name: 'Milk', price: 3.5 },
//       { name: 'Bread', price: 2.0 },
//     ],
//   },
//   {
//     id: '2',
//     store: 'SuperMart',
//     vendor: 'Super Vendor',
//     phone: '987-654-3210',
//     date: '2025-10-24',
//     total: 30.0,
//     items: [
//       { name: 'Eggs', price: 5.0 },
//       { name: 'Apples', price: 4.5 },
//     ],
//   },
// ];

// export default function Log() {
//   const navigation = useNavigation<LogScreenNavigationProp>();

//   const renderItem = ({ item }: { item: typeof mockLogs[0] }) => {
//     const scale = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
//     };
//     const onPressOut = () => {
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
//     };

//     return (
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() =>
//             navigation.navigate('TransactionDetail', { transaction: item })
//           }
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           style={styles.cardWrapper}
//         >
//           <LinearGradient
//             colors={['#4ca1af', '#c4e0e5']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradientCard}
//           >
//             <View style={styles.row}>
//               <View style={styles.storeIcon}>
//                 <MaterialCommunityIcons name="store" size={24} color="#fff" />
//               </View>
//               <Text style={styles.store}>{item.store}</Text>
//               <Text style={styles.total}>${item.total.toFixed(2)}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.phone}>{item.phone}</Text>
//               <Text style={styles.date}>{item.date}</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockLogs}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#eef2f7', paddingTop: 40, paddingHorizontal: 12 },
//   cardWrapper: {
//     marginBottom: 15,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 5 },
//     shadowRadius: 7,
//     elevation: 4,
//   },
//   gradientCard: {
//     borderRadius: 15,
//     padding: 18,
//   },
//   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
//   storeIcon: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#2a9d8f',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   store: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
//   phone: { fontSize: 14, color: '#f0f0f0' },
//   date: { fontSize: 14, color: '#f0f0f0' },
//   total: { fontSize: 16, fontWeight: '600', color: '#e9c46a' },
// });








// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// // Mock data
// const mockLogs = [
//   {
//     id: '1',
//     store: 'BMO Store',
//     vendor: 'BMO Vendor',
//     phone: '123-456-7890',
//     date: '2025-10-25',
//     total: 42.5,
//     items: [
//       { name: 'Milk', price: 3.5 },
//       { name: 'Bread', price: 2.0 },
//     ],
//   },
//   {
//     id: '2',
//     store: 'SuperMart',
//     vendor: 'Super Vendor',
//     phone: '987-654-3210',
//     date: '2025-10-24',
//     total: 30.0,
//     items: [
//       { name: 'Eggs', price: 5.0 },
//       { name: 'Apples', price: 4.5 },
//     ],
//   },
// ];

// export default function Log() {
//   const navigation = useNavigation();

//   const renderItem = ({ item }: { item: typeof mockLogs[0] }) => {
//     const scale = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
//     };
//     const onPressOut = () => {
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
//     };

//     return (
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           style={styles.cardWrapper}
//         >
//           <LinearGradient
//             colors={['#4ca1af', '#c4e0e5']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradientCard}
//           >
//             <View style={styles.row}>
//               <View style={styles.storeIcon}>
//                 <MaterialCommunityIcons name="store" size={24} color="#fff" />
//               </View>
//               <Text style={styles.store}>{item.store}</Text>
//               <Text style={styles.total}>${item.total.toFixed(2)}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.phone}>{item.phone}</Text>
//               <Text style={styles.date}>{item.date}</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockLogs}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#eef2f7', paddingTop: 40, paddingHorizontal: 12 },
//   cardWrapper: { marginBottom: 15, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 5 }, shadowRadius: 7, elevation: 4 },
//   gradientCard: { borderRadius: 15, padding: 18 },
//   row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
//   storeIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#2a9d8f', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
//   store: { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
//   phone: { fontSize: 14, color: '#f0f0f0' },
//   date: { fontSize: 14, color: '#f0f0f0' },
//   total: { fontSize: 16, fontWeight: '600', color: '#e9c46a' },
// });







// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   Animated,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialCommunityIcons } from '@expo/vector-icons';

// // Mock data
// const mockLogs = [
//   {
//     id: '1',
//     store: 'BMO Store',
//     phone: '123-456-7890',
//     date: '2025-10-25',
//     total: 42.5,
//     items: [
//       { name: 'Milk', price: 3.5 },
//       { name: 'Bread', price: 2.0 },
//     ],
//   },
//   {
//     id: '2',
//     store: 'SuperMart',
//     phone: '987-654-3210',
//     date: '2025-10-24',
//     total: 30.0,
//     items: [
//       { name: 'Eggs', price: 5.0 },
//       { name: 'Apples', price: 4.5 },
//     ],
//   },
// ];

// export default function Log() {
//   const handlePress = (log: typeof mockLogs[0]) => {
//     Alert.alert(
//       `${log.store} - ${log.date}`,
//       `Phone: ${log.phone}\nTotal: $${log.total.toFixed(
//         2
//       )}\nItems:\n${log.items.map(i => `${i.name}: $${i.price.toFixed(2)}`).join('\n')}`
//     );
//   };

//   const renderItem = ({ item }: { item: typeof mockLogs[0] }) => {
//     const scale = new Animated.Value(1);

//     const onPressIn = () => {
//       Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
//     };
//     const onPressOut = () => {
//       Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
//     };

//     return (
//       <Animated.View style={{ transform: [{ scale }] }}>
//         <TouchableOpacity
//           activeOpacity={0.8}
//           onPress={() => handlePress(item)}
//           onPressIn={onPressIn}
//           onPressOut={onPressOut}
//           style={styles.cardWrapper}
//         >
//           <LinearGradient
//             colors={['#2074ceff', '#ffffffff']}
//             start={[0, 0]}
//             end={[1, 1]}
//             style={styles.gradientCard}
//           >
//             <View style={styles.row}>
//               <View style={styles.storeIcon}>
//                 <MaterialCommunityIcons name="store" size={24} color="#fff" />
//               </View>
//               <Text style={styles.store}>{item.store}</Text>
//               <Text style={styles.total}>${item.total.toFixed(2)}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.phone}>{item.phone}</Text>
//               <Text style={styles.date}>{item.date}</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockLogs}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
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
//   gradientCard: {
//     borderRadius: 15,
//     padding: 18,
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
//     backgroundColor: '#0c00ecff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   store: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fff',
//     flex: 1,
//   },
//   phone: {
//     fontSize: 14,
//     color: '#f0f0f0',
//   },
//   date: {
//     fontSize: 14,
//     color: '#3c942bff',
//   },
//   total: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1e8935ff', // subtle accent
//   },
// });






// import React from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// const mockLogs = [
//   {
//     id: '1',
//     store: 'BMO Store',
//     phone: '123-456-7890',
//     date: '2025-10-25',
//     total: 42.50,
//     items: [
//       { name: 'Milk', price: 3.5 },
//       { name: 'Bread', price: 2.0 },
//     ],
//   },
//   {
//     id: '2',
//     store: 'SuperMart',
//     phone: '987-654-3210',
//     date: '2025-10-24',
//     total: 30.0,
//     items: [
//       { name: 'Eggs', price: 5.0 },
//       { name: 'Apples', price: 4.5 },
//     ],
//   },
// ];

// export default function Log() {
//   const handlePress = (log: typeof mockLogs[0]) => {
//     Alert.alert(
//       `${log.store} - ${log.date}`,
//       `Phone: ${log.phone}\nTotal: $${log.total.toFixed(2)}\nItems:\n${log.items
//         .map(i => `${i.name}: $${i.price.toFixed(2)}`)
//         .join('\n')}`
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={mockLogs}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.card}
//             activeOpacity={0.8}
//             onPress={() => handlePress(item)}
//           >
//             <View style={styles.row}>
//               <Text style={styles.store}>{item.store}</Text>
//               <Text style={styles.total}>${item.total.toFixed(2)}</Text>
//             </View>
//             <View style={styles.row}>
//               <Text style={styles.phone}>{item.phone}</Text>
//               <Text style={styles.date}>{item.date}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#eef2f7', // soft light blue background
//     paddingTop: 40,
//     paddingHorizontal: 12,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 18,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 4,
//     borderLeftWidth: 6,
//     borderLeftColor: '#2a9d8f', // accent color for each card
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   store: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#264653', // dark blue
//   },
//   phone: {
//     fontSize: 14,
//     color: '#6c757d', // muted grey
//   },
//   date: {
//     fontSize: 14,
//     color: '#9ca3af', // lighter grey
//   },
//   total: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#e76f51', // subtle red accent
//   },
// });