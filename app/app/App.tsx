import Log from './(tabs)/log'
import TransactionDetail from './(tabs)/transactiondetails'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

export type RootStackParamList = {
  Log: undefined
  TransactionDetail: { transaction: any } // could type this more strictly
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Log">
        <Stack.Screen
          name="Log"
          component={Log}
          options={{ title: 'Transactions' }}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetail}
          options={{ title: 'Transaction Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Log from './log';
// import TransactionDetail from './transactiondetails';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Log">
//         <Stack.Screen name="Log" component={Log} options={{ title: 'Transactions' }} />
//         <Stack.Screen name="TransactionDetail" component={TransactionDetail} options={{ title: 'Transaction Details' }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
