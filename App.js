import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Amplify from '@aws-amplify/core';
import { withAuthenticator } from 'aws-amplify-react-native';
//aws-exportsを読み込めないので暫定的にコメントアウト
//import config from './aws-exports';
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
import ItemDetail from './screens/item/ItemDetail'
import SearchConditionModal from './screens/item/SearchConditionModal'

//aws-exportsを読み込めないので暫定的に直接記入
Amplify.configure({
    "aws_project_region": "ap-northeast-1",
    "aws_appsync_graphqlEndpoint": "https://lpysywb5rnamtdmuojjypxxkri.appsync-api.ap-northeast-1.amazonaws.com/graphql",
    "aws_appsync_region": "ap-northeast-1",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_cognito_identity_pool_id": "ap-northeast-1:62bd8c1c-2157-4e62-9cda-67ca440caa9a",
    "aws_cognito_region": "ap-northeast-1",
    "aws_user_pools_id": "ap-northeast-1_krUoox3yW",
    "aws_user_pools_web_client_id": "rruh53etit2lj1h760u11nfb",
    "oauth": {},
    //No credentials, applicationId or regionを回避
    Analytics: {
      disabled: true,
    }
});

//stack
const Stack = createStackNavigator(
  {
    Stack1: {screen: Stack1},
    Stack2: {screen: Stack2},
    ItemDetail: {screen: ItemDetail},
    SearchConditionModal: {screen: SearchConditionModal}
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
