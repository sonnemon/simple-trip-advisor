import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Top from '../screens/Top';

const Stack = createStackNavigator();
const TopStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="top"
				component={Top}
				options={{ title: 'Top' }}
			/>
		</Stack.Navigator>
	);
};

export default TopStack;
