import React, { useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
import RegisterForm from '../../components/account/RegisterForm';

const Register = () => {
	const toastRef = useRef();
	return (
		<KeyboardAwareScrollView>
			<Image
				source={require('../../../assets/img/logo.png')}
				resizeMode="contain"
				style={styles.logo}
			/>
			<View style={styles.viewForm}>
				<RegisterForm toastRef={toastRef} />
			</View>
			<Toast ref={toastRef} position="top" opacity={0.9} />
		</KeyboardAwareScrollView>
	);
};

const styles = StyleSheet.create({
	logo: {
		width: '100%',
		height: 150,
		marginTop: 20
	},
	viewForm: {
		marginRight: 20,
		marginLeft: 20
	}
});
export default Register;
