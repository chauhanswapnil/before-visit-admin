import React, { useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import FirebaseApp from '../Firebase/base.js';
import { AuthContext } from '../Firebase/auth.js';

import './index.css';

const SigninPage = () => {
	const handleLogin = async (event) => {
		event.preventDefault();
		const { email, password } = event.target.elements;

		FirebaseApp.auth().signInWithEmailAndPassword(email.value, password.value).then(() => {}).catch((error) => {
			alert(error);
		});
	};

	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/" />;
	}

	return (
		<div className="text-center main-div">
			<h1 className="main-header">BEFORE VISIT ADMIN</h1>
			<form onSubmit={handleLogin}>
				<input name="email" type="email" placeholder="Email" className="email-tf" />
				<br />
				<input name="password" type="password" placeholder="Password" className="password-tf" />
				<br />
				<button type="submit" className="login-btn">
					Log in
				</button>
			</form>
		</div>
	);
};

export default withRouter(SigninPage);
