import React, { useState, useEffect } from 'react';

import './add-places.css';
import { Button, InputGroup, FormControl, Form, DropdownButton, Dropdown, Container } from 'react-bootstrap';
import SingleImageSelector from './SingleImageSelector';

import * as CONSTANTS from '../../constants/constants';
import NavigationDrawer from '../Navigation';
import FirebaseApp from '../Firebase/base';

import { Link } from 'react-router-dom';

var db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const PlacesDetail = (props) => {
	const [ isLoadingData, setisLoadingData ] = useState(false);
	const [ isLoading, setLoading ] = useState(false);
	const [ name, setName ] = useState('');
	const [ address, setAddress ] = useState('');
	const [ mobileNumber, setMobileNumber ] = useState([ '' ]);
	const [ about, setAbout ] = useState('');
	const [ category, setCategory ] = useState('Select a Category');
	const [ categoryID, setCategoryID ] = useState('');
	const [ keywords, setKeywords ] = useState('');
	const [ isSponsored, setIsSponsored ] = useState(false);
	const [ isOfferingPromo, setIsOfferingPromo ] = useState(false);
	// const [ promoLink, setPromoLink ] = useState('');
	// const [ city, setCity ] = useState('');
	const [ videoUrl, setVideoUrl ] = useState('');
	// const [ searchValue, setSearchValue ] = useState('');
	const [ latitude, setLatitude ] = useState(0);
	const [ longitude, setLongitude ] = useState(0);

	const [ promotionalImage, setPromotionalImage ] = useState('');
	const [ homeImage, setHomeImage ] = useState('');
	const [ placeImages, setPlaceImages ] = useState([]);

	const [ isError, setIsError ] = useState(false);

	const [ , setLoadingCategories ] = useState(true);

	// const [ show, setShow ] = useState(true);

	const [ cats, setCats ] = useState([]);

	// const [ , forceUpdate ] = useReducer((x) => x + 1, 0);

	const [ promoImageDelete, setPromoImageDelete ] = useState('');
	const [ homeImageDelete, setHomeImageDelete ] = useState('');

	useEffect(() => {
		console.log('In use effect');
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function createData(id, name) {
		return { id, name };
	}

	const getData = () => {
		var docref = db.collection(CONSTANTS.PLACES).doc(props.match.params.id);
		docref
			.get()
			.then(function(doc) {
				setisLoadingData(false);
				var data = doc.data();
				setPromotionalImage(data.offer_image_url);
				setPromoImageDelete(data.offer_image_url);
				setHomeImage(data.home_image_url);
				setHomeImageDelete(data.home_image_url);
				setName(data.name);
				setAddress(data.address);
				setMobileNumber(data.mobile_no);
				setAbout(data.about_store);
				setCategoryID(data.category_id);
				setKeywords(data.search_keywords);
				setVideoUrl(data.video_url);
				setIsSponsored(data.is_sponsored);
				setIsOfferingPromo(data.is_offering_promo);
				setLongitude(data.longitude);
				setLatitude(data.latitude);
				setPlaceImages(data.images_url);

				var unsubscribe = db.collection(CONSTANTS.CATEGORIES).onSnapshot(
					(querySnapshot) => {
						var rows1 = [];
						querySnapshot.forEach(function(doc) {
							var data = doc.data();
							var id = doc.id;
							var name = data.name;
							rows1.push(createData(id, name));
						});
						setLoadingCategories(false);
						rows1.map((row) => {
							if (row.id === data.category_id) {
								setCategory(row.name);
								console.log(row.name);
								return true;
							}
							return false;
							// else {
							// 	console.log('In else');
							// 	setCategory('Select a category');
							// }
						});
						setCats(rows1);
					},
					(error) => {
						alert(error);
					}
				);
				return () => unsubscribe();
			})
			.catch(function(error) {
				setIsError(true);
				setisLoadingData(false);
			});
	};

	const addMobileNumber = (i) => {
		console.log(mobileNumber);
		let mo = mobileNumber.concat([ '' ]);
		setMobileNumber(mo);
	};

	const removeMobileNumber = (i) => {
		setMobileNumber(mobileNumber);
		let mo = [ ...mobileNumber.slice(0, i), ...mobileNumber.slice(i + 1) ];
		setMobileNumber(mo);
		console.log(mobileNumber);
	};

	function guid() {
		function _p8(s) {
			var p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (parseFloat(latitude)) {
			if (parseFloat(longitude)) {
				if (name !== null && name !== undefined && name !== '') {
					if (address !== null && address !== undefined && address !== '') {
						if (mobileNumber !== null && mobileNumber !== undefined) {
							var check = 1;
							console.log(mobileNumber);
							for (let i = 0; i < mobileNumber.length; i++) {
								if (isNaN(mobileNumber[i]) === true || mobileNumber[i] === '') {
									check = 0;
								}
							}
							if (check === 0) {
								alert('Mobile Number is invalid');
							}
							else {
								if (about !== null && about !== undefined && about !== '') {
									if (
										category !== null &&
										category !== undefined &&
										category !== '' &&
										category !== 'Select a category' &&
										category !== 'Loading'
									) {
										if (keywords !== null && keywords !== undefined && keywords !== '') {
											if (homeImage !== '' && homeImage !== null && homeImage !== undefined) {
												if (
													(isOfferingPromo === true && promotionalImage === '') ||
													promotionalImage === null ||
													promotionalImage === undefined
												) {
													alert('Promotional image is required..!');
													return;
												}
												// UPDATE DATA HERE
												addPromotionalImage();
											}
											else {
												alert('Home Image is required');
											}
										}
										else {
											alert('Please add a few keywords for better user experience');
										}
									}
									else {
										alert('Please select a category');
									}
								}
								else {
									alert('About Places Cannot be empty');
								}
							}
						}
						else {
							alert('At least one mobile number is required');
						}
					}
					else {
						alert('Address cant be empty');
					}
				}
				else {
					alert('Place Name cant be empty');
				}
			}
			else {
				alert('Longitude is not valid');
			}
		}
		else {
			alert('Latitude is not valid');
		}
	};

	const addPromotionalImage = () => {
		if (typeof homeImage === 'string' && homeImage.includes('https://')) {
		}
		else {
			var deleteRef = storage.refFromURL(homeImageDelete);
			deleteRef.delete().then(() => {}).catch(() => {
				alert('An error occured in deleting the old home image');
				props.history.goBack();
			});

			storageRef
				.child('places/' + guid())
				.put(homeImage)
				.then(function(snapshot) {
					snapshot.ref
						.getDownloadURL()
						.then(function(homeURL) {
							var docref = db.collection(CONSTANTS.PLACES).doc(props.match.params.id);
							docref
								.update({
									home_image_url : homeURL
								})
								.then(function() {})
								.catch(function(error) {
									alert('Error Updating Home Image ', error);
									props.history.goBack();
								});
						})
						.catch((error) => {
							alert('Error Uploading Home Image!', error);
							props.history.goBack();
						});
				})
				.catch((error) => {
					alert('Error Uploading Image!', error);
					props.history.goBack();
				});
		}

		if (isOfferingPromo === false) {
			//Delete image if there was image in the first place
			if (promoImageDelete !== '') {
				var deleteRef1 = storage.refFromURL(promoImageDelete);
				deleteRef1.delete().then(() => {}).catch(() => {
					alert('An error occured in deleting the old image');
					props.history.goBack();
				});
			}
			updateData('');
		}
		else {
			console.log('Promo imageee', promotionalImage);
			if (typeof promotionalImage === 'string' && promotionalImage.includes('https://')) {
				// Just Update other things
				updateData(promoImageDelete);
			}
			else {
				//Delete image if it existed and set offer_image_url to new image url
				if (promoImageDelete !== '') {
					var deleteRef2 = storage.refFromURL(promoImageDelete);
					deleteRef2.delete().then(() => {}).catch(() => {
						alert('An error occured in deleting the old image');
						props.history.goBack();
					});
				}
				storageRef
					.child('places/' + guid())
					.put(promotionalImage)
					.then(function(snapshot) {
						snapshot.ref
							.getDownloadURL()
							.then(function(promoURL) {
								updateData(promoURL);
							})
							.catch((error) => {
								setLoading(false);
								alert('Error Uploading Image!', error);
								props.history.goBack();
							});
					})
					.catch((error) => {
						setLoading(false);
						alert('Error Uploading Image!', error);
						props.history.goBack();
					});
			}
		}
	};

	const updateData = (promo_url) => {
		var docref = db.collection(CONSTANTS.PLACES).doc(props.match.params.id);
		docref
			.update({
				about_store       : about,
				address           : address,
				category_id       : categoryID,
				date_created      : new Date(),
				is_sponsored      : isSponsored,
				mobile_no         : mobileNumber,
				name              : name,
				search_keywords   : keywords,
				video_url         : videoUrl,
				is_offering_promo : isOfferingPromo,
				offer_image_url   : promo_url,
				latitude          : parseFloat(latitude),
				longitude         : parseFloat(longitude)
			})
			.then(function() {
				setLoading(false);
				alert('Successfully Updated!');
				props.history.goBack();
			})
			.catch(function(error) {
				setLoading(false);
				alert('Error Updating document: ', error);
				props.history.goBack();
			});
	};

	const deletePlace = () => {
		if (window.confirm(`Are you sure you want to delete the place?`)) {
			var deleteHome = storage.refFromURL(homeImageDelete);
			deleteHome.delete().then().catch(() => { 
				alert('An error occured in deleting the file');
				props.history.goBack();
			});
			if (promoImageDelete !== '') {
				var deletePromo = storage.refFromURL(promoImageDelete);
			deletePromo.delete().then().catch(() => { 
				alert('An error occured in deleting the file');
				props.history.goBack();
			});
			}
			for (let i=0; i<placeImages.length; i++) {
				var deletePlace = storage.refFromURL(placeImages[i]);
				deletePlace.delete().then().catch(() => { 
					alert('An error occured in deleting the file');
					props.history.goBack();
				});
			}
			db.collection("places").doc(props.match.params.id).delete().then(function() {
				alert("Deleted Successfully!");
				props.history.goBack();
			}).catch((error) => {
				alert("Error Deleting Place!", error);
				props.history.goBack();
			})
		}
	};
	return (
		<NavigationDrawer>
			{isLoadingData ? (
				<h5>Loading Data...</h5>
			) : isError ? (
				<h5>Error Retreiving Data</h5>
			) : isLoading ? (
				<h5>Updating Place...</h5>
			) : (
				<Container>
					<form onSubmit={handleSubmit}>
						<div className="add-places">
							<h1 className="heading-1">Update Place</h1>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Place Name
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Place Name"
									aria-describedby="inputGroup-sizing-default"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Address
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Address"
									aria-describedby="inputGroup-sizing-default"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
								/>
							</InputGroup>

							{mobileNumber.map((mobile, i) => (
								<InputGroup className="mb-3" key={i}>
									<InputGroup.Prepend>
										<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
											Mobile Number {i + 1}
										</InputGroup.Text>
									</InputGroup.Prepend>

									<FormControl
										aria-label="mobile number"
										aria-describedby="inputGroup-sizing-default"
										type="tel"
										value={mobileNumber[i]}
										onChange={(e) => {
											let mo = [ ...mobileNumber ];
											mo[i] = e.target.value;
											setMobileNumber(mo);
										}}
									/>

									<InputGroup.Append>
										<Button variant="info" onClick={() => addMobileNumber(i)}>
											Add
										</Button>
										<Button
											variant="danger"
											className={mobileNumber.length <= 1 ? 'opa' : 'undefined'}
											onClick={() => removeMobileNumber(i)}>
											Remove
										</Button>
									</InputGroup.Append>
								</InputGroup>
							))}

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Latitude
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Latitude"
									aria-describedby="inputGroup-sizing-default"
									type="number"
									value={latitude}
									onChange={(e) => setLatitude(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Longitude
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Longitude"
									type="number"
									aria-describedby="inputGroup-sizing-default"
									value={longitude}
									onChange={(e) => setLongitude(e.target.value)}
								/>
							</InputGroup>
							<p>You can easily get Latitude and Longitude from Google Maps!</p>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										About Store
									</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Group controlId="AboutForm.ControlTextarea1">
									<Form.Control
										as="textarea"
										rows="3"
										value={about}
										onChange={(e) => setAbout(e.target.value)}
									/>
								</Form.Group>
							</InputGroup>

							<DropdownButton variant="info" title={category} id="drop-cat">
								{cats.map((cat) => (
									<Dropdown.Item key={cat.id}>
										<div
											onClick={() => {
												setCategory(cat.name);
												setCategoryID(cat.id);
											}}>
											{cat.name}
										</div>
									</Dropdown.Item>
								))}
							</DropdownButton>
							<br />
							{/* <p>{(cats.find((cat) => cat.name === category) || "").name}</p> */}

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Search Keywords
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Search Keywords"
									aria-describedby="inputGroup-sizing-default"
									placeholder="keyword1,keyword2"
									value={keywords}
									onChange={(e) => setKeywords(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Video Link
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Video Link"
									aria-describedby="inputGroup-sizing-default"
									value={videoUrl}
									onChange={(e) => setVideoUrl(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Checkbox
										aria-label="Checkbox for Sponsored"
										checked={isSponsored}
										onChange={() => setIsSponsored(!isSponsored)}
									/>
								</InputGroup.Prepend>
								<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
									Sponsored?
								</InputGroup.Text>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Checkbox
										aria-label="Checkbox for PromoOffers"
										checked={isOfferingPromo}
										onChange={() => setIsOfferingPromo(!isOfferingPromo)}
									/>
								</InputGroup.Prepend>
								<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
									Promotional Offers(450 x 200)
								</InputGroup.Text>
								{isOfferingPromo ? (
									<SingleImageSelector imageFile={promotionalImage} sendImage={setPromotionalImage} />
								) : (
									''
								)}
							</InputGroup>
							<p>
								<br />
								Select HomePage Image (450x200)
							</p>
							{homeImage ? <SingleImageSelector imageFile={homeImage} sendImage={setHomeImage} /> : ''}
							<br />
							<div>
								<Link
									to={{
										pathname   : '/places/images',
										imageProps : {
											placeImages : placeImages,
											placeid     : props.match.params.id
										}
									}}>
									<h5 style={{ textDecoration: 'underline' }}>View/Update Places Images</h5>
								</Link>
							</div>

							<Button variant="primary" className="u-margin-med" type="submit">
								Update Place
							</Button>
							<br/>
							<Button variant="danger" className="u-margin-med" onClick={deletePlace}>
								Delete Place
							</Button>
						</div>
					</form>
				</Container>
			)}
		</NavigationDrawer>
	);
};

export default PlacesDetail;
