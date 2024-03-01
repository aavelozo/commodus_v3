/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, useColorScheme,  StatusBar } from 'react-native';
import { NavigationContainer,DefaultTheme, DarkTheme  } from '@react-navigation/native'
import Stack from './src/views/screens/navigation/Stack';
import { ThemeProvider, createTheme } from '@rneui/themed';
import {RealmProvider, useRealm, useObject, useQuery} from '@realm/react';
import Users from './src/database/models/Users';
import Vehicles from './src/database/models/Vehicles';
import Expenses from './src/database/models/Expenses';
import Models from './src/database/models/Models';
import Brands from './src/database/models/Brands';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  const scheme = useColorScheme();
  const theme = createTheme();

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex:1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const realmConfig : Realm.Configuration = {
    schemaVersion: 3,
    schema: [Users,Brands,Models,Vehicles,Expenses]
  };  
  

  return (
    <RealmProvider {...realmConfig} fallback={() => null}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView style={backgroundStyle}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme }>
              <Stack />
            </NavigationContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemeProvider>
    </RealmProvider>
  );
}


export default App;
