import React, { useEffect } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';

const HomePage = () => {
    return (
        <NavigationDrawer>
            <h1>Dashboard Page</h1>
            <button onClick={() => FirebaseApp.auth().signOut()}>Sign Out</button>
        </NavigationDrawer>
    )
}

export default HomePage;
