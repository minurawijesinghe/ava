/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import RootNavigator from './Navigation'
const App = () => {
  return (
    <RootNavigator />
  );
};

const styles = StyleSheet.create({

});

export default App;
