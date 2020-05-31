import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import { Image } from 'react-native-elements';
import { size } from 'lodash';
import { useNavigation } from '@react-navigation/native';

const ListRestaurants = ({ restaurants, handleLoadMore, isLoading }) => {
	const navigation = useNavigation();
	return (
		<View>
			{size(restaurants) > 0 ? (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => (
						<Restaurant restaurant={restaurant} navigation={navigation} />
					)}
					keyExtractor={(item, idx) => idx.toString()}
					onEndReachedThreshold={0.5}
					onEndReached={handleLoadMore}
					ListFooterComponent={<FooterList isLoading={isLoading} />}
				/>
			) : (
				<View style={styles.loaderRestaurants}>
					<ActivityIndicator size="large" />
					<Text>Cargando Restaurantes</Text>
				</View>
			)}
		</View>
	);
};

const Restaurant = ({ restaurant, navigation }) => {
	const imageRestaurant = restaurant.item.images[0];
	const goRestaurant = () => {
		navigation.navigate('restaurant', {
			id: restaurant.item.id,
			name: restaurant.item.name
		});
	};
	return (
		<TouchableOpacity onPress={goRestaurant}>
			<View style={styles.viewRestaurant}>
				<View style={styles.viewRestaurantImage}>
					<Image
						resizeMode="cover"
						PlaceholderContent={<ActivityIndicator color="fff" />}
						source={
							imageRestaurant ? (
								{ uri: imageRestaurant }
							) : (
								require('../../../assets/img/not-found.png')
							)
						}
						style={styles.imgRestaurant}
					/>
				</View>
				<View>
					<Text style={styles.name}>{restaurant.item.name}</Text>
					<Text style={styles.address}>{restaurant.item.address}</Text>
					<Text style={styles.description}>
						{`${restaurant.item.description.substr(0, 60)}...`}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const FooterList = ({ isLoading }) => {
	if (isLoading) {
		return (
			<View style={styles.loaderRestaurants}>
				<ActivityIndicator size="large" />
			</View>
		);
	} else {
		return (
			<View style={styles.notFound}>
				<Text>No hay mas restaurantes.</Text>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	loaderRestaurants: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center'
	},
	viewRestaurant: {
		flexDirection: 'row',
		margin: 10
	},
	viewRestaurantImage: {
		marginRight: 15
	},
	imgRestaurant: {
		width: 80,
		height: 80
	},
	name: {
		fontWeight: 'bold'
	},
	address: {
		paddingTop: 2,
		color: 'gray'
	},
	description: {
		paddingTop: 2,
		color: 'gray',
		width: 300
	},
	notFound: {
		marginTop: 10,
		marginBottom: 20,
		alignItems: 'center'
	}
});
export default ListRestaurants;
