import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { VictoryPie } from 'victory-native'

const API_URL = process.env.EXPO_PUBLIC_API_BASE_IP!

const CATEGORY_CONFIG = {
  ENTERTAINMENT: { name: 'Entertainment', color: '#FF6384' },
  DINING: { name: 'Food & Dining', color: '#36A2EB' },
  SHOPPING: { name: 'Shopping', color: '#FFA500' },
  TRANSPORTATION: { name: 'Transportation', color: '#8A2BE2' },
  GROCERIES: { name: 'Groceries', color: '#2bd352ff' },
  UTILITIES: { name: 'Utilities', color: '#FF7F50' },
  INVOICE: { name: 'Invoice', color: '#20B2AA' },
  MISC: { name: 'Other', color: '#FFD700' },
}

export default function HomeScreen() {
  const [periodType, setPeriodType] = useState('month')
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [periodType, offset])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${API_URL}/analytics/stats?period=${periodType}&offset=${offset}`,
      )

      if (!response.ok) throw new Error('Failed to fetch analytics')

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriodType(newPeriod)
    setOffset(0)
  }

  const handleNavigate = (direction) => {
    setOffset(offset + direction)
  }

  if (loading && !data) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAnalytics}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const chartData =
    data?.categories?.map((cat) => ({
      x: cat.name,
      y: cat.total,
      label: `${cat.percentage.toFixed(0)}%`,
    })) || []

  const colorScale =
    data?.categories?.map(
      (cat) => CATEGORY_CONFIG[cat.name]?.color || CATEGORY_CONFIG.MISC.color,
    ) || []

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending by Category</Text>
        </View>

        <View style={styles.chartContainer}>
          {chartData.length > 0 ? (
            <VictoryPie
              data={chartData}
              width={300}
              height={300}
              innerRadius={0}
              colorScale={colorScale}
              labelRadius={({ innerRadius }) => innerRadius + 40}
              style={{
                labels: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  fill: 'white',
                },
              }}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyText}>No data for this period</Text>
            </View>
          )}
        </View>

        <View style={styles.legendContainer}>
          {data?.categories?.map((cat, index) => (
            <View key={cat.name} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      CATEGORY_CONFIG[cat.name]?.color ||
                      CATEGORY_CONFIG.MISC.color,
                  },
                ]}
              />
              <Text style={styles.legendText}>
                {CATEGORY_CONFIG[cat.name]?.name || cat.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              periodType === 'week' && styles.filterButtonActive,
            ]}
            onPress={() => handlePeriodChange('week')}
          >
            <Text
              style={[
                styles.filterText,
                periodType === 'week' && styles.filterTextActive,
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              periodType === 'month' && styles.filterButtonActive,
            ]}
            onPress={() => handlePeriodChange('month')}
          >
            <Text
              style={[
                styles.filterText,
                periodType === 'month' && styles.filterTextActive,
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              periodType === 'year' && styles.filterButtonActive,
            ]}
            onPress={() => handlePeriodChange('year')}
          >
            <Text
              style={[
                styles.filterText,
                periodType === 'year' && styles.filterTextActive,
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>

        {/* Period Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => handleNavigate(-1)}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={styles.periodName}>{data?.period?.name}</Text>

          <TouchableOpacity
            style={[styles.navButton, offset >= 0 && styles.navButtonDisabled]}
            onPress={() => handleNavigate(1)}
            disabled={offset >= 0}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={offset >= 0 ? '#ccc' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          {/* Total Spent Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="wallet-outline" size={28} color="#FF9500" />
            </View>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>
              ${data?.summary?.total_spent?.toFixed(2) || '0.00'}
            </Text>
            <Text
              style={[
                styles.summaryChange,
                data?.changes?.spending_percent >= 0
                  ? styles.changePositive
                  : styles.changeNegative,
              ]}
            >
              {data?.changes?.spending_percent >= 0 ? '+' : ''}
              {data?.changes?.spending_percent?.toFixed(0)}% from last period
            </Text>
          </View>

          {/* Number of Purchases Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="cart-outline" size={28} color="#34C759" />
            </View>
            <Text style={styles.summaryLabel}>Number of Purchases</Text>
            <Text style={styles.summaryValue}>
              {data?.summary?.total_purchases || 0}
            </Text>
            <Text
              style={[
                styles.summaryChange,
                data?.changes?.purchases_count >= 0
                  ? styles.changePositive
                  : styles.changeNegative,
              ]}
            >
              {data?.changes?.purchases_count >= 0 ? '+' : ''}
              {data?.changes?.purchases_count || 0} from last period
            </Text>
          </View>

          {/* Average Purchase Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-up-outline" size={28} color="#007AFF" />
            </View>
            <Text style={styles.summaryLabel}>Average Purchase</Text>
            <Text style={styles.summaryValue}>
              ${data?.summary?.average_purchase?.toFixed(2) || '0.00'}
            </Text>
            <Text style={styles.summaryChange}>
              {data?.changes?.average_status || 'Stable'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
  },
  content: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  headerTotal: {
    fontSize: 18,
    color: '#666',
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyChart: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  legendContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonActive: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    padding: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  periodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summaryContainer: {
    gap: 16,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  summaryChange: {
    fontSize: 14,
    fontWeight: '500',
  },
  changePositive: {
    color: '#34C759',
  },
  changeNegative: {
    color: '#ff3b30',
  },
})
