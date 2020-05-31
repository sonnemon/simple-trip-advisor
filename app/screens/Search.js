import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements';
import { FireSQL } from 'firesql';
import firebase from 'firebase/app';
const firesql = new FireSQL(firebase.firestore(), { includeId: 'id' });

const Search = ({ navigation }) => {
	const [ search, setSearch ] = useState('');
	const [ restaurants, setRestaurants ] = useState([]);

	useEffect(
		() => {
			if (search) {
				firesql
					.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%' limit 5`)
					.then((response) => {
						setRestaurants(response);
					});
			}
		},
		[ search ]
	);

	return (
		<View>
			<SearchBar
				value={search}
				placeholder="Busca tu restaurante..."
				onChangeText={(e) => setSearch(e)}
				containerStyle={styles.searchBar}
			/>
			{restaurants.length == 0 ? (
				<NotFound />
			) : (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => (
						<Restaurant restaurant={restaurant} navigation={navigation} />
					)}
					keyExtractor={(item, idx) => idx.toString()}
				/>
			)}
		</View>
	);
};

const NotFound = () => {
	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Image
				source={require('../../assets/img/no-results.png')}
				style={{ width: 200, height: 200 }}
				resizeMode="cover"
			/>
		</View>
	);
};

const Restaurant = ({ restaurant: { item }, navigation }) => {
	return (
		<ListItem
			title={item.name}
			leftAvatar={{
				source: item.images[0]
					? { uri: item.images[0] }
					: require('../../assets/img/not-found.png')
			}}
			rightIcon={<Icon type="material-community" name="chevron-right" />}
			onPress={() =>
				navigation.navigate('restaurants', {
					screen: 'restaurant',
					params: {
						id: item.id,
						name: item.name
					}
				})}
		/>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		marginBottom: 20
	}
});

export default Search;
