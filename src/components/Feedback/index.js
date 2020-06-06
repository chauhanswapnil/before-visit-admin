import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Grid } from '@material-ui/core';
import FeedbackTable from './FeedbackTable';
import { Container, Row, Col } from 'react-bootstrap';
var db = FirebaseApp.firestore();

const FeedbackPage = () => {
	const [ isLoading, setLoading ] = useState(true);
	const [ newFeedbacksToday, setNewFeedbacksToday ] = useState(0);
	const [ totalFeedbacks, setTotalFeedbacks ] = useState(0);

	useEffect(
		() => {
			console.log('In use effect');
			getData();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const columns = [
		{ field: 'name', title: 'Name', minWidth: 120, align: 'center' },
		{ field: 'rating', title: 'Rating', minWidth: 120, align: 'center' },
		{ field: 'review', title: 'Review', minWidth: 120, align: 'center' },
		{ field: 'date_created', title: 'Date Created', minWidth: 120, align: 'center' },
		{ field: 'userid', title: 'User ID', minWidth: 120, align: 'center' },
		{ field: 'docid', title: 'Document ID', minWidth: 120, align: 'center' }
	];

	const [ rows, setRows ] = useState([]);

	function createData(name, rating, review, date_created, userid, docid) {
		return { name, rating, review, date_created, userid, docid };
	}

	const getData = () => {
		var unsubscribe = db.collection('feedback').orderBy('date_created', 'desc').onSnapshot(
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
		setTotalFeedbacks(querySnapshot.docs.length);
		var newFeedbacks = 0;
		querySnapshot.forEach(function(doc) {
			var data = doc.data();
			var name = checkForNullorUndefined(data.name);
			var rating = checkForNullorUndefined(data.rating);
			var review = checkForNullorUndefined(data.review);
			var date_created = checkForNullorUndefined(data.date_created);
			var userid = checkForNullorUndefined(data.userid);
			var docid = doc.id;

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
				console.log(dc_date);
				var today = new Date().toLocaleDateString('en-IN');
				if (today === dc_date) {
					newFeedbacks = newFeedbacks + 1;
				}
			}
			rows1.push(createData(name, rating, review, dc_date, userid, docid));
		});
		setNewFeedbacksToday(newFeedbacks);
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
							<h3>New Feedbacks Today</h3>
							<h4>{newFeedbacksToday}</h4>
						</div>
					</Col>
					<Col lg={6} className="text-center">
						<div className="top-box">
							<h3>Total Feedbacks</h3>
							<h4>{totalFeedbacks}</h4>
						</div>
					</Col>
				</Row>
			</Container>
			<Grid item xs={12}>
				<FeedbackTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default FeedbackPage;
