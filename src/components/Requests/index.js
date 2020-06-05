import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import RequestsTable from './RequestsTable';
import { Grid } from '@material-ui/core';
import { Container, Row, Col } from 'react-bootstrap';
var db = FirebaseApp.firestore();

const RequestsPage = () => {
	const [ isLoading, setLoading ] = useState(true);
	const [ newRequestsToday, setNewRequestsToday ] = useState(0);
	const [ totalRequests, setTotalRequests ] = useState(0);

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
		{ id: 'name', label: 'Name', minWidth: 120, align: 'center' },
		{ id: 'business_mobile_no', label: 'Businesss Mobile', minWidth: 120, align: 'center' },
		{ id: 'business_email', label: 'Business Email', minWidth: 120, align: 'center' },
		{ id: 'shop_name', label: 'Shop Name', minWidth: 120, align: 'center' },
		{ id: 'address', label: 'Address', minWidth: 120, align: 'center' },
		{ id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center' },
		{ id: 'userid', label: 'User ID', minWidth: 120, align: 'center' },
		{ id: 'docid', label: 'Document ID', minWidth: 120, align: 'center' }
	];

	const [ rows, setRows ] = useState([]);

	function createData(name, business_mobile_no, business_email, shop_name, address, date_created, userid, docid) {
		return { name, business_mobile_no, business_email, shop_name, address, date_created, userid, docid };
	}

	const getData = () => {
		var unsubscribe = db.collection('business_requests').orderBy('date_created', 'desc').onSnapshot(
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
		setTotalRequests(querySnapshot.docs.length);
		var newRequests = 0;
		querySnapshot.forEach(function(doc) {
			var data = doc.data();

			var name = checkForNullorUndefined(data.name);
			var business_mobile_no = checkForNullorUndefined(data.business_mobile_no);
			var business_email = checkForNullorUndefined(data.business_email);
			var shop_name = checkForNullorUndefined(data.shop_name);
			var address = checkForNullorUndefined(data.address);
			var userid = checkForNullorUndefined(data.userid);
			var docid = doc.id;

			var date_created = checkForNullorUndefined(data.date_created);

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
				var today = new Date().toLocaleDateString('en-IN');
				if (today === dc_date) {
					newRequests = newRequests + 1;
				}
			}
			rows1.push(
				createData(name, business_mobile_no, business_email, shop_name, address, dc_date, userid, docid)
			);
		});
		setNewRequestsToday(newRequests);
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
							<h3>New Requests Today</h3>
							<h4>{newRequestsToday}</h4>
						</div>
					</Col>
					<Col lg={6} className="text-center">
						<div className="top-box">
							<h3>Total Requests</h3>
							<h4>{totalRequests}</h4>
						</div>
					</Col>
				</Row>
			</Container>
			<Grid item xs={12}>
				<RequestsTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default RequestsPage;
