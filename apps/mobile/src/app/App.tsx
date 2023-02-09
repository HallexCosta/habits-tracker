/* eslint-disable jsx-a11y/accessible-emoji */
import '../lib/dayjs'
import React from 'react'
import { StatusBar } from 'react-native'
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter'

import { Loading } from '../components/Loading'
import { Routes } from '../routes'

export const App = () => {
  const [fontLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  })

  if (!fontLoaded) {
    return <Loading />
  }

  return (
    <>
      <Routes />

      <StatusBar barStyle="light-content" backgroundColor="#fff" translucent />
    </>
  )
}

export default App
