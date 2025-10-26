import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  selectedRange: string
  onSelectRange: (range: string) => void
}

export const TimeFilters = ({ selectedRange, onSelectRange }: Props) => {
  const ranges = ['1 week', '1 month', '3 months']

  return (
    <View style={styles.container}>
      {ranges.map((r) => (
        <TouchableOpacity
          key={r}
          style={[styles.button, selectedRange === r && styles.selectedButton]}
          onPress={() => onSelectRange(r)}
        >
          <Text
            style={[styles.text, selectedRange === r && styles.selectedText]}
          >
            {r}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: '#1a73e8',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
  },
})
