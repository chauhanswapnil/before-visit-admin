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
        <label style={{marginLeft:"3rem"}}>
          Email
          <input name="email" type="email" placeholder="Email" style={{marginLeft:"0.5rem"}}/>
        </label>
        <label style={{marginLeft:"3rem"}}>
          Password
          <input name="password" type="password" placeholder="Password" style={{marginLeft:"0.5rem"}}/>
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(SigninPage);