import React from 'react';
import { Image, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import awsmobile from '../aws-exports'

//import ItemTab
import { ItemTab, ItemDetail, SearchConditionModal } from './screens/item'

//import FavoriteTab
import { FavoriteTab, FavoriteItemDetail } from './screens/favorite'

//import CartTab
import { CartTab, CartItemDetail, ConfirmPage, ThankYouPage } from './screens/cart'

//import ConsultTab
import { ConsultTab } from './screens/consult'

//import ProfileTab
import { ProfileConfirmPage, ProfileEditPage } from './screens/profile'

//import Authentication Page
import {
  Signin,
  Signup,
  SignupConfirmation,
  ResetPassword,
  ForgotPassword,
  DefaultApp
} from './auth'

import Credit from './screens/Credit'

import { PayjpCore } from 'payjp-react-native'

//aws接続設定
Amplify.configure(awsmobile);

PayjpCore.init({ publicKey: "pk_test_8e84ad899db7afe528aa5b42" })
  .then(() => console.log('payjp init ok'))
  .catch(e => console.warn('payjp init error', e))

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

const CreditTabStack = createStackNavigator(
  {
    Credit: {screen: Credit}
  }
)

//Tab
export const Tab = createBottomTabNavigator(
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
    },
    '決済': {
      screen: CreditTabStack,
    }
  },
  {
    tabBarOptions: {
      activeTintColor: '#7389D9',
      inactiveTintColor: 'silver'
    }
  }
);

//drawer
const Drawer = createDrawerNavigator(
  {
    'ホーム': {
      screen: Tab,
      navigationOptions: {
        drawerIcon: <Icon name='home' size={24} color='white' style={{ left: wp('5%') }} />
      }
    },
    '登録情報を編集': {
      screen: ProfileStack,
      navigationOptions: {
        drawerIcon: <Icon name='account-circle' size={24}  color='white' style={{ left: wp('5%') }} />,
      }
    }
  },
  {
    contentComponent: (props) => (
      <View style={{ flex: 1, backgroundColor: '#7389D9' }}>
        <Image source={require('../assets/pretapo-white.png')} style={styles.drawerImage} />
          <DrawerItems {...props} activeTintColor='white' inactiveTintColor='white'/>
          <View style={styles.logoutView}>
            <Icon name="logout" size={24} color={'white'} />
            <Text
              style={styles.logoutText}
              onPress={() => Auth.signOut()}
            >
              ログアウト
            </Text>
          </View>
      </View>
    ),
    initialRouteName: "ホーム",
    edgeWidth: wp('100%'),
    drawerWidth: wp('60%')
  }
)

//登録後画面
const Container = (props) => {
  console.log(props.authState)
  const AppContainer = createAppContainer(Drawer)
  if(props.authState !== 'signedIn') {
    return null
  } else {
    return(
      <SafeAreaView style={{ flex: 1, width: wp("100%") }}>
        <AppContainer />
      </SafeAreaView>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySignin: false
    }
  }

  toggleDisplaySignin = () => {
    this.setState({ displaySignin: !this.state.displaySignin })
  }

  render() {
    const { displaySignin } = this.state
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Authenticator hideDefault={true}>
            <DefaultApp
              displaySignin={displaySignin}
              toggleDisplaySignin={this.toggleDisplaySignin}
            />
            <Signin
              displaySignin={displaySignin}
              toggleDisplaySignin={this.toggleDisplaySignin}
            />
            <Signup
              displaySignin={displaySignin}
              toggleDisplaySignin={this.toggleDisplaySignin}
            />
            <SignupConfirmation />
            <Container />
            <ForgotPassword />
            <ResetPassword />
          </Authenticator>
        </SafeAreaView>
      )
    }
}

export default App;

const styles = StyleSheet.create({
  logoutView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('30%'),
    position: 'absolute',
    bottom: hp('5%'),
    marginLeft: wp('15%')
  },
  logoutText: {
    marginLeft: wp('2%'),
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  },
  drawerImage: {
    width: wp('25%'),
    height: hp('5%'),
    marginLeft: wp('17.5%'),
    marginTop: hp('10%'),
    marginBottom: hp('2%'),
    resizeMode: 'contain'
  }
})