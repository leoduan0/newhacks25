import { CategoryTransactionsWeb } from '@/components/CategoryTransactions';
import PieChart from '@/components/PieChart';
import { SummaryBox } from '@/components/SummaryBox';
import { TimeFilters } from '@/components/TimeFilters';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { mockLogs } from './log'; // adjust path if needed

const allData = {
  '1 week': [
    { x: 'Food', y: 1000, purchases: 5 },
    { x: 'Bank', y: 500, purchases: 2 },
    { x: 'Entertainment', y: 150, purchases: 3 },
    { x: 'Fashion', y: 250, purchases: 4 },
    { x: 'Miscellaneuous', y: 150, purchases: 1 },
  ],
  '1 month': [
    { x: 'Food', y: 100, purchases: 2 },
    { x: 'Bank', y: 1500, purchases: 6 },
    { x: 'Entertainment', y: 150, purchases: 3 },
    { x: 'Fashion', y: 500, purchases: 5 },
    { x: 'Miscellaneuous', y: 150, purchases: 2 },
  ],
  '3 months': [
    { x: 'Food', y: 50, purchases: 1 },
    { x: 'Bank', y: 400, purchases: 3 },
    { x: 'Entertainment', y: 1150, purchases: 7 },
    { x: 'Fashion', y: 2000, purchases: 8 },
    { x: 'Miscellaneuous', y: 600, purchases: 4 },
  ],
};


const allLogs = mockLogs.map((log) => ({
  id: log.id,
  description: log.items.map((i) => i.name).join(', '), // concatenate item names
  amount: log.items.reduce((sum, i) => sum + i.price, 0),
  date: log.date,
  category: log.category,
}));


export default function HomeScreen() {
  const [range, setRange] = useState('1 week');
  const [chartData, setChartData] = useState(allData[range]);
  
  const totalSpent = chartData.reduce((sum, item) => sum + item.y, 0);
  const totalPurchases = chartData.reduce((sum, item) => sum + (item.purchases || 0), 0);

  useEffect(() => {
    setChartData(allData[range]);
  }, [range]);

  return (
    <View style={styles.container}>
      <PieChart data={chartData} />
      <TimeFilters selectedRange={range} onSelectRange={setRange} />

      {/* SummaryBox at bottom left */}
      <SummaryBox totalSpent={totalSpent} totalPurchases={totalPurchases} />
      <CategoryTransactionsWeb 
        logs={allLogs} 
        categories={['Food', 'Bank', 'Entertainment', 'Fashion', 'Miscellaneuous']} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
});
