import EventResultSearchComponent from './src/components/event/EventSearchResultComponent';
import OrderCheckoutComponent from './src/components/order/OrderCheckoutComponent';
import EventDetailComponent from './src/components/event/EventDetailComponent'
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import NFCComponent from './src/components/nfc/NFCReaderWriterComponent';
import ProfileComponent from './src/components/profile/ProfileComponent';
import SignInComponent from './src/components/auth/SignInComponent';
import OrderComponent from './src/components/order/OrderComponent';
import LoginComponent from './src/components/auth/LoginComponent';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SideBar from './src/commons/HeaderComponent';
import Home from './src/components/HomeComponent';
import { StyleSheet, View } from 'react-native';
import React, { Component } from 'react';

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routerName } = navigation.state;

  let IconComponent = Ionicons;
  let iconName;

  if (routerName === 'Inicio') {
      iconName = `ios-home`;
  } else if (routerName === 'Meus Cupons') {
      iconName = 'md-card';
  } else if (routerName === 'Profile'){
      iconName = 'md-camera';
  }

  return <IconComponent name={iconName} size={25} color={tintColor} />;
}

const DrawerNavigator = createStackNavigator({
  Profile:{
      screen: ProfileComponent,
      navigationOptions:{
          header:null
      }
  }
});

const AuthNavigator = createStackNavigator({
  Login : { 
      screen: LoginComponent,
      navigationOptions:{
          headerTitle: "Login",
          header: null
      }
  },
  SignIn : { 
      screen: SignInComponent,
      headerShown: false,
      navigationOptions:{
          headerTitle: "Cadastrar",
          header: null
      }
  }
});

const OrderNavigator = createStackNavigator({
  Order: {
      screen: OrderComponent,
      navigationOptions:{
          headerTitle: 'Meus Cupons',
      }
  }
});

const NfcNavigator = createStackNavigator({
  NFC: {
      screen: NFCComponent,
      navigationOptions: {
          headerTitle: 'Leitura NFC',
      }
  }
});

const HomeNavigator = createStackNavigator({
  Home:{ 
      screen: Home,
      navigationOptions:{
          headerTitle: 'Tela Inicial',
          header: null
      }
   },
  EventDetail:{ 
      screen: EventDetailComponent,
      navigationOptions:{
          headerTitle: "Detalhes do Evento",
          header: null
      }
  },
  OrderCheckout: { 
      screen: OrderCheckoutComponent,
      navigationOptions:{
          headerTitle: "Ordens",
          header: null
      }
  },
  EventResult: { 
      screen: EventResultSearchComponent,
      navigationOptions: {
          headerTitle: "Pesquisar por eventos",
          header: null
      }
  }
});


const MainNavigator = createBottomTabNavigator({
  'Inicio': { 
      screen: HomeNavigator,
      navigationOptions: {
          tabBarLabel: 'Inicio',
      },
  },
  'Meus Cupons': { 
      screen: OrderNavigator,
      navigationOptions: {
          tabBarLabel: 'Meus Cupons'
      }
  },
  'NFC': {
      screen: NfcNavigator,
      navigationOptions: {
          tabBarLabel:'NFC'
      }
  }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
      
  }),
  tabBarOptions: {
      activeTintColor: '#ff4081',
      inactiveTintColor: 'gray',
  },
});

const drawerNavigator = createDrawerNavigator({
  "Tela Inicial": MainNavigator,
  "Meu Perfil": DrawerNavigator,
  "Logar": { screen: LoginComponent },
  },
  {
      contentComponent: SideBar
});

const AppModalStack = createStackNavigator(
  {
    App: drawerNavigator,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppNavigator = createSwitchNavigator({
  Menus: {
    screen: MainNavigator,
  },
  App: {
    screen: AppModalStack,
  },
  Auth: {
      screen: AuthNavigator,
  }
});

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {

  async componentDidMount() {
      await Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      });
  }

  render() {
      return (
          
          <View style={styles.bottomBar}>
              <AppContainer />
          </View>
      );
  }
}

const styles = StyleSheet.create({
    bottomBar: {
        flex: 1
    },
    icon: {
        color: '#ff4081',
        fontWeight: 'bold',
        fontSize: 24,
    }
})