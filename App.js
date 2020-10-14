import React from 'react';
import { StyleSheet, Button, SafeAreaView, View, Text } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
//aws-exportsを読み込めないので暫定的にコメントアウト
//import config from './aws-exports';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

//import screens
import ItemTab from './screens/ItemTab';
import CoordinateTab from './screens/CoordinateTab';
import BoxTab from './screens/BoxTab'
import FavoriteTab from './screens/FavoriteTab'
import ItemDetail from './screens/item/ItemDetail'
import SearchConditionModal from './screens/item/search/SearchConditionModal'


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

//ItemTabのstack
const ItemTabStack = createStackNavigator(
  {
    ItemTab: {screen: ItemTab},
    ItemDetail: {screen: ItemDetail},
    SearchConditionModal: {screen: SearchConditionModal}
  },
  {
    initialRouteName: 'ItemTab'
  }
);

//Tab
const Tab = createBottomTabNavigator(
  {
    'アイテム': {
      screen: ItemTabStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='tag' color={tintColor} />
      }
    },
    'コーデ': {
      screen: createStackNavigator({ CoordinateTab: { screen: CoordinateTab } }),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='user' color={tintColor} />
      }
    },
    'お気に入り': {
      screen: createStackNavigator({ FavoriteTab: { screen: FavoriteTab }}),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='heart' color={tintColor} />
      }
    },
    'ボックス': {
      screen: createStackNavigator({ BoxTab: { screen: BoxTab }}),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='shopping-cart' color={tintColor} />
      }
    }
  }
);

//drawer
const Drawer = createDrawerNavigator(
  {
    'ホーム': {
      screen: Tab,
      navigationOptions: {
        drawerIcon: <Icon name='home' size={24} />
      }
    }
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1, marginTop: 40 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...props} />
          <Text>
            <View style={{ paddingTop:10, width: 60, height: 47, alignItems: 'center'}}>
              <Icon name="sign-out" size={24} color={'#666'} />
            </View>
            <View style={{ width: 80, height: 47, justifyContent:'center'}}>
              <Text
                style={{ fontWeight: '700', color: '#111'}}
                onPress={() => Auth.signOut()}
              >ログアウト
              </Text>
            </View>
          </Text>
        </SafeAreaView>
      </View>
    ),
    initialRouteName: "ホーム"
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

export default withAuthenticator(App)
