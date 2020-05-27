import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignInPage from '../SignIn';
import HomePage from '../Home';

import * as ROUTES from '../../constants/routes';

import { AuthProvider } from '../Firebase/auth.js';
import PrivateRoute from '../Firebase/PrivateRoute.js';
import AccountPage from '../Account';
import UsersPage from '../Users';
import PlacesPage from '../Places';
import CategoriesPage from '../Categories';
import InterestsPage from '../Interests';
import ReviewsPage from '../Reviews';
import FaqPage from '../Faq';
import AboutusPage from '../Aboutus';
import FeedbackPage from '../Feedback';
import IssuesPage from '../Issues';
import RequestsPage from '../Requests';
import InterestsDetail from '../Interests/InterestsDetail';
import AddCategoryPage from '../Categories/AddCategory';
import CategoryDetail from '../Categories/CategoryDetail';
import AddPlaces from '../Places/AddPlaces';
import PlacesDetail from '../Places/PlacesDetail';
import AddFaq from '../Faq/AddFaq';
import FaqDetail from '../Faq/FaqDetail';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Switch>
                        {/* <PrivateRoute path={ROUTES.HOME} exact component={HomePage} /> */}
                        <Route path={ROUTES.SIGN_IN} exact component={SignInPage} />
                        <Route path={ROUTES.ACCOUNT} exact component={AccountPage} />
                        <Route path={ROUTES.HOME} exact component={HomePage} />
                        <Route path={ROUTES.USERS} exact component={UsersPage} />
                        <Route path={ROUTES.PLACES} exact component={PlacesPage} />
                        <Route path={ROUTES.PLACES_ADD} exact component={AddPlaces} />
                        <Route path={`${ROUTES.PLACES}/:id`} exact component={PlacesDetail} />
                        <Route path={ROUTES.CATEGORIES} exact component={CategoriesPage} />
                        <Route path={ROUTES.INTERESTS} exact component={InterestsPage} />
                        <Route path={ROUTES.REVIEWS} exact component={ReviewsPage} />
                        <Route path={ROUTES.REQUESTS} exact component={RequestsPage} />
                        <Route path={ROUTES.FEEDBACK} exact component={FeedbackPage} />
                        <Route path={ROUTES.ISSUES} exact component={IssuesPage} />
                        <Route path={ROUTES.FAQ} exact component={FaqPage} />
                        <Route path={ROUTES.FAQ_ADD} exact component={AddFaq} />
                        <Route path={`${ROUTES.FAQ}/:id`} exact component={FaqDetail} />
                        <Route path={ROUTES.ABOUTUS} exact component={AboutusPage} />
                        <Route path={`${ROUTES.INTERESTS}/:id`} exact component={InterestsDetail}/>
                        <Route path={ROUTES.CATEGORIES_ADD} exact component={AddCategoryPage} />
                        <Route path={`${ROUTES.CATEGORIES}/:id`} exact component={CategoryDetail}/>
                    </Switch>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
