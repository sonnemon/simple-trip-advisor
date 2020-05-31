import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'react-native-elements';
import Snap from 'react-native-snap-carousel';
const Carousel = ({ imageList, width, height }) => {
	const renderItem = ({ item }) => {
		return <Image source={{ uri: item }} style={{ width, height }} />;
	};
	return (
		<Snap
			layout="default"
			data={imageList}
			sliderWidth={width}
			itemWidth={width}
			renderItem={renderItem}
		/>
	);
};

export default Carousel;
