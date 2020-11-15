import React from 'react';
import { Image, View, Text, SafeAreaView } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import {
  withAuthenticator, VerifyContact } from 'aws-amplify-react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import awsmobile from './aws-exports'

//import ItemTab
import ItemTab from './screens/ItemTab';
import SearchConditionModal from './screens/item/search/SearchConditionModal'
import ItemDetail from './screens/item/ItemDetail'

//import FavoriteTab
import FavoriteTab from './screens/FavoriteTab'
import FavoriteItemDetail from './screens/favorite/FavoriteItemDetail'

//import CartTab
import CartTab from './screens/CartTab'
import CartItemDetail from './screens/cart/CartItemDetail'
import ConfirmPage from "./screens/cart/ConfirmPage"
import ThankYouPage from './screens/cart/ThankYouPage'

//import ConsultTab
import ConsultTab from './screens/ConsultTab'

//import ProfileTab
import ProfileConfirmPage from './screens/ProfileConfirmPage'
import ProfileEditPage from './screens/ProfileEditPage'

//import Authentication Page
import Signin from './Signin'
import Signup from './Signup'
import SignupConfirmation from './SignupConfirmation'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

//aws接続設定
Amplify.configure(awsmobile);

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

const CartTabStack = createStackNavigator(
  {
    CartTab: {screen: CartTab},
    ConfirmPage: {screen: ConfirmPage},
    CartItemDetail: {screen: CartItemDetail},
    ThankYouPage: {screen: ThankYouPage}
  },
  {
    initialRouteName: 'CartTab'
  }
)

const FavoriteTabStack = createStackNavigator(
  {
    FavoriteTab: {screen: FavoriteTab},
    FavoriteItemDetail: {screen: FavoriteItemDetail}
  },
  {
    initialRouteName: 'FavoriteTab'
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
    ProfileConfirmPage: {screen: ProfileConfirmPage},
    ProfileEditPage: {screen: ProfileEditPage},
  },
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
      screen: FavoriteTabStack,
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
    'ホーム': {
      screen: Tab,
      navigationOptions: {
        drawerIcon: <Icon name='home' size={24} color='white' />
      }
    },
    '登録情報を編集': {
      screen: ProfileStack,
      navigationOptions: {
        drawerIcon: <Icon name='account-circle' size={24}  color='white'/>,
      }
    }
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1, backgroundColor: '#7389D9' }}>
        <Image source={require('./assets/pretapo-white.png')} style={{ width: wp('25%'), height: hp('15%'), marginLeft: wp('20%'), marginTop: hp('5%'), marginBottom: -hp('2%'), resizeMode: 'contain' }} />
          <DrawerItems {...props} activeTintColor='white' inactiveTintColor='white'/>
          <Text style={{ position: 'absolute', bottom: hp('4%') }}>
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

//TODO: UI画面デザイン修正, SignUp時にUserデータをDynamoに同期させるようにAuthenticatorをカスタム(時間がかかるので放置します)
class App extends React.Component {

  render() {
    const Layout = createAppContainer(Drawer);
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Layout />
        </SafeAreaView>
      )
    }
}

export default withAuthenticator(App, false,
  [
    <Signin />,
    <Signup />,
    <SignupConfirmation />,
    <ForgotPassword />,
    <ResetPassword />,
    <VerifyContact />,
  ]
)
