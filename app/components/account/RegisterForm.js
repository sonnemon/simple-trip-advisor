import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { validateEmail } from '../../utils/validations';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';

const RegisterForm = ({ toastRef }) => {
	const [ lockPassword, setLockPassword ] = useState(true);
	const [ lockConfirmPassword, setLockConfirmPassword ] = useState(true);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ formData, setFormData ] = useState(defaultFormValue);
	const navigation = useNavigation();

	const onSubmit = async () => {
		if (
			isEmpty(formData.email) ||
			isEmpty(formData.password) ||
			isEmpty(formData.repeatPassword)
		) {
			toastRef.current.show('Todos los campos son obligatorios');
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('Email incorrecto');
		} else if (formData.password != formData.repeatPassword) {
			toastRef.current.show('Las contraseñas tienen que ser iguales');
		} else if (size(formData.password) > 6) {
			toastRef.current.show(
				'Las contraseña tiene que tener almenos 6 caracteres'
			);
		} else {
			setIsLoading(true);
			try {
				const response = await firebase
					.auth()
					.createUserWithEmailAndPassword(
						formData.email,
						formData.password
					);
				setIsLoading(false);
				navigation.navigate('account');
			} catch (e) {
				setIsLoading(false);
				toastRef.current.show(
					'El email ya esta en uso, pruebe con otro.'
				);
			}
		}
	};

	const onChange = (e, type) => {
		setFormData({
			...formData,
			[type]: e.nativeEvent.text
		});
	};

	if (isLoading) return <Loading isVisible={isLoading} text="Cargando..." />;

	return (
		<View style={styles.formContainer}>
			<Input
				placeholder="Email"
				style={styles.inputForm}
				onChange={(e) => onChange(e, 'email')}
				rightIcon={
					<Icon
						type="material-community"
						name="at"
						iconStyle={styles.iconRight}
					/>
				}
			/>
			<Input
				password={lockPassword}
				secureTextEntry={lockPassword}
				placeholder="Contraseña"
				onChange={(e) => onChange(e, 'password')}
				style={styles.inputForm}
				rightIcon={
					<Icon
						type="material-community"
						name={lockPassword ? 'eye-outline' : 'eye'}
						iconStyle={styles.iconRight}
						onPress={() => setLockPassword(!lockPassword)}
					/>
				}
			/>
			<Input
				password={lockConfirmPassword}
				secureTextEntry={lockConfirmPassword}
				onChange={(e) => onChange(e, 'repeatPassword')}
				placeholder="Repetir Contraseña"
				style={styles.inputForm}
				rightIcon={
					<Icon
						type="material-community"
						name={lockConfirmPassword ? 'eye-outline' : 'eye'}
						iconStyle={styles.iconRight}
						onPress={() =>
							setLockConfirmPassword(!lockConfirmPassword)}
					/>
				}
			/>
			<Button
				title="Unirse"
				containerStyle={styles.btnContainerRegister}
				buttonStyle={styles.btnRegister}
				onPress={onSubmit}
			/>
		</View>
	);
};

function defaultFormValue() {
	return {
		email: '',
		password: '',
		repeatPassword: ''
	};
}

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30
	},
	inputForm: {
		width: '100%',
		marginTop: 20
	},
	btnContainerRegister: {
		marginTop: 20,
		width: '95%'
	},
	btnRegister: {
		backgroundColor: '#00a580'
	},
	iconRight: {
		color: '#c1c1c1'
	}
});

export default RegisterForm;
