import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Button, Grid } from '@material-ui/core';

import * as ROUTES from '../../constants/routes';
import * as CONSTANTS from '../../constants/constants';
import PlacesTable from './PlacesTable';

var db = FirebaseApp.firestore();

const PlacesPage = (props) => {
	const [ isLoading, setLoading ] = useState(true);

	useEffect(
		() => {
			console.log('In use effect');
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const columns = [
		{ field: 'name', title: 'Place Name'},
		{ field: 'visitor_count', title: 'Visitor Count'},
		{ field: 'saved_count', title: 'Saved Count'},
		{ field: 'avg_review', title: 'Average Review'},
		{ field: 'category_id', title: 'Category ID'},
		{ field: 'is_sponsored', title: 'Is Sponsored?'},
		{ field: 'is_offering_promo', title: 'Is Offering Promo?'},
		{ field: 'address', title: 'Address', cellStyle: { minWidth: '200px' } , headerStyle: { minWidth: '200px' }},
		{ field: 'about_store', title: 'About Store', cellStyle: { minWidth: '200px' } , headerStyle: { minWidth: '200px' }},
		{ field: 'mobile_no', title: 'Mobile Number'},
		{ field: 'date_created', title: 'Date Created'},
		{ field: 'search_keywords', title: 'Search Keywords', cellStyle: { minWidth: '200px' } , headerStyle: { minWidth: '200px' }},
		{ field: 'video_url', title: 'Video URL'},
		{ field: 'doc_id', title: 'Document ID'}
	];

	const [ rows, setRows ] = useState([]);

	function createData(
		name,
		visitor_count,
		saved_count,
		avg_review,
		category_id,
		is_sponsored,
		is_offering_promo,
		address,
		about_store,
		mobile_no,
		date_created,
		search_keywords,
		video_url,
		doc_id
	) {
		return {
			name,
			visitor_count,
			saved_count,
			avg_review,
			category_id,
			is_sponsored,
			is_offering_promo,
			address,
			about_store,
			mobile_no,
			date_created,
			search_keywords,
			video_url,
			doc_id
		};
	}

	const getData = () => {
		var unsubscribe = db.collection(CONSTANTS.PLACES).orderBy('date_created', 'desc').onSnapshot(
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

		querySnapshot.forEach(function(doc) {
			var data = doc.data();
			var name = checkForNullorUndefined(data.name);
			var visitor_count = checkForNullorUndefined(data.visitor_count);
			var saved_count = checkForNullorUndefined(data.saved_count);
			var avg_review = checkForNullorUndefined(data.avg_review);
			var category_id = checkForNullorUndefined(data.category_id);
			var is_sponsored = checkForNullorUndefined(data.is_sponsored);
			var is_offering_promo = checkForNullorUndefined(data.is_offering_promo);
			var address = checkForNullorUndefined(data.address);
			var about_store = checkForNullorUndefined(data.about_store);
			var mobile_no = checkForNullorUndefined(data.mobile_no);
			var date_created = checkForNullorUndefined(data.date_created);
			// var home_image_url = checkForNullorUndefined(data.home_image_url);
			// var images_url = checkForNullorUndefined(data.images_url);
			// var offer_image_url = checkForNullorUndefined(data.offer_image_url);
			var search_keywords = checkForNullorUndefined(data.search_keywords);
			var video_url = checkForNullorUndefined(data.video_url);
			var doc_id = doc.id;

			if (visitor_count === '') {
				visitor_count = '0';
			}

			if (saved_count === '') {
				saved_count = '0';
			}

			var sponsored_string = 'No';
			if (is_sponsored === true) {
				sponsored_string = 'Yes';
			}

			var promo_string = 'No';
			if (is_offering_promo === true) {
				promo_string = 'Yes';
			}

			if (date_created !== '') {
				var dc_date = doc.data().date_created.toDate().toLocaleDateString('en-IN');
			}
			rows1.push(
				createData(
					name,
					visitor_count,
					saved_count,
					avg_review,
					category_id,
					sponsored_string,
					promo_string,
					address,
					about_store,
					mobile_no.toString(),
					dc_date,
					// home_image_url,
					// images_url.toString(),
					// offer_image_url,
					search_keywords.toString(),
					video_url,
					doc_id
				)
			);
		});
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
			<Button
				variant="contained"
				color="primary"
				style={{ marginBottom: '2rem' }}
				onClick={() => props.history.push(ROUTES.PLACES_ADD)}>
				Add Place
			</Button>

			<Grid item xs={12}>
				<PlacesTable columns={columns} rows={rows} />
			</Grid>
		</NavigationDrawer>
	);
};

export default PlacesPage;
