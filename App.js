import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Amplify from '@aws-amplify/core';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './aws-exports';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

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
    Tab1: { screen: createStackNavigator({ Tab1: { screen: Tab1 } })},
    Tab2: { screen: createStackNavigator({ Tab2: { screen: Tab2 } })},
  }
);

//drawer
const Drawer = createDrawerNavigator(
  {
    Stacks: { screen: Stack },
    Tabs: { screen: Tab },
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
