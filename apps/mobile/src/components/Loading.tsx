import { View, ActivityIndicator } from 'react-native'

export function Loading() {
  return (
    <View style={{ 
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator color="royalblue" />
    </View>
  )
}
