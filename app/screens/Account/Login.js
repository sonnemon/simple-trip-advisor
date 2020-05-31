import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import LoginForm from '../../components/account/LoginForm';
import LoginFacebook from './LoginFacebook';

const Login = () => {
	const toastRef = useRef();
	return (
		<ScrollView>
			<Image
				source={require('../../../assets/img/logo.png')}
				resizeMode="contain"
				style={styles.logo}
			/>
			<View style={styles.viewContainer}>
				<LoginForm toastRef={toastRef} />
				<CreateAccount />
			</View>
			<Toast ref={toastRef} position="top" opacity={0.9} />
			<Divider style={styles.divider} />
			<View style={styles.viewContainer}>
				<LoginFacebook />
			</View>
		</ScrollView>
	);
};

const CreateAccount = () => {
	const navigation = useNavigation();
	return (
		<Text style={styles.textRegister}>
			Aun no tienes una cuenta?{' '}
			<Text
				style={styles.btnRegister}
				onPress={() => navigation.navigate('register')}
			>
				Registrate
			</Text>
		</Text>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: '100%',
		height: 150,
		marginTop: 20
	},
	viewContainer: {
		marginRight: 20,
		marginLeft: 20
	},
	textRegister: {
		marginTop: 15,
		marginLeft: 10,
		marginRight: 10
	},
	btnRegister: {
		color: '#00a680',
		fontWeight: 'bold'
	},
	divider: {
		backgroundColor: '#00a680',
		margin: 40
	}
});
export default Login;
