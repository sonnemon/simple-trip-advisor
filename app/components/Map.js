import React from 'react';
import openMap from 'react-native-open-maps';
import MapView from 'react-native-maps';
const Map = ({ location, name, height }) => {
	const openAppMap = () => {
		openMap({
			latitude: location.latitude,
			longitude: location.longitude,
			zoom: 19,
			query: name
		});
	};
	return (
		<MapView style={{ height, width: '100%' }} initialRegion={location} onPress={openAppMap}>
			<MapView.Marker
				coordinate={{
					latitude: location.latitude,
					longitude: location.longitude
				}}
			/>
		</MapView>
	);
};

export default Map;
