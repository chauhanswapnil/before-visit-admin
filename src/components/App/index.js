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
import ImageGallery from '../Places/ImageGallery';

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div>
					<Switch>
						<PrivateRoute path={ROUTES.HOME} exact component={HomePage} />
						<Route path={ROUTES.SIGN_IN} exact component={SignInPage} />
						<PrivateRoute path={ROUTES.ACCOUNT} exact component={AccountPage} />
						<PrivateRoute path={ROUTES.HOME} exact component={HomePage} />
						<PrivateRoute path={ROUTES.USERS} exact component={UsersPage} />
						<PrivateRoute path={ROUTES.PLACES} exact component={PlacesPage} />
						<PrivateRoute path={ROUTES.PLACES_ADD} exact component={AddPlaces} />
						<PrivateRoute path={ROUTES.PLACES_IMAGES} exact component={ImageGallery} />
						<PrivateRoute path={`${ROUTES.PLACES}/:id`} exact component={PlacesDetail} />
						<PrivateRoute path={ROUTES.CATEGORIES} exact component={CategoriesPage} />
						<PrivateRoute path={ROUTES.INTERESTS} exact component={InterestsPage} />
						<PrivateRoute path={ROUTES.REVIEWS} exact component={ReviewsPage} />
						<PrivateRoute path={ROUTES.REQUESTS} exact component={RequestsPage} />
						<PrivateRoute path={ROUTES.FEEDBACK} exact component={FeedbackPage} />
						<PrivateRoute path={ROUTES.ISSUES} exact component={IssuesPage} />
						<PrivateRoute path={ROUTES.FAQ} exact component={FaqPage} />
						<PrivateRoute path={ROUTES.FAQ_ADD} exact component={AddFaq} />
						<PrivateRoute path={`${ROUTES.FAQ}/:id`} exact component={FaqDetail} />
						<PrivateRoute path={ROUTES.ABOUTUS} exact component={AboutusPage} />
						<PrivateRoute path={`${ROUTES.INTERESTS}/:id`} exact component={InterestsDetail} />
						<PrivateRoute path={ROUTES.CATEGORIES_ADD} exact component={AddCategoryPage} />
						<PrivateRoute path={`${ROUTES.CATEGORIES}/:id`} exact component={CategoryDetail} />
					</Switch>
				</div>
			</Router>
		</AuthProvider>
	);
};

export default App;
