import React from 'react';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FacebookApi } from '../../utils/social';
const LoginFacebook = () => {
	const handlePress = async () => {
		await Facebook.initializeAsync(FacebookApi.applicationId);
		const result = await Facebook.logInWithReadPermissionsAsync({
			permissions: FacebookApi.permissions
		});
	};
	return (
		<SocialIcon
			title="Iniciar sesión con Facebook"
			button
			type="facebook"
			onPress={handlePress}
		/>
	);
};

export default LoginFacebook;
