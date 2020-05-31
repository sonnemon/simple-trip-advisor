import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import Map from '../../components/Map';
import { map } from 'lodash';
import ListReviews from '../../components/restaurants/ListReviews';
import Toast from 'react-native-easy-toast';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const Restaurant = ({ route, navigation }) => {
	navigation.setOptions({
		title: route.params.name
	});
	const toastRef = useRef();
	const [ restaurant, setRestaurant ] = useState(null);
	const [ rating, setRating ] = useState(null);
	const [ isFavorite, setIsFavorite ] = useState(false);
	const [ userLogged, setUserLogged ] = useState(false);

	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : false;
	});
	useFocusEffect(
		useCallback(() => {
			db.collection('restaurants').doc(route.params.id).get().then((response) => {
				const data = response.data();
				data.id = response.id;
				setRestaurant(data);
				setRating(data.rating);
			});
		}, [])
	);
	useEffect(
		() => {
			if (userLogged && restaurant) {
				db
					.collection('favorites')
					.where('restaurantId', '==', restaurant.id)
					.where('userId', '==', firebase.auth().currentUser.uid)
					.get()
					.then((response) => {
						if (response.docs.length == 1) {
							setIsFavorite(true);
						}
					});
			}
		},
		[ userLogged, restaurant ]
	);
	const addFavorite = () => {
		if (!userLogged) {
			toastRef.current.show('Para agregar a favoritos tienes que estar logueado');
		} else {
			const payload = {
				userId: firebase.auth().currentUser.uid,
				restaurantId: restaurant.id
			};
			db
				.collection('favorites')
				.add(payload)
				.then(() => {
					setIsFavorite(true);
					toastRef.current.show('Se agrego a favoritos');
				})
				.catch(() => {
					toastRef.current.show('Error al agregar a favoritos favoritos');
				});
		}
	};
	const removeFavorite = () => {
		db
			.collection('favorites')
			.where('restaurantId', '==', restaurant.id)
			.where('userId', '==', firebase.auth().currentUser.uid)
			.get()
			.then((response) => {
				response.forEach((doc) => {
					const idFavorite = doc.id;
					db
						.collection('favorites')
						.doc(idFavorite)
						.delete()
						.then((response) => {
							setIsFavorite(false);
							toastRef.current.show('Se quito de favoritos');
						})
						.catch(() => {
							toastRef.current.show('Hubo un error al quitar de favoritos');
						});
				});
			});
	};
	if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;
	return (
		<ScrollView vertical style={styles.viewBody}>
			<View style={styles.viewFavorite}>
				<Icon
					type="material-community"
					name={isFavorite ? 'heart' : 'heart-outline'}
					onPress={isFavorite ? removeFavorite : addFavorite}
					color={isFavorite ? '#f00' : '#000'}
					size={35}
					underlayColor="transparent"
				/>
			</View>
			<Carousel imageList={restaurant.images} width={screenWidth} height={250} />
			<Title name={restaurant.name} description={restaurant.description} rating={rating} />

			<Info
				name={restaurant.name}
				address={restaurant.address}
				location={restaurant.location}
			/>
			<ListReviews
				navigation={navigation}
				restaurantId={restaurant.id}
				setRating={setRating}
			/>
			<Toast ref={toastRef} position="center" opacoty={0.5} />
		</ScrollView>
	);
};

const Title = ({ name, description, rating }) => {
	return (
		<View style={styles.viewTitle}>
			<View style={{ flexDirection: 'row' }}>
				<Text style={styles.name}>{name}</Text>
				<Rating
					style={styles.rating}
					imageSize={20}
					readonly
					startingValue={parseFloat(rating)}
				/>
			</View>
			<Text style={styles.description}>{description}</Text>
		</View>
	);
};

const Info = ({ location, name, address }) => {
	const listInfo = [
		{
			text: address,
			iconName: 'map-marker',
			iconType: 'material-community',
			action: null
		},
		{
			text: '+51 343 3433',
			iconName: 'phone',
			iconType: 'material-community',
			action: null
		},
		{
			text: 'lodejuan@gmail.com',
			iconName: 'at',
			iconType: 'material-community',
			action: null
		}
	];
	return (
		<View style={styles.info}>
			<Text style={styles.infoTitle}>Info del restaurante</Text>
			<Map location={location} name={name} height={100} />
			{map(listInfo, (item, idx) => {
				return (
					<ListItem
						key={`address_${idx}`}
						title={item.text}
						leftIcon={{ name: item.iconName, type: item.iconType, color: '#00a680' }}
						containerStyle={styles.listContainer}
					/>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	viewTitle: {
		padding: 15
	},
	name: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	description: {
		marginTop: 5,
		color: 'gray'
	},
	rating: {
		position: 'absolute',
		right: 0
	},
	info: {
		margin: 15,
		marginTop: 20
	},
	infoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	listContainer: {
		borderBottomColor: '#d8d8d8',
		borderBottomWidth: 2
	},
	viewFavorite: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 2,
		backgroundColor: '#fff',
		borderBottomLeftRadius: 5,
		padding: 5,
		paddingLeft: 15
	}
});
export default Restaurant;
