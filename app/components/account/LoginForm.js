import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/validations';
import { useNavigation } from '@react-navigation/native';
import { size, isEmpty } from 'lodash';
import * as firebase from 'firebase';
import Loading from '../Loading';

const LoginForm = ({ toastRef }) => {
	const [ lockPassword, setLockPassword ] = useState(true);
	const [ formData, setFormData ] = useState(defaultFormValue);
	const [ isLoading, setIsLoading ] = useState(false);
	const navigation = useNavigation();
	const onChange = (e, type) => {
		setFormData({
			...formData,
			[type]: e.nativeEvent.text
		});
	};
	const onSubmit = async () => {
		if (isEmpty(formData.email) || isEmpty(formData.password)) {
			toastRef.current.show('Todos los campos son obligatorios');
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('Email incorrecto');
		} else if (size(formData.password) < 5) {
			toastRef.current.show('Las contraseña tiene que tener almenos 6 caracteres');
		} else {
			setIsLoading(true);
			try {
				const response = await firebase
					.auth()
					.signInWithEmailAndPassword(formData.email, formData.password);
				setIsLoading(false);
				navigation.navigate('account');
			} catch (e) {
				setIsLoading(false);
				toastRef.current.show('El email ya esta en uso, pruebe con otro.');
			}
		}
	};

	if (isLoading) return <Loading isVisible={isLoading} text="Cargando..." />;

	return (
		<View style={styles.formContainer}>
			<Input
				placeholder="Email"
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'email')}
				rightIcon={
					<Icon type="material-community" name="at" iconStyle={styles.iconRight} />
				}
			/>
			<Input
				placeholder="Password"
				password={lockPassword}
				secureTextEntry={lockPassword}
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'password')}
				rightIcon={
					<Icon
						type="material-community"
						name={lockPassword ? 'eye-outline' : 'eye'}
						iconStyle={styles.iconRight}
						onPress={() => setLockPassword(!lockPassword)}
					/>
				}
			/>
			<Button
				title="Iniciar session"
				containerStyle={styles.btnContainerLogin}
				buttonStyle={styles.btnLogin}
				onPress={onSubmit}
			/>
		</View>
	);
};
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
	btnContainerLogin: {
		marginTop: 20,
		width: '95%'
	},
	btnLogin: {
		backgroundColor: '#00a680'
	},
	iconRight: {
		color: '#c1c1c1'
	}
});
function defaultFormValue() {
	return {
		email: '',
		password: ''
	};
}
export default LoginForm;
