import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import ReviewsTable from './ReviewsTable';
import { Grid } from '@material-ui/core';
import { Container, Row, Col } from 'react-bootstrap';
var db = FirebaseApp.firestore();

const ReviewsPage = () => {
	const [ isLoading, setLoading ] = useState(true);
	const [ newReviewsToday, setNewReviewsToday ] = useState(0);
	const [ totalReviews, setTotalReviews ] = useState(0);

	useEffect(
		() => {
			console.log('In use effect');
			// eslint-disable-next-line react-hooks/exhaustive-deps
			getData();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const columns = [
		{ id: 'place_name', label: 'Place Name', minWidth: 120, align: 'center' },
		{ id: 'review', label: 'Review', minWidth: 120, align: 'center' },
		{ id: 'rating', label: 'Rating', minWidth: 120, align: 'center' },
		{ id: 'user_name', label: 'User', minWidth: 120, align: 'center' },
		{ id: 'userid', label: 'User ID', minWidth: 120, align: 'center' },
		{ id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center' },
		{ id: 'place_id', label: 'Place ID', minWidth: 120, align: 'center' },
		{ id: 'docid', label: 'Document ID', minWidth: 120, align: 'center' }
	];

	const [ rows, setRows ] = useState([]);

	function createData(place_name, review, rating, user_name, user_id, date_created, place_id, docid) {
		return { place_name, review, rating, user_name, user_id, date_created, place_id, docid };
	}

	const getData = () => {
		var unsubscribe = db.collection('ratings_and_reviews').orderBy('date_created', 'desc').onSnapshot(
			(querySnapshot) => {
				handleQuery(querySnapshot);
			},
			(error) => {
				alert(error);
			}
		);

		return () => unsubscribe();
	};

	const handleQuery = (querySnapshot) => {
		setLoading(false);
		const rows1 = [];
		setTotalReviews(querySnapshot.docs.length);
		var newReviews = 0;
		querySnapshot.forEach(function(doc) {
			var data = doc.data();
			// place_name, review, rating,user_name,userid,date_created,place_id,docid

			var place_name = checkForNullorUndefined(data.place_name);
			var review = checkForNullorUndefined(data.review);
			var rating = checkForNullorUndefined(data.rating);
			var user_name = checkForNullorUndefined(data.user_name);
			var userid = checkForNullorUndefined(data.userid);
			var place_id = checkForNullorUndefined(data.place_id);
			var docid = doc.id;
			var date_created = checkForNullorUndefined(data.date_created);

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
				console.log(dc_date);
				var today = new Date().toLocaleDateString('en-IN');
				if (today === dc_date) {
					newReviews = newReviews + 1;
				}
			}
			rows1.push(createData(place_name, review, rating, user_name, userid, dc_date, place_id, docid));
		});
		setNewReviewsToday(newReviews);
		setRows(rows1);
	};

	const checkForNullorUndefined = (value) => {
		if (value !== undefined && value !== null) {
			return value;
		}
		else {
			return '';
		}
	};

	return (
		<NavigationDrawer>
			<Container>
				<Row>
					<Col lg={6} className="text-center">
						<div className="top-box">
							<h3>New Reviews Today</h3>
							<h4>{newReviewsToday}</h4>
						</div>
					</Col>
					<Col lg={6} className="text-center">
						<div className="top-box">
							<h3>Total Reviews</h3>
							<h4>{totalReviews}</h4>
						</div>
					</Col>
				</Row>
			</Container>
			<Grid item xs={12}>
				<ReviewsTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default ReviewsPage;
