import React, { useState, useRef, useCallback } from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Alert
} from 'react-native';
import { Image, Icon, Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from '../utils/firebase';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';
import firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

const Favorite = ({ navigation }) => {
	const [ restaurants, setRestaurants ] = useState(null);
	const [ userLogged, setUserLogged ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ realoadData, setReloadData ] = useState(false);
	const toastRef = useRef();
	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : setUserLogged(false);
	});

	useFocusEffect(
		useCallback(
			() => {
				if (userLogged) {
					const userId = firebase.auth().currentUser.uid;
					db
						.collection('favorites')
						.where('userId', '==', userId)
						.get()
						.then((response) => {
							const restaurantIds = [];
							response.forEach((doc) => {
								restaurantIds.push(doc.data().restaurantId);
							});
							getDataRestaurant(restaurantIds).then((restaurantResponse) => {
								const restaurants = [];
								restaurantResponse.forEach((doc) => {
									const data = doc.data();
									data.id = doc.id;
									restaurants.push(data);
								});
								setRestaurants(restaurants);
							});
						});
				}
				setReloadData(false);
			},
			[ userLogged, realoadData ]
		)
	);

	const getDataRestaurant = (ids) => {
		const restaurantsRequests = [];
		ids.forEach((restaurantId) => {
			const result = db.collection('restaurants').doc(restaurantId).get();
			restaurantsRequests.push(result);
		});
		return Promise.all(restaurantsRequests);
	};

	if (!userLogged) {
		return <UserNoLogged navigation={navigation} />;
	}
	if ((restaurants || []).length == 0) {
		return <NotFoundRestaurants />;
	}

	return (
		<View style={styles.viewBody}>
			{restaurants ? (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => (
						<Restaurant
							setIsLoading={setIsLoading}
							toastRef={toastRef}
							restaurant={restaurant}
							setReloadData={setReloadData}
							navigation={navigation}
						/>
					)}
					keyExtractor={(item, idx) => `restaurant_${idx}`}
				/>
			) : (
				<View style={styles.viewLoader}>
					<ActivityIndicator size="large" />
					<Text style={{ textAlign: 'center' }}>Cargando...</Text>
				</View>
			)}
			<Toast ref={toastRef} position="center" opacity={0.9} />
			<Loading text="Eliminando restaurnte" isVisible={isLoading} />
		</View>
	);
};
const Restaurant = ({
	restaurant: { item },
	toastRef,
	setIsLoading,
	setReloadData,
	navigation
}) => {
	const confirmRemoveFavorite = () => {
		Alert.alert(
			'Eliminar Restaurante de favoritos',
			'Estas seguro de eliminar el erestaurante',
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					onPress: handleRemove
				}
			],
			{ cancelable: false }
		);
	};
	const handleRemove = () => {
		setIsLoading(true);
		db
			.collection('favorites')
			.where('restaurantId', '==', item.id)
			.where('userId', '==', firebase.auth().currentUser.uid)
			.get()
			.then((response) => {
				response.forEach((doc) => {
					const favoriteId = doc.id;
					db
						.collection('favorites')
						.doc(favoriteId)
						.delete()
						.then(() => {
							setIsLoading(false);
							toastRef.current.show('Restaurante eliminado correctamente');
							setReloadData(true);
						})
						.catch(() => {
							setIsLoading(false);
							toastRef.current.show('Hubo un error al eliminar');
						});
				});
			});
	};
	return (
		<View style={styles.restaurant}>
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
				<Image
					resizeMode="cover"
					style={styles.image}
					PlaceholderContent={<ActivityIndicator color="#fff" />}
					source={
						item.images[0] ? (
							{ uri: item.images[0] }
						) : (
							require('../../assets/img/not-found.png')
						)
					}
				/>
				<View style={styles.info}>
					<Text style={styles.name}>{item.name}</Text>
					<Icon
						type="material-community"
						name="heart"
						color="#f00"
						containerStyle={styles.favorite}
						onPress={confirmRemoveFavorite}
						underlayColor="transparent"
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const NotFoundRestaurants = () => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Icon type="material-community" name="alert-outline" size={50} />
			<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
				No tienes restaurantes en tu lista
			</Text>
		</View>
	);
};

const UserNoLogged = ({ navigation }) => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Icon type="material-community" name="alert-outline" size={50} />
			<Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
				Necesitas estar logueado para usar esta seccion.
			</Text>
			<Button
				title="Ir al loguin"
				containerStyle={{ marginTop: 20, width: '80%', backgroundColor: '#00a680' }}
				onPress={() =>
					navigation.navigate('account', {
						screen: 'login'
					})}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#f2f2f2'
	},
	viewLoader: {
		marginTop: 10,
		marginBottom: 10
	},
	restaurant: {
		margin: 10
	},
	image: {
		width: '100%',
		height: 180
	},
	info: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: -30,
		backgroundColor: '#fff'
	},
	name: {
		fontWeight: 'bold',
		fontSize: 20
	},
	favorite: {
		marginTop: -35,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 100
	}
});
export default Favorite;
