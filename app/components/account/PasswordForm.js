import React, { useState } from 'react';
import { size } from 'lodash';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase';

const PasswordForm = ({ setShowModal, setReloadUserInfo, toastRef }) => {
	const [ isShowPassword, setIsShowPassword ] = useState(true);
	const [ isShowNewPassword, setIsShowNewPassword ] = useState(true);
	const [ isShowReNewPassword, setIsShowReNewPassword ] = useState(true);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ formData, setFormData ] = useState(initialState);
	const [ errors, setErrors ] = useState({});
	const onChange = (e, type) => {
		setFormData({
			...formData,
			[type]: e.nativeEvent.text
		});
	};
	const onSubmit = async () => {
		setIsLoading(true);
		if (size(formData.password) < 6) {
			setErrors({
				password: 'Debe tener almenos 6 caracteres'
			});
		} else if (size(formData.newPassword) < 6) {
			setErrors({
				newPassword: 'Debe tener almenos 6 caracteres'
			});
		} else if (size(formData.reNewPassword) < 6) {
			setErrors({
				reNewPassword: 'Debe tener almenos 6 caracteres'
			});
		} else if (formData.newPassword != formData.reNewPassword) {
			setErrors({
				newPassword: 'Las contraseñas deben ser iguales',
				reNewPassword: 'Las contraseñas deben ser iguales'
			});
		} else {
			try {
				const response = await reauthenticate(formData.password);
				await firebase
					.auth()
					.currentUser.updatePassword(formData.newPassword)
					.then(() => {
						setReloadUserInfo(true);
						setShowModal(false);
						firebase.auth().signOut();
					});
			} catch (error) {
				if (error.code == 'auth/wrong-password') {
					setErrors({ password: 'La contraseña no es correcta' });
				} else {
					setErrors({ password: 'Error al actualizar el email' });
				}
			}
		}
		setIsLoading(false);
	};
	return (
		<View style={styles.view}>
			<Input
				placeholder="Contraseña"
				containerStyle={styles.input}
				password={isShowPassword}
				secureTextEntry={isShowPassword}
				rightIcon={{
					type: 'material-community',
					name: isShowPassword ? 'eye-outline' : 'eye',
					color: '#c2c2c2',
					onPress: () => setIsShowPassword(!isShowPassword)
				}}
				onChange={(e) => onChange(e, 'password')}
				errorMessage={errors.password || ''}
			/>
			<Input
				placeholder="Nueva contraseña"
				containerStyle={styles.input}
				password={isShowNewPassword}
				secureTextEntry={isShowNewPassword}
				rightIcon={{
					type: 'material-community',
					name: isShowNewPassword ? 'eye-outline' : 'eye',
					color: '#c2c2c2',
					onPress: () => setIsShowNewPassword(!isShowNewPassword)
				}}
				onChange={(e) => onChange(e, 'newPassword')}
				errorMessage={errors.newPassword || ''}
			/>
			<Input
				placeholder="Repita Nueva contraseña"
				containerStyle={styles.input}
				password={isShowReNewPassword}
				secureTextEntry={isShowReNewPassword}
				rightIcon={{
					type: 'material-community',
					name: isShowReNewPassword ? 'eye-outline' : 'eye',
					color: '#c2c2c2',
					onPress: () => setIsShowReNewPassword(!isShowReNewPassword)
				}}
				onChange={(e) => onChange(e, 'reNewPassword')}
				errorMessage={errors.reNewPassword || ''}
			/>
			<Button
				title="Cambiar contraseña"
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				loading={isLoading}
				onPress={onSubmit}
			/>
		</View>
	);
};

function initialState() {
	return {
		password: '',
		newPassword: '',
		reNewPassword: ''
	};
}

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

export default PasswordForm;
