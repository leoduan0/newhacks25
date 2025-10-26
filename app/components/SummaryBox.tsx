import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  totalSpent: number
  totalPurchases: number
}

export const SummaryBox = ({ totalSpent, totalPurchases }: Props) => {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryText}>Total spent: ${totalSpent}</Text>
      <Text style={styles.summaryText}>Purchases: {totalPurchases}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  summaryBox: {
    position: 'absolute',
    bottom: 20,
    left: 35,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    minWidth: 400,
    minHeight: 200,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center', // centers vertically
    alignItems: 'center', // centers horizontally
  },
  summaryText: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 6,
    textAlign: 'center', // ensures multiline text is centered
  },
})
