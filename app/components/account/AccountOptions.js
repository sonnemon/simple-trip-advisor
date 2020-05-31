import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { map } from 'lodash';
import Modal from '../Modal';
import NameForm from './NameForm';
import EmailForm from './EmailForm';
import PasswordForm from './PasswordForm';

const AccountOptions = ({ toastRef, userInfo, setReloadUserInfo }) => {
	const [ showModal, setShowModal ] = useState(false);
	const [ renderComponent, setRenderComponent ] = useState(null);
	const selectComponent = (key) => {
		switch (key) {
			case 'displayName':
				setRenderComponent(
					<NameForm
						setReloadUserInfo={setReloadUserInfo}
						displayName={userInfo.displayName}
						setShowModal={setShowModal}
					/>
				);
				break;
			case 'displayEmail':
				setRenderComponent(
					<EmailForm
						setReloadUserInfo={setReloadUserInfo}
						email={userInfo.email}
						setShowModal={setShowModal}
						toastRef={toastRef}
					/>
				);
				break;
			case 'displayPassword':
				setRenderComponent(
					<PasswordForm
						setReloadUserInfo={setReloadUserInfo}
						setShowModal={setShowModal}
						toastRef={toastRef}
					/>
				);
				break;
			default:
				setRenderComponent(null);
		}
		setShowModal(true);
	};
	const options = generateOptions(selectComponent);

	return (
		<View>
			{map(options, (menu, idx) => (
				<ListItem
					key={`menu_${idx}`}
					title={menu.title}
					leftIcon={{
						type: menu.iconType,
						name: menu.iconNameLeft,
						color: menu.iconColorLeft
					}}
					rightIcon={{
						type: menu.iconType,
						name: menu.iconNameRight,
						color: menu.iconColorRight
					}}
					containerStyle={styles.menuItem}
					onPress={menu.onPress}
				/>
			))}
			{renderComponent && (
				<Modal isVisible={showModal} setIsVisible={setShowModal}>
					{renderComponent}
				</Modal>
			)}
		</View>
	);
};

function generateOptions(selectComponent) {
	return [
		{
			title: 'Cambiar nombres y apellidos',
			iconType: 'material-community',
			iconNameLeft: 'account-circle',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('displayName')
		},
		{
			title: 'Cambiar email',
			iconType: 'material-community',
			iconNameLeft: 'at',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('displayEmail')
		},
		{
			title: 'Cambiar contraseña',
			iconType: 'material-community',
			iconNameLeft: 'lock-reset',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectComponent('displayPassword')
		}
	];
}

const styles = StyleSheet.create({
	menuItem: {
		borderBottomWidth: 1,
		borderBottomColor: '#e3e3e3'
	}
});

export default AccountOptions;
