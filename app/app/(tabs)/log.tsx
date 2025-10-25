import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockLogs = [
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
];

export default function Log() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockLogs[0] }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/transactiondetails',
            params: { transaction: JSON.stringify(item) },
          })
        }
      >
        <Text style={styles.store}>{item.store}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.total}>Total: ${item.items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}</Text>
      </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#eef2f7', padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  store: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  category: { fontSize: 16, marginBottom: 4 },
  date: { fontSize: 14, marginBottom: 4, color: '#555' },
  total: { fontSize: 16, fontWeight: '600', marginTop: 4, color: '#e76f51' },
});


