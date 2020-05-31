import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/validations';
import { size } from 'lodash';
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase';

const EmailForm = ({ email, setShowModal, setReloadUserInfo, toastRef }) => {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ errors, setErrors ] = useState({});
	const [ formData, setFormData ] = useState(() => initialState(email));
	const [ isShowPassword, setIsShowPassword ] = useState(true);
	const onChange = (e, type) => {
		setFormData({
			...formData,
			[type]: e.nativeEvent.text
		});
	};
	const onSubmit = async () => {
		setIsLoading(true);
		setErrors({});
		if (!validateEmail(formData.email)) {
			setErrors({ email: 'Ingrese un email correcto' });
		} else if (!formData.email) {
			setErrors({ email: 'El email no puede estar vacio' });
		} else if (email == formData.email) {
			setErrors({ email: 'El email no puede ser igual al actual' });
		} else if (!formData.password) {
			setErrors({ password: 'La contraseña no puede estar varcio' });
		} else if (size(formData.password) < 6) {
			setErrors({
				password: 'La contraseña debe tener almenos 6 caracteres'
			});
		} else {
			try {
				const result = await reauthenticate(formData.password);
				firebase
					.auth()
					.currentUser.updateEmail(formData.email)
					.then(() => {
						setReloadUserInfo(true);
						toastRef.current.show(
							'Email actualizado correctamente'
						);
						setShowModal(false);
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
				placeholder="Email"
				containerStyle={styles.input}
				rightIcon={{
					type: 'material-community',
					name: 'at',
					color: '#c2c2c2'
				}}
				defaultValue={email || ''}
				onChange={(e) => onChange(e, 'email')}
				errorMessage={errors.email || ''}
			/>
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
			<Button
				title="Cmabiar Email"
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				loading={isLoading}
				onPress={onSubmit}
			/>
		</View>
	);
};

function initialState(email) {
	return {
		email,
		password: ''
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

export default EmailForm;
