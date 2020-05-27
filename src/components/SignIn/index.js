import React, { useContext } from "react";
import { withRouter, Redirect } from "react-router";
import FirebaseApp from "../Firebase/base.js";
import { AuthContext } from "../Firebase/auth.js";

const SigninPage = () => {
    
  const handleLogin = 
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;

      FirebaseApp.auth().signInWithEmailAndPassword(email.value,password.value).then(() => {
            
        }).catch((error) => {
            alert(error);
        });
    };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(SigninPage);