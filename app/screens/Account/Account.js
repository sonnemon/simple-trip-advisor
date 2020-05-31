import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import Loading from '../../components/Loading';
import UserGuest from './UserGuest';
import UserLoggued from './UserLoggued';

const Account = () => {
	const [ login, setLogin ] = useState(null);
	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			!user ? setLogin(false) : setLogin(true);
		});
	}, []);
	if (login === null) return <Loading isVisible text="Cargando..." />;

	return login ? <UserLoggued /> : <UserGuest />;
};

export default Account;
