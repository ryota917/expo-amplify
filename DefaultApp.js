import React from 'react';
import { Image, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

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

export default class DefaultApp extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const ItemTabStack = createStackNavigator(
            {
                ItemTab: {screen: ItemTab},
                ItemDetail: {screen: ItemDetail},
                SearchConditionModal: {screen: SearchConditionModal},
            },
            {
                initialRouteName: 'ItemTab',
            }
        );

        const CartTabStack = createStackNavigator(
            {
                CartTab: {
                    screen: CartTab,
                    params: { onStateChangeSignup: () => this.props.onStateChange('signUp')}
                },
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
                FavoriteTab: {
                    screen: FavoriteTab,
                    params: { onStateChangeSignup: () => this.props.onStateChange('signUp')}
                },
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
            },
            {
                tabBarOptions: {
                    activeTintColor: '#7389D9',
                    inactiveTintColor: 'silver'
                }
            }
        );

        const DefaultDrawer = createDrawerNavigator(
            {
                'ホーム': {
                    screen: Tab,
                    navigationOptions: {
                        drawerIcon: <Icon name='home' size={24} color='white' style={{ left: wp('5%') }} />
                    }
                },
            },
            {
                contentComponent: (props) => (
                    <View style={{ flex: 1, backgroundColor: '#7389D9' }}>
                        <Image source={require('./assets/pretapo-white.png')} style={styles.drawerImage} />
                        <DrawerItems {...props} activeTintColor='white' inactiveTintColor='white'/>
                        <View style={styles.logoutView}>
                            <Icon name="logout" size={24} color={'white'} />
                            <Text
                                style={styles.logoutText}
                                onPress={() => this.props.toggleDisplaySignin()}
                            >
                                ログイン
                            </Text>
                        </View>
                    </View>
                ),
                initialRouteName: "ホーム",
                edgeWidth: wp('100%'),
                drawerWidth: wp('60%')
            }
        )
        const DefaultLayout = createAppContainer(DefaultDrawer);
        if(this.props.displaySignin || this.props.authState !== 'signIn') {
            return null
        } else {
            return(
            <SafeAreaView style={{ flex: 1, width: wp('100%') }}>
                <DefaultLayout />
            </SafeAreaView>
            )
        }
    }
}

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