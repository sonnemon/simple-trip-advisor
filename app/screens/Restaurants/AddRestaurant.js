import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/restaurants/AddRestaurantForm';
const AddRestaurant = ({ navigation }) => {
	const toastRef = useRef();
	const [ isLoading, setIsLoading ] = useState(false);
	return (
		<View>
			<AddRestaurantForm
				toastRef={toastRef}
				setIsLoading={setIsLoading}
				navigation={navigation}
			/>
			<Toast ref={toastRef} position="center" opacity={0.9} />
			<Loading isVisible={isLoading} text="Creando Restaurante" />
		</View>
	);
};
const styles = StyleSheet.create({});

export default AddRestaurant;
