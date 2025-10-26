import React, { useState } from 'react';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

type Props = {
  logs: Transaction[];
  categories: string[];
};

export const CategoryTransactionsWeb = ({ logs, categories }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Filter logs for selected category and sort by most recent
  const recentTransactions = logs
    .filter((t) => t.category === selectedCategory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Ensure we always show 5 rows
  const displayTransactions = Array.from({ length: 5 }, (_, i) => recentTransactions[i] || null);

  return (
    <div style={styles.container}>
      {/* Dropdown box */}
      <div style={styles.dropdownBox}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions box */}
      <div style={styles.transactionsBox}>
        <div style={styles.transactionsTitle}>
          Recent Transactions: {selectedCategory}
        </div>

        {displayTransactions.map((t, index) => (
          <div key={index} style={styles.transactionItem}>
            <span>{index + 1}.</span>
            <span>
              {t ? `${t.description} ($${t.amount.toFixed(2)})` : '(No more recents)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles (React CSSProperties)
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  dropdownBox: {
    width: 410,
    marginBottom: 4,
  },
  select: {
    width: '100%',
    padding: 8,
    borderRadius: 10,
    border: '1px solid #ccc',
    fontSize: 16,
  },
  transactionsBox: {
    width: 385,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  transactionsTitle: {
    fontWeight: 700,
    marginBottom: 8,
    textAlign: 'center',
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '3px 0',
    borderBottom: '1px solid #eee',
  },
};















// import { Picker } from '@react-native-picker/picker';
// import React, { useState } from 'react';
// import { FlatList, StyleSheet, Text, View } from 'react-native';

// type Transaction = {
//   id: string;
//   description: string;
//   amount: number;
//   date: string;
//   category: string;
// };

// type Props = {
//   logs: Transaction[];
//   categories: string[];
// };

// export const CategoryTransactions = ({ logs, categories }: Props) => {
//   const [selectedCategory, setSelectedCategory] = useState(categories[0]);

//   // Filter logs for selected category and get 5 most recent
//   const recentTransactions = logs
//     .filter((t) => t.category === selectedCategory)
//     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//     .slice(0, 5);

//   return (
//     <View style={styles.container}>
//       {/* Dropdown box */}
//       <View style={styles.dropdownBox}>
//         <Picker
//           selectedValue={selectedCategory}
//           onValueChange={(itemValue) => setSelectedCategory(itemValue)}
//         >
//           {categories.map((cat) => (
//             <Picker.Item key={cat} label={cat} value={cat} />
//           ))}
//         </Picker>
//       </View>

//       {/* Transaction list box */}
//       <View style={styles.transactionsBox}>
//         <Text style={styles.transactionsTitle}>
//           Recent Transactions: {selectedCategory}
//         </Text>
//         <FlatList
//           data={recentTransactions}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.transactionItem}>
//               <Text>{item.description}</Text>
//               <Text>${item.amount}</Text>
//             </View>
//           )}
//         />
//         {recentTransactions.length === 0 && (
//           <Text style={{ textAlign: 'center', marginTop: 10 }}>
//             No transactions
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     alignItems: 'flex-end',
//   },
//   dropdownBox: {
//     width: 200,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     marginBottom: 8,
//   },
//   transactionsBox: {
//     width: 250,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   transactionsTitle: {
//     fontWeight: '700',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//     borderBottomColor: '#eee',
//     borderBottomWidth: 1,
//   },
// });
