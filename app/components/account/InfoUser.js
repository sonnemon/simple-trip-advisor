import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const InfoUser = ({ userInfo, toastRef, setLoading, setTextLoading }) => {
	const chamgeAvatar = async () => {
		const resultPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);
		const resultPermissionCamera =
			resultPermission.permissions.cameraRoll.status;
		if (resultPermissionCamera == 'denied') {
			toastRef.current.show('Es necesario aceptar los permisos');
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [ 4, 3 ]
			});
			if (result.cancelled) {
				toastRef.current.show('has cerrado la seleccion de imagenes.');
			} else {
				uploadImage(result.uri)
					.then(() => {
						updatePhotoUrl();
					})
					.catch((error) => {
						toastRef.current.show('Error al actualizar el avatar');
					});
			}
		}
	};

	const uploadImage = async (uri) => {
		setTextLoading('Actualizando avatar');
		setLoading(true);
		const response = await fetch(uri);
		const blob = await response.blob();
		const ref = firebase.storage().ref().child(`avatar/${userInfo.uid}`);
		return ref.put(blob);
	};

	const updatePhotoUrl = async () => {
		const name = await firebase
			.storage()
			.ref(`avatar/${userInfo.uid}`)
			.getDownloadURL();
		const update = {
			photoURL: name
		};
		await firebase.auth().currentUser.updateProfile(update);
		setLoading(false);
	};

	return (
		<View style={styles.viewUserInfo}>
			<Avatar
				rounded
				size="large"
				showEditButton
				onEditPress={chamgeAvatar}
				containerStyle={styles.userInfoAvatar}
				source={
					userInfo.photoURL ? (
						{ uri: userInfo.photoURL }
					) : (
						require('../../../assets/img/default-user.jpg')
					)
				}
			/>
			<View>
				<Text style={styles.displayName}>
					{userInfo.displayName ? userInfo.displayName : 'Anonimo'}
				</Text>
				<Text>{userInfo.email ? userInfo.email : 'Social Login'}</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	viewUserInfo: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#f2f2f2',
		paddingTop: 30,
		paddingBottom: 30
	},
	userInfoAvatar: {
		marginRight: 20
	},
	displayName: {
		fontWeight: 'bold',
		paddingBottom: 5
	}
});

export default InfoUser;
