import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { VictoryPie } from 'victory-native'

type PieData = { x: string; y: number; purchases?: number }[]

export default function PieChart({ data }: { data: PieData }) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null)

  const hoveredData = hoveredSlice
    ? data.find((d) => d.x === hoveredSlice)
    : null

  const colorScale = ['#FF6384', '#36A2EB', '#2bd352ff', '#8A2BE2', '#FFA500']

  return (
    <View style={styles.rowContainer}>
      {/* Legend on the left */}
      <View style={styles.legendContainer}>
        {data.map((d, i) => (
          <View key={d.x} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: colorScale[i % colorScale.length] },
              ]}
            />
            <Text>{d.x}</Text>
          </View>
        ))}
      </View>

      {/* Pie chart in the center */}
      <VictoryPie
        data={data}
        width={300}
        height={300}
        innerRadius={0}
        colorScale={colorScale}
        labels={() => ''}
        events={[
          {
            target: 'data',
            eventHandlers: {
              onPressIn: (evt, clickedProps) => {
                setHoveredSlice(clickedProps.datum.x)
              },
              onMouseOver: (evt, hoveredProps) => {
                setHoveredSlice(hoveredProps.datum.x)
              },
              onMouseOut: () => {
                setHoveredSlice(null)
              },
            },
          },
        ]}
      />

      {/* Tooltip container always present */}
      <View style={styles.tooltipContainer}>
        {hoveredData ? (
          <>
            <Text style={styles.tooltipTitle}>{hoveredData.x}</Text>
            <Text>Total spent: ${hoveredData.y}</Text>
          </>
        ) : (
          // Empty placeholder text to keep size consistent
          <Text style={styles.placeholderText}>Hover to see details</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    marginRight: 20,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  tooltipContainer: {
    marginLeft: 20,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    minWidth: 150,
    minHeight: 60, // ensures box is always same size
    justifyContent: 'center',
  },
  tooltipTitle: { fontWeight: '700', marginBottom: 4 },
})
