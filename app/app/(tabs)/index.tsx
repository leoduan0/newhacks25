import PieChart from '@/components/PieChart';
import { TimeFilters } from '@/components/TimeFilters';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const allData = {
  '1 week': [
    { x: 'Food', y: 200 },
    { x: 'Bank', y: 500 },
    { x: 'Entertainment', y: 150 },
  ],
  '1 month': [
    { x: 'Food', y: 800 },
    { x: 'Bank', y: 2000 },
    { x: 'Entertainment', y: 600 },
  ],
  '3 months': [
    { x: 'Food', y: 200 },
    { x: 'Bank', y: 6000 },
    { x: 'Entertainment', y: 100 },
  ],
};

export default function HomeScreen() {
  const [range, setRange] = useState('1 week');
  const [chartData, setChartData] = useState(allData[range]);

  useEffect(() => {
    setChartData(allData[range]);
  }, [range]);

  return (
    <View style={styles.container}>
      <PieChart data={chartData} />
      <TimeFilters selectedRange={range} onSelectRange={setRange} />
      {/* Other content like welcome messages can go here below */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#eef2f7' },
});



