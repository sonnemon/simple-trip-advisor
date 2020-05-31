import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { firebaseApp } from '../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from 'react-native-easy-toast';
import ListTopRestaurants from '../components/ranking/ListTopRestaurants';

const db = firebase.firestore(firebaseApp);

const Top = ({ navigation }) => {
	const [ restaurants, setRestaurants ] = useState([]);
	const toastRef = useRef();
	useEffect(() => {
		db.collection('restaurants').orderBy('rating', 'desc').limit(5).get().then((response) => {
			const restaurantsList = [];
			response.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				restaurantsList.push(data);
			});
			setRestaurants(restaurantsList);
		});
	});
	return (
		<View>
			<ListTopRestaurants restaurants={restaurants} navigation={navigation} />
			<Toast ref={toastRef} position="center" opacity={0.9} />
		</View>
	);
};

export default Top;
