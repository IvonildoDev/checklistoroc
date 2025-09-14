import React, { useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import ChecklistScreen from './screens/ChecklistScreen';
import RelatorioScreen from './screens/RelatorioScreen';
import LoginScreen from './screens/LoginScreen';
import SobreScreen from './screens/SobreScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function prepare() {
      // Simule carregamento de recursos, se necessário
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAppIsReady(true);
    }
    prepare();
  }, []);


  // Esconde a splash quando appIsReady e está na tela de login
  useEffect(() => {
    if (appIsReady && !isLogged) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, isLogged]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!isLogged) {
    return <LoginScreen onLogin={data => { setUserData(data); setIsLogged(true); }} />;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Tab.Navigator
        initialRouteName="Checklist"
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Checklist') {
              iconName = 'list-circle-outline';
            } else if (route.name === 'Relatório') {
              iconName = 'document-text-outline';
            } else if (route.name === 'Refazer') {
              iconName = 'refresh-circle-outline';
            } else if (route.name === 'Sobre') {
              iconName = 'information-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2a7ae4',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Checklist" component={ChecklistScreen} initialParams={{ userData }} />
        <Tab.Screen name="Relatório" component={RelatorioScreen} initialParams={{ userData }} />
        <Tab.Screen
          name="Refazer"
          options={{
            title: 'Refazer Checklist',
            tabBarLabel: 'Refazer Checklist',
          }}
          component={() => null}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              // Navega para o Checklist e reseta a pilha
              navigation.navigate('Checklist', { reset: true });
            },
          })}
        />
        <Tab.Screen
          name="Sobre"
          component={SobreScreen}
          options={{
            tabBarLabel: 'Sobre',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
