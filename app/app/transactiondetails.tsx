import { useLocalSearchParams, useNavigation } from 'expo-router'
import React, { useLayoutEffect } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

export default function TransactionDetail() {
  const params = useLocalSearchParams()
  const navigation = useNavigation()

  const transaction = params.transaction
    ? JSON.parse(params.transaction as string)
    : null

  useLayoutEffect(() => {
    if (transaction?.store) {
      navigation.setOptions({ title: transaction.store })
    } else {
      navigation.setOptions({ title: 'Transaction Details' })
    }
  }, [navigation, transaction])

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>No transaction data!</Text>
      </View>
    )
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          {/* Store Info Card */}
          <View style={styles.card}>
            <Text style={styles.header}>{transaction.store}</Text>
            {transaction.address && (
              <Text style={styles.subHeader}>
                Address: {transaction.address}
              </Text>
            )}
            {transaction.phone && (
              <Text style={styles.subHeader}>Phone: {transaction.phone}</Text>
            )}
            <Text style={styles.subHeader}>
              Date: {new Date(transaction.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.total}>
              Total: ${Number(transaction.total).toFixed(2)}
            </Text>
          </View>

          <Text style={styles.cardTitle}>Items Purchased</Text>
        </View>
      }
      data={transaction.items || []}
      keyExtractor={(item, idx) => idx.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            ${Number(item.cost ?? 0).toFixed(2)}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No items found</Text>}
      contentContainerStyle={{ padding: 16 }}
    />
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
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
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
