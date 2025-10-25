import { Ionicons } from '@expo/vector-icons'; // for the back arrow icon
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TransactionDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const transaction = params.transaction
    ? JSON.parse(params.transaction as string)
    : null;

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>No transaction data!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' && (
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/log')}>
          <Ionicons name="arrow-back" size={22} color="#1a73e8" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.header}>{transaction.store}</Text>
        <Text style={styles.subHeader}>Category: {transaction.category}</Text>
        <Text style={styles.subHeader}>Date: {transaction.date}</Text>
        <Text style={styles.total}>
          Total: ${transaction.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Items Purchased</Text>
        <FlatList
          data={transaction.items}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

// Keep native back button support for iOS/Android
TransactionDetail.screenOptions = {
  title: 'Transaction Details',
  headerBackTitle: 'Back',
  headerTintColor: '#1a73e8',
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#1a73e8',
    marginLeft: 5,
    fontWeight: '500',
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
  header: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#264653' },
  subHeader: { fontSize: 16, marginBottom: 4, color: '#4a5568' },
  total: { fontSize: 18, fontWeight: '600', marginTop: 8, color: '#e76f51' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#2a9d8f' },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  itemName: { fontSize: 16, color: '#264653' },
  itemPrice: { fontSize: 16, fontWeight: '500', color: '#e76f51' },
});







// import { useLocalSearchParams } from 'expo-router';
// import { FlatList, StyleSheet, Text, View } from 'react-native';

// export default function TransactionDetail() {
//   const params = useLocalSearchParams();
//   const transaction = params.transaction
//     ? JSON.parse(params.transaction as string)
//     : null;

//   if (!transaction) {
//     return (
//       <View style={styles.container}>
//         <Text>No transaction data!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.header}>{transaction.store}</Text>
//         <Text style={styles.subHeader}>Category: {transaction.category}</Text>
//         <Text style={styles.subHeader}>Date: {transaction.date}</Text>
//         <Text style={styles.total}>
//           Total: ${transaction.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Items Purchased</Text>
//         <FlatList
//           data={transaction.items}
//           keyExtractor={(_, idx) => idx.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.itemRow}>
//               <Text style={styles.itemName}>{item.name}</Text>
//               <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// // Use screenOptions to get native back button in header
// TransactionDetail.screenOptions = {
//   title: 'Transaction Details',
//   headerBackTitle: 'Back', // native iOS back button text
//   headerTintColor: '#1a73e8', // back arrow color
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   header: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#264653' },
//   subHeader: { fontSize: 16, marginBottom: 4, color: '#4a5568' },
//   total: { fontSize: 18, fontWeight: '600', marginTop: 8, color: '#e76f51' },
//   cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#2a9d8f' },
//   itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0' },
//   itemName: { fontSize: 16, color: '#264653' },
//   itemPrice: { fontSize: 16, fontWeight: '500', color: '#e76f51' },
// });




