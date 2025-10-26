import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native'

export default function TransactionDetail() {
  const params = useLocalSearchParams()
  // transaction is passed as a string, parse it
  const transaction = params.transaction
    ? JSON.parse(params.transaction as string)
    : null

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>No transaction data!</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {/* Store Info Card */}
      <View style={styles.card}>
        <Text style={styles.header}>{transaction.store}</Text>
        <Text style={styles.subHeader}>Vendor: {transaction.vendor}</Text>
        <Text style={styles.subHeader}>Phone: {transaction.phone}</Text>
        <Text style={styles.subHeader}>Date: {transaction.date}</Text>
        <Text style={styles.total}>Total: ${transaction.total.toFixed(2)}</Text>
      </View>

      {/* Items Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Items Purchased</Text>
        <FlatList
          data={transaction.items}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#264653',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 4,
    color: '#4a5568',
  },
  total: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    color: '#e76f51',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2a9d8f',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 16,
    color: '#264653',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e76f51',
  },
})

// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// export default function TransactionDetail() {
//   const params = useLocalSearchParams();
//   // transaction is passed as a string, parse it
//   const transaction = params.transaction ? JSON.parse(params.transaction as string) : null;

//   if (!transaction) {
//     return (
//       <View style={styles.container}>
//         <Text>No transaction data!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.store}>{transaction.store}</Text>
//       <Text style={styles.vendor}>Vendor: {transaction.vendor}</Text>
//       <Text style={styles.phone}>Phone: {transaction.phone}</Text>
//       <Text style={styles.date}>Date: {transaction.date}</Text>
//       <Text style={styles.total}>Total: ${transaction.total.toFixed(2)}</Text>

//       <Text style={styles.itemsHeader}>Items:</Text>
//       <FlatList
//         data={transaction.items}
//         keyExtractor={(item, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.item}>
//             {item.name}: ${item.price.toFixed(2)}
//           </Text>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
//   store: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
//   vendor: { fontSize: 18, marginBottom: 6 },
//   phone: { fontSize: 16, marginBottom: 6 },
//   date: { fontSize: 16, marginBottom: 6 },
//   total: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#e76f51' },
//   itemsHeader: { fontSize: 18, fontWeight: '600', marginTop: 8 },
//   item: { fontSize: 16, marginLeft: 8 },
// });

// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';

// export default function TransactionDetail({ route }: any) {
//   const { transaction } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.store}>{transaction.store}</Text>
//       <Text style={styles.vendor}>Vendor: {transaction.vendor}</Text>
//       <Text style={styles.phone}>Phone: {transaction.phone}</Text>
//       <Text style={styles.date}>Date: {transaction.date}</Text>
//       <Text style={styles.total}>Total: ${transaction.total.toFixed(2)}</Text>

//       <Text style={styles.itemsHeader}>Items:</Text>
//       <FlatList
//         data={transaction.items}
//         keyExtractor={(item, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.item}>
//             {item.name}: ${item.price.toFixed(2)}
//           </Text>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
//   store: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
//   vendor: { fontSize: 18, marginBottom: 6 },
//   phone: { fontSize: 16, marginBottom: 6 },
//   date: { fontSize: 16, marginBottom: 6 },
//   total: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#e76f51' },
//   itemsHeader: { fontSize: 18, fontWeight: '600', marginTop: 8 },
//   item: { fontSize: 16, marginLeft: 8 },
// });

// import React from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';

// export default function TransactionDetail({ route }: any) {
//   const { transaction } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.store}>{transaction.store}</Text>
//       <Text style={styles.vendor}>Vendor: {transaction.vendor}</Text>
//       <Text style={styles.phone}>Phone: {transaction.phone}</Text>
//       <Text style={styles.date}>Date: {transaction.date}</Text>
//       <Text style={styles.total}>Total: ${transaction.total.toFixed(2)}</Text>

//       <Text style={styles.itemsHeader}>Items:</Text>
//       <FlatList
//         data={transaction.items}
//         keyExtractor={(item, idx) => idx.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.item}>
//             {item.name}: ${item.price.toFixed(2)}
//           </Text>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
//   store: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
//   vendor: { fontSize: 18, marginBottom: 6 },
//   phone: { fontSize: 16, marginBottom: 6 },
//   date: { fontSize: 16, marginBottom: 6 },
//   total: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#e76f51' },
//   itemsHeader: { fontSize: 18, fontWeight: '600', marginTop: 8 },
//   item: { fontSize: 16, marginLeft: 8 },
// });
