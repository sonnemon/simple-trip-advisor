import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const UserGuest = () => {
	const navigation = useNavigation();

	return (
		<ScrollView centerContent style={styles.viewBody}>
			<Image
				source={require('../../../assets/img/user-guest.jpg')}
				resizeMode="contain"
				style={styles.image}
			/>
			<Text style={styles.title}>Consulta tu perfil</Text>
			<Text style={styles.description}>
				It is a long established fact that a reader will be distracted
				by the readable content of a page when looking at its layout.
			</Text>
			<View style={styles.viewButton}>
				<Button
					title={'Ver tu perfil'}
					buttonStyle={styles.btnStyle}
					containerStyle={styles.btnContainer}
					onPress={() => navigation.navigate('login')}
				/>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	viewBody: {
		marginLeft: 30,
		marginRight: 30
	},
	image: {
		height: 300,
		width: '100%',
		marginBottom: 40
	},
	title: {
		fontWeight: 'bold',
		fontSize: 19,
		marginBottom: 10,
		textAlign: 'center'
	},
	description: {
		textAlign: 'center',
		marginBottom: 10
	},
	btnStyle: {
		backgroundColor: '#00a680'
	},
	viewButton: {
		flex: 1,
		alignItems: 'center'
	},
	btnContainer: {
		width: '70%'
	}
});

export default UserGuest;
