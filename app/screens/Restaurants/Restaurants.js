import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { firebaseApp } from '../../utils/firebase';
import { useFocusEffect } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import ListRestaurants from '../../components/restaurants/ListRestaurants';

const db = firebase.firestore(firebaseApp);

const Restaurants = ({ navigation }) => {
	const [ user, setUser ] = useState(null);
	const [ restaurants, setRestaurants ] = useState([]);
	const [ countRestaurants, setCountRestaurants ] = useState(0);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ startRestaurant, setStartRestaurant ] = useState(null);
	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo);
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			db.collection('restaurants').get().then((response) => {
				setCountRestaurants(response.size);
			});
			const resultRestaurants = [];
			db
				.collection('restaurants')
				.orderBy('createAt', 'desc')
				.limit(7)
				.get()
				.then((response) => {
					setStartRestaurant(response.docs[response.docs.length - 1]);
					response.forEach((doc) => {
						const restaurant = doc.data();
						restaurant.id = doc.id;
						resultRestaurants.push(restaurant);
					});
					setRestaurants(resultRestaurants);
				});
		}, [])
	);

	const handleLoadMore = () => {
		const resultRestaurants = [];
		restaurants.length < countRestaurants && setIsLoading(true);
		db
			.collection('restaurants')
			.orderBy('createAt', 'desc')
			.startAfter(startRestaurant.data().createAt)
			.limit(7)
			.get()
			.then((response) => {
				if (response.docs.length > 0) {
					setStartRestaurant(response.docs[response.docs.length - 1]);
				} else {
					setIsLoading(false);
				}
				response.forEach((doc) => {
					const restaurant = doc.data();
					restaurant.id = doc.id;
					resultRestaurants.push(restaurant);
				});
				setRestaurants([ ...restaurants, ...resultRestaurants ]);
			});
	};
	return (
		<View style={styles.viewBody}>
			<ListRestaurants
				restaurants={restaurants}
				handleLoadMore={handleLoadMore}
				isLoading={isLoading}
			/>
			{user && (
				<Icon
					type="material-community"
					name="plus"
					color="#00a680"
					reverse
					containerStyle={styles.btnContainer}
					onPress={() => navigation.navigate('add-restaurant')}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	btnContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		shadowColor: 'black',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.5
	}
});

export default Restaurants;
