import React from 'react';
import { Image, StyleSheet, Button, SafeAreaView, View, Text } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator, AmplifyTheme, Authenticator, SignUp, SignIn } from 'aws-amplify-react-native';
//aws-exportsを読み込めないので暫定的にコメントアウト
//import config from './aws-exports';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API, graphqlOperation } from 'aws-amplify'
import * as gqlMutations from './src/graphql/mutations' // create, update, delete
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

//import screens
import ItemTab from './screens/ItemTab';
import CartTab from './screens/CartTab'
import FavoriteTab from './screens/FavoriteTab'
import ItemDetail from './screens/item/ItemDetail'
import SearchConditionModal from './screens/item/search/SearchConditionModal'
import ConfirmPage from "./screens/cart/ConfirmPage"
import CartItemDetail from './screens/cart/CartItemDetail'
import ConsultTab from './screens/ConsultTab'
import ProfilePage from './screens/ProfilePage'

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

//ItemTabのStack
const ItemTabStack = createStackNavigator(
  {
    ItemTab: {screen: ItemTab},
    ItemDetail: {screen: ItemDetail},
    SearchConditionModal: {screen: SearchConditionModal},
  },
  {
    initialRouteName: 'ItemTab'
  }
);

//CartTabのStack
const CartTabStack = createStackNavigator(
  {
    CartTab: {screen: CartTab},
    ConfirmPage: {screen: ConfirmPage},
    CartItemDetail: {screen: CartItemDetail},
  },
  {
    initialRouteName: 'CartTab'
  }
)

const ConsultTabStack = createStackNavigator(
  {
    ConsultTab: {screen: ConsultTab}
  },
  {
    initialRouteName: 'ConsultTab'
  }
)

const ProfileStack = createStackNavigator(
  {
    ProfileStack: {screen: ProfilePage}
  }
)

//Tab
const Tab = createBottomTabNavigator(
  {
    'アイテム': {
      screen: ItemTabStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='view-grid' color={tintColor} />
      }
    },
    'お気に入り': {
      screen: createStackNavigator({ FavoriteTab: { screen: FavoriteTab }}),
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='bookmark-minus' color={tintColor} />
      }
    },
    'カート': {
      screen: CartTabStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='cart' color={tintColor} />
      }
    },
    '相談': {
      screen: ConsultTabStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <Icon size={24} name='comment-multiple' color={tintColor} />
      }
    }
  }
);

//drawer
const Drawer = createDrawerNavigator(
  {
    '登録情報を編集': {
      screen: ProfileStack,
      navigationOptions: {
        drawerIcon: <Icon name='account-circle' size={24}  color='white'/>,
      }
    },
    'ホーム': { screen: Tab }
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1, backgroundColor: '#7389D9' }}>
        <Image source={require('./assets/logo.png')} style={{ width: wp('30%'), height: hp('20%'), marginLeft: wp('20%') }} />
          <DrawerItems {...props} activeTintColor='white' inactiveTintColor='white' activeBackgroundColor='black'/>
          <Text>
            <View style={{ paddingTop:10, width: 60, height: 47, alignItems: 'center'}}>
              <Icon name="logout" size={24} color={'white'} />
            </View>
            <View style={{ width: 80, height: 47, justifyContent:'center'}}>
              <Text
                style={{ fontWeight: '700', color: 'white'}}
                onPress={() => Auth.signOut()}
              >ログアウト
              </Text>
            </View>
          </Text>
      </View>
    ),
    initialRouteName: "ホーム",
  }
)

//ユーザープール作成後にはカスタム不可能みたい
const signUpConfig = {
  header: '新規登録',
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 2,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    }
  ]
}

const customTheme = {
  ...AmplifyTheme,
  button: { backgroundColor: 'red', height: 100 },
  signInButtonIcon: { display: "none" }
}

class CustomSignUp extends SignUp {
  signUp() {
    console.log('カスタムsignupです')
    const { username, password, email, phone_number } = this.inputs;
    Auth.signUp(username, password, email, phone_number)
    .then(() => this.changeState('confirmgSignUp', username))
    .catch(err => this.error(err));
  }
}

//TODO: UI画面デザイン修正, SignUp時にUserデータをDynamoに同期させるようにAuthenticatorをカスタム(時間がかかるので放置します)
class App extends React.Component {
  saveUserToDynamo = async () => {
    const user = await API.graphql(
      graphqlOperation(gqlMutations.createUser, {
        input: {

        }
      })
    )
  }

  render() {
    const Layout = createAppContainer(Drawer);
    return (
        <Layout/>
      )
    }
}

export default withAuthenticator(App)

/*
<Authenticator
theme={customeTheme}
onStateChange=signedUpの時にUserとCart作成可能?
>
<CustomeSignUp override={'SignUp'}
</Authenticator>
*/
