import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Amplify from '@aws-amplify/core';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './aws-exports';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

//import screens
import Single1 from './screens/Single1';
import Single2 from './screens/Single2';
import Stack1 from './screens/Stack1';
import Stack2 from './screens/Stack2';
import Tab1 from './screens/Tab1';
import Tab2 from './screens/Tab2';

Amplify.configure(config);

//stack
const Stack = createStackNavigator(
  {
    Stack1: {screen: Stack1},
    Stack2: {screen: Stack2},
  },
  {
    initialRouteName: 'Stack1'
  }
);

//Tab
const Tab = createBottomTabNavigator(
  {
    Tab1: {
      screen: createStackNavigator({ Tab1: { screen: Tab1 } }),
      //Tabのアイコン(FontAwesomeから取得)
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='home' color={tintColor} />
      }
    },
    Tab2: {
      screen: createStackNavigator({ Tab2: { screen: Tab2 } }),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='cog' color={tintColor} />
      }
    }
  }
);

//drawer
const Drawer = createDrawerNavigator(
  {
    Stacks: {
      screen: Stack,
      //ハンバーガメニューのアイコン
      navigationOptions: {
        drawerIcon: <Icon name='check' size={24} />
      }
    },
    Tabs: {
      screen: Tab,
      navigationOptions: {
        drawerIcon: <Icon name='check' size={24} />
      }
    },
    Single1: {
      screen: createStackNavigator({
        Single1: { screen: Single1 }
      })
    },
    Single2: {
      screen: createStackNavigator({
        Single2: { screen: Single2 }
      })
    }
  },
  {
    initialRouteName: 'Tabs'
  }
)

class App extends React.Component {
    render() {
      const Layout = createAppContainer(Drawer);
      return (
        <Layout/>
      );
    }
}

export default withAuthenticator(App, { includeGreetings: true })
