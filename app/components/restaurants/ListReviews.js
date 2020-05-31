import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import { firebaseApp } from '../../utils/firebase';
import { map } from 'lodash';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, restaurantId }) => {
	const [ isLogged, setIsLogged ] = useState(false);
	const [ reviews, setReviews ] = useState([]);

	firebase.auth().onAuthStateChanged((user) => {
		user ? setIsLogged(true) : setIsLogged(false);
	});
	useEffect(() => {
		db
			.collection('reviews')
			.where('restaurantId', '==', restaurantId)
			.get()
			.then((response) => {
				const resultReviews = [];
				response.forEach((doc) => {
					const data = doc.data();
					data.id = doc.id;
					resultReviews.push(data);
				});
				setReviews(resultReviews);
			});
	}, []);
	return (
		<View>
			{isLogged ? (
				<Button
					title="Escribe una opinion"
					buttonStyle={styles.btnAddReview}
					titleStyle={styles.btnTitleReview}
					icon={{
						type: 'material-community',
						name: 'square-edit-outline',
						color: '#00a680'
					}}
					onPress={() =>
						navigation.navigate('add-review-restaurant', {
							restaurantId
						})}
				/>
			) : (
				<View>
					<Text
						onPress={() => navigation.navigate('login')}
						style={{ textAlign: 'center', color: '#00a680', padding: 20 }}
					>
						Para escribir un comentario es necesario estar logueado{' '}
						<Text style={{ fontWeight: 'bold' }}>
							Presiona aqui para iniciar session
						</Text>
					</Text>
				</View>
			)}
			{map(reviews, (review, idx) => {
				return <Review key={`review_${idx}`} review={review} />;
			})}
		</View>
	);
};

const Review = ({ review }) => {
	const date = new Date(review.createAt.seconds * 1000);
	return (
		<View style={styles.viewReview}>
			<View style={styles.imageAvatar}>
				<Avatar
					source={
						review.avatarUser ? (
							{ uri: review.avatarUser }
						) : (
							require('../../../assets/img/default-user.jpg')
						)
					}
					size="large"
					rounded
					containerStyle={styles.imageAvatarUser}
				/>
			</View>
			<View style={styles.viewInfo}>
				<Text style={styles.title}>{review.title}</Text>
				<Text style={styles.reviewText}>{review.review}</Text>
				<Rating imageSize={15} startingValue={review.rating} readonly />
				<Text style={styles.reviewDate}>
					{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()} - {date.getHours()}:{date.getMinutes() < 10 ? '0' : ''}:
					{date.getMinutes()}:{date.getSeconds() < 10 ? '0' : ''}
					{date.getSeconds()}
				</Text>
			</View>
		</View>
	);
};

export default ListReviews;

const styles = StyleSheet.create({
	btnAddReview: {
		backgroundColor: 'transparent'
	},
	btnTitleReview: {
		color: '#00a680'
	},
	viewReview: {
		flexDirection: 'row',
		padding: 10,
		paddingBottom: 20,
		borderBottomColor: '#e3e3e3',
		borderBottomWidth: 1
	},
	imageAvatar: {
		marginRight: 15
	},
	imageAvatarUser: {
		width: 50,
		height: 50
	},
	viewInfo: {
		flex: 1,
		alignItems: 'flex-start'
	},
	title: {
		fontWeight: 'bold'
	},
	reviewText: {
		paddingTop: 2,
		color: 'gray',
		marginBottom: 5
	},
	reviewDate: {
		marginTop: 5,
		color: 'grey',
		position: 'absolute',
		right: 0,
		bottom: 0,
		fontSize: 12
	}
});
