import React from 'react';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestaurantsStack from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import AccountStack from './AccountStack';
import SearchStack from './SearchStack';
import TopStack from './TopStack';

const Tab = createBottomTabNavigator();
const Navigation = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="restaurants"
				tabBarOptions={{
					inactiveBackgroundColor: '#646464',
					activeTintColor: '#00a680'
				}}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color }) => screenOptions(route, color)
				})}
			>
				<Tab.Screen
					name="restaurants"
					component={RestaurantsStack}
					options={{ title: 'Restaurantes' }}
				/>
				<Tab.Screen
					name="favorites"
					component={FavoritesStack}
					options={{ title: 'Favoritos' }}
				/>
				<Tab.Screen name="top" component={TopStack} options={{ title: 'Top' }} />
				<Tab.Screen name="search" component={SearchStack} options={{ title: 'Buscar' }} />
				<Tab.Screen name="account" component={AccountStack} options={{ title: 'Cuenta' }} />
			</Tab.Navigator>
		</NavigationContainer>
	);
};
function screenOptions(route, color) {
	let iconName;
	switch (route.name) {
		case 'restaurants':
			iconName = 'compass-outline';
			break;
		case 'favorites':
			iconName = 'heart-outline';
			break;
		case 'account':
			iconName = 'home-outline';
			break;
		case 'search':
			iconName = 'magnify';
			break;
		case 'top':
			iconName = 'star-outline';
			break;

		default:
			break;
	}
	return <Icon type="material-community" name={iconName} size={22} color={color} />;
}

export default Navigation;
