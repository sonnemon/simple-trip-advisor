import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, Icon, Rating } from 'react-native-elements';

const ListTopRestaurants = ({ restaurants, navigation }) => {
	return (
		<FlatList
			data={restaurants}
			renderItem={(restaurant) => (
				<Restaurant restaurant={restaurant} navigation={navigation} />
			)}
			keyExtractor={(item, idx) => idx.toString()}
		/>
	);
};

const Restaurant = ({ restaurant, navigation }) => {
	const { item } = restaurant;
	const [ iconColor, setIconColor ] = useState('#000');
	useEffect(() => {
		if (restaurant.index === 0) {
			setIconColor('#efb819');
		} else if (restaurant.index === 1) {
			setIconColor('#e3e4e5');
		} else if (restaurant.index === 2) {
			setIconColor('#cd7f32');
		}
	}, []);

	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('restaurants', {
					screen: 'restaurant',
					params: {
						id: item.id,
						name: item.name
					}
				});
			}}
		>
			<Card containerStyle={styles.containerStyle}>
				<Icon
					type="material-community"
					name="chess-queen"
					color={iconColor}
					size={40}
					containerStyle={styles.containerIcon}
				/>
				<Image
					style={styles.restaurantImage}
					resizeMode="cover"
					source={
						item.images[0] ? (
							{ uri: item.images[0] }
						) : (
							require('../../../assets/img/not-found.png')
						)
					}
				/>
				<View style={styles.titleRating}>
					<Text style={styles.title}>{item.name}</Text>
					<Rating
						startingValue={item.rating}
						readonly
						imageSize={20}
						style={styles.rating}
					/>
				</View>
				<Text style={styles.description}>{item.description}</Text>
			</Card>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		marginBottom: 30,
		borderWidth: 0
	},
	containerIcon: {
		position: 'absolute',
		top: -30,
		left: -30,
		zIndex: 2
	},
	restaurantImage: {
		width: '100%',
		height: 200
	},
	titleRating: {
		flexDirection: 'row',
		marginTop: 10,
		justifyContent: 'space-between'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	description: {
		color: 'gray',
		marginTop: 0,
		textAlign: 'justify'
	}
});
export default ListTopRestaurants;
