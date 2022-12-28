import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons'; 

import HomeNavigation from './components/Home'
import ListsNavigation from './components/Lists'
import CalendarNavigation from './components/Calendar'

const Tab = createBottomTabNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={() => ({
          tabBarStyle: {
            backgroundColor: '#0466C8',
          },
          tabBarActiveTintColor:'#002855',
          tabBarInactiveTintColor:'#023E7D'
      })}>
        <Tab.Screen name = "Home" options={{
          headerShown:false,
          unmountOnBlur:true,
          tabBarIcon: ({focused, color, size}) =>
          <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color}/>  ,
          }} >{()=><HomeNavigation/>}</Tab.Screen>
        <Tab.Screen name = "Lists" options={{
          headerShown:false,
          unmountOnBlur:true,
          tabBarIcon: ({focused, color, size}) =>
          <Ionicons name={focused ? 'list-circle' : 'list-circle-outline'} size={size} color={color}/>  ,
          }}>{()=><ListsNavigation/>}</Tab.Screen>
        <Tab.Screen name = "Calendar" options={{
          headerShown:false,
          unmountOnBlur:true,
          tabBarIcon: ({focused, color, size}) =>
          <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color}/>  ,
          }}>{()=><CalendarNavigation/>}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}


