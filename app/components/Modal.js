import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';

const Modal = ({ isVisible, setIsVisible, children }) => {
	return (
		<Overlay
			isVisible={isVisible}
			windowBackgroundColor="rgba(0,0,0,0.5)"
			overlayBackgroundColor="transparent"
			overlayStyle={styles.overlay}
			onBackdropPress={() => setIsVisible(false)}
		>
			{children}
		</Overlay>
	);
};

const styles = StyleSheet.create({
	overlay: {
		height: 'auto',
		width: '90%',
		backgroundColor: '#fff'
	}
});

export default Modal;
