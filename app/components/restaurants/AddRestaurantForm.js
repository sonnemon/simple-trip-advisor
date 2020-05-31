import React, { useState, useEffect, Fragment } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { firebaseApp } from '../../utils/firebase';
import uuid from 'random-uuid-v4';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import MapView from 'react-native-maps';
import { map, size, filter } from 'lodash';
import Modal from '../Modal';

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get('window').width;

const AddRestaurantForm = ({ navigation, toastRef, setIsLoading }) => {
	const [ name, setName ] = useState('');
	const [ direction, setDirection ] = useState('');
	const [ description, setDescription ] = useState('');
	const [ images, setImages ] = useState([]);
	const [ isVisibleMap, setIsVisibleMap ] = useState(false);
	const [ location, setLocationRestaurant ] = useState(null);
	const addRestaurant = () => {
		if (!name || !direction || !description) {
			toastRef.current.show('Todos los campos del formulario son obligatorios.');
		} else if (size(images) == 0) {
			toastRef.current.show('Tienen que tener almenos una foto.');
		} else if (!location) {
			toastRef.current.show('Tienen que localizar el restaurante en el mapa.');
		} else {
			setIsLoading(true);
			updloadImageStorage().then((response) => {
				db
					.collection('restaurants')
					.add({
						name,
						address: direction,
						description,
						location,
						images: response,
						rating: 0,
						ratingTotal: 0,
						quantityVoting: 0,
						createAt: new Date(),
						createBy: firebase.auth().currentUser.uid
					})
					.then((response) => {
						setIsLoading(false);
						toastRef.current.show('Se creo el restaurante');
						navigation.navigate('restaurants');
					})
					.catch((error) => {
						setIsLoading(false);
						toastRef.current.show('Error al crear el restaurante');
					});
			});
		}
	};
	const updloadImageStorage = async () => {
		const imageBlob = [];
		await Promise.all(
			map(images, async (image) => {
				const response = await fetch(image);
				const blob = await response.blob();
				const ref = firebase.storage().ref('restaurant').child(uuid());
				await ref.put(blob).then(async (result) => {
					await firebase
						.storage()
						.ref(`restaurant/${result.metadata.name}`)
						.getDownloadURL()
						.then((url) => imageBlob.push(url));
				});
			})
		);
		return imageBlob;
	};
	return (
		<ScrollView style={styles.scrollView}>
			<ImageRestaurant image={images[0]} />
			<FormAdd
				setName={setName}
				setDirection={setDirection}
				setDescription={setDescription}
				setIsVisibleMap={setIsVisibleMap}
				location={location}
			/>
			<UploadImage toastRef={toastRef} imageList={{ images, setImages }} />
			<Button
				title="Crear Restaurante"
				onPress={addRestaurant}
				buttonStyle={styles.btnRestaurant}
			/>
			<Maps
				toastRef={toastRef}
				isVisibleMap={isVisibleMap}
				setIsVisibleMap={setIsVisibleMap}
				setLocationRestaurant={setLocationRestaurant}
			/>
		</ScrollView>
	);
};

