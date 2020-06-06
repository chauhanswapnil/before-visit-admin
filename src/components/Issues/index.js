import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Grid } from '@material-ui/core';
import IssuesTable from './IssuesTable';
import { Container, Row, Col } from 'react-bootstrap';

var db = FirebaseApp.firestore();

const IssuesPage = () => {
	const [ isLoading, setLoading ] = useState(true);
	const [ newIssuesToday, setNewIssuesToday ] = useState(0);
	const [ totalIssues, setTotalIssues ] = useState(0);
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
		{ field: 'name', title: 'Name'},
		{ field: 'description', title: 'Description'},
		{ field: 'date_created', title: 'Date Created'},
		{ field: 'is_hidden', title: 'Is Solved?'},
		{ field: 'userid', title: 'User ID'},
		{ field: 'docid', title: 'Document ID'}
	];

	const [ rowsUnsolved, setRowsUnsolved ] = useState([]);
	const [ rowsSolved, setRowsSolved ] = useState([]);

	function createData(name, description, date_created, is_hidden, userid, docid) {
		return { name, description, date_created, is_hidden, userid, docid };
	}

	const getData = () => {
		var unsubscribe = db.collection('issues_reported').orderBy('date_created', 'desc').onSnapshot(
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
		const rows1 = []; //Unsolved
		const rows2 = []; //Solved
		setTotalIssues(querySnapshot.docs.length);
		var newIssues = 0;
		querySnapshot.forEach(function(doc) {
			var data = doc.data();
			var name = checkForNullorUndefined(data.name);
			var date_created = checkForNullorUndefined(data.date_created);
			var userid = checkForNullorUndefined(data.userid);
			var description = checkForNullorUndefined(data.description);
			var doc_id = doc.id;
			var is_hidden = data.is_hidden;

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
				console.log(dc_date);
				var today = new Date().toLocaleDateString('en-IN');
				if (today === dc_date) {
					newIssues = newIssues + 1;
				}
			}
			if(is_hidden) {
				rows2.push(createData(name, description, dc_date, is_hidden, userid, doc_id));
			} else {
				rows1.push(createData(name, description, dc_date, is_hidden ,userid, doc_id));
			}
		});
		setNewIssuesToday(newIssues);
		setRowsSolved(rows2);
		setRowsUnsolved(rows1);
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
							<h3>New Issues Today</h3>
							<h4>{newIssuesToday}</h4>
						</div>
					</Col>
					<Col lg={6} className="text-center">
						<div className="top-box">
							<h3>Total Issues</h3>
							<h4>{totalIssues}</h4>
						</div>
					</Col>
				</Row>
			</Container>
			<Grid item xs={12}>
				<IssuesTable columns={columns} rows={rowsUnsolved} title="Unsolved Issues"/>
			</Grid>
			<br/>
			<br/>
			<br/>
			<Grid item xs={12}>
				<IssuesTable columns={columns} rows={rowsSolved} title="Solved Issues"/>
			</Grid>
		</NavigationDrawer>
	);
};

export default IssuesPage;
