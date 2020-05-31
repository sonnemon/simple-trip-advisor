import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

const NameForm = ({ displayName, setShowModal, setReloadUserInfo }) => {
	const [ newDisplayName, setNewDisplayName ] = useState(displayName);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ error, setError ] = useState(null);
	const onSubmit = async () => {
		setError(null);
		if (!newDisplayName) {
			setError('El nombre no puede estar vacio');
		} else if (displayName === newDisplayName) {
			setError('El nombre no puede ser igual al actual');
		} else {
			setIsLoading(true);
			try {
				const update = { displayName: newDisplayName };
				await firebase.auth().currentUser.updateProfile(update);
				setIsLoading(false);
				setShowModal(false);
				setReloadUserInfo(true);
			} catch (error) {
				setIsLoading(false);
				setError('Error al actualizar nombre');
			}
		}
	};
	return (
		<View style={styles.view}>
			<Input
				placeholder="Nombre y Apellido"
				containerStyle={styles.input}
				rightIcon={{
					type: 'material-community',
					name: 'account-circle-outline',
					color: '#c2c2c2'
				}}
				defaultValue={displayName || ''}
				onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
				errorMessage={error || ''}
			/>
			<Button
				title="Cmabiar Nombre"
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				loading={isLoading}
				onPress={onSubmit}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10
	},
	input: {
		marginBottom: 10
	},
	btnContainer: {
		marginTop: 20,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
});

export default NameForm;