const FormAdd = ({ setName, setDirection, setDescription, setIsVisibleMap, location }) => {
	return (
		<View style={styles.viewForm}>
			<Input
				placeholder="Nombre del restaurante"
				containerStyle={styles.input}
				onChange={(e) => setName(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Direccion"
				containerStyle={styles.input}
				onChange={(e) => setDirection(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: 'google-maps',
					color: location ? '#00a680' : '#c2c2c2',
					onPress: () => setIsVisibleMap((oldValue) => !oldValue)
				}}
			/>
			<Input
				placeholder="Discripcion del restaurante"
				containerStyle={styles.input}
				inputContainerStyle={styles.textArea}
				multiline
				onChange={(e) => setDescription(e.nativeEvent.text)}
			/>
		</View>
	);
};

const ImageRestaurant = ({ image }) => {
	return (
		<View style={styles.viewPhoto}>
			<Image
				source={image ? { uri: image } : require('../../../assets/img/not-found.png')}
				style={{ width: widthScreen, height: 200 }}
			/>
		</View>
	);
};

const Maps = ({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) => {
	const [ location, setLocation ] = useState(null);
	useEffect(() => {
		(async () => {
			const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
			const statusPermissions = resultPermissions.permissions.location.status;
			if (statusPermissions != 'granted') {
				toastRef.current.show('Deber aceptar los permisos', 3000);
			} else {
				const loc = await Location.getCurrentPositionAsync({});
				setLocation({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001
				});
			}
		})();
	}, []);
	const confirmLocation = () => {
		toastRef.current.show('Localizacion guardada correctamente');
		setLocationRestaurant(location);
		setIsVisibleMap((old) => !old);
	};
	return (
		<Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
			<Fragment>
				<View>
					{location && (
						<MapView
							initialRegion={location}
							style={styles.map}
							showsUserLocation={true}
							onRegionChange={(region) => setLocation(region)}
						>
							<MapView.Marker
								coordinate={{
									latitude: location.latitude,
									longitude: location.longitude
								}}
								draggable
							/>
						</MapView>
					)}
				</View>
				<View style={styles.viewMapBtn}>
					<Button
						title="Guardar ubicación"
						containerStyle={styles.btnSaveContainer}
						buttonStyle={styles.btnSave}
						onPress={confirmLocation}
					/>
					<Button
						title="Cancelar ubicación"
						containerStyle={styles.btnCancelContainer}
						buttonStyle={styles.btnCancel}
						onPress={() => setIsVisibleMap((old) => !old)}
					/>
				</View>
			</Fragment>
		</Modal>
	);
};

const UploadImage = ({ toastRef, imageList }) => {
	const imageSelect = async () => {
		const resultPermissions = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (resultPermissions == 'denied') {
			toastRef.current.show('Es necesario aceptar los permisos', 3000);
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [ 4, 3 ]
			});
			if (result.cancelled) {
				toastRef.current.show('Galeria cerrada', 2000);
			} else {
				imageList.setImages([ ...imageList.images, result.uri ]);
			}
		}
	};
	const removeImage = (image) => {
		Alert.alert(
			'Eliminar Imagen',
			'Desea eliminar esta imagen?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Eliminar',
					onPress: () => {
						const newList = filter(imageList.images, (imgUrl) => imgUrl != image);
						imageList.setImages(newList);
					}
				}
			],
			{ cancelable: false }
		);
	};
	return (
		<View style={styles.viewImage}>
			{size(imageList.images) < 4 && (
				<Icon
					type="material-community"
					name="camera"
					color="#7a7a7a"
					containerStyle={styles.containerIcon}
					onPress={imageSelect}
				/>
			)}
			{map(imageList.images, (image, idx) => (
				<Avatar
					key={`avatar_${idx}`}
					style={styles.miniImage}
					source={{ uri: image }}
					onPress={() => removeImage(image)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	scrollView: {
		height: '100%'
	},
	viewForm: {
		marginLeft: 10,
		marginRight: 10
	},
	input: {
		marginBottom: 10
	},
	textArea: {
		height: 100,
		width: '100%',
		padding: 0,
		margin: 0
	},
	btnRestaurant: {
		backgroundColor: '#00a680',
		margin: 20
	},
	viewImage: {
		flexDirection: 'row',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 30
	},
	containerIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		height: 70,
		width: 70,
		backgroundColor: '#e3e3e3'
	},
	miniImage: {
		width: 70,
		height: 70,
		marginRight: 10
	},
	viewPhoto: {
		alignItems: 'center',
		height: 200,
		marginBottom: 20
	},
	map: {
		width: '100%',
		height: 550
	},
	viewMapBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10
	},
	btnCancelContainer: {
		paddingLeft: 5
	},
	btnCancel: {
		backgroundColor: '#a60d0d'
	},
	btnSaveContainer: { paddingRight: 5 },
	btnSave: {
		backgroundColor: '#00a680'
	}
});
export default AddRestaurantForm;
