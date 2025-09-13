


import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import ChecklistScreen from './screens/ChecklistScreen';
import RelatorioScreen from './screens/RelatorioScreen';
import LoginScreen from './screens/LoginScreen';

const Tab = createBottomTabNavigator();


export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);

  if (!isLogged) {
    return <LoginScreen onLogin={data => { setUserData(data); setIsLogged(true); }} />;
  }

  return (
    <NavigationContainer>
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}
