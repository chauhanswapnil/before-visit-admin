import React, { useState, useEffect } from 'react';

import './add-places.css';
import { Button, InputGroup, FormControl, Form, DropdownButton, Dropdown, Container } from 'react-bootstrap';
import MultipleImageSelector from './MultipleImageSelector';
import SingleImageSelector from './SingleImageSelector';

import * as CONSTANTS from '../../constants/constants';
import NavigationDrawer from '../Navigation';
import FirebaseApp from '../Firebase/base';

import imageCompression from 'browser-image-compression';
const options = {
	maxSizeMB : 0.5 // (default: Number.POSITIVE_INFINITY)
};

var db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const AddPlaces = (props) => {
	const [ isLoading, setLoading ] = useState(false);
	const [ name, setName ] = useState('');
	const [ address, setAddress ] = useState('');
	const [ mobileNumber, setMobileNumber ] = useState([ '' ]);
	const [ about, setAbout ] = useState('');
	const [ category, setCategory ] = useState('Select Category');
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

	const [ loadingCategories, setLoadingCategories ] = useState(true);

	const [ locationUrl, setLocationUrl ] = useState('');
	// const [ show, setShow ] = useState(true);

	const [ cats, setCats ] = useState([]);

	useEffect(
		() => {
			console.log('In use effect');
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ loadingCategories ]
	);

	function createData(id, name) {
		return { id, name };
	}

	const getData = () => {
		setCategory('Loading');
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
				setCategory('Select a category');
				setCats(rows1);
			},
			(error) => {
				alert(error);
			}
		);

		return () => unsubscribe();
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		const compressedHomeImage = await imageCompression(homeImage, options);
		console.log(compressedHomeImage.size);

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
							} else {
								if (about !== null && about !== undefined && about !== '') {
									if (
										category !== null &&
										category !== undefined &&
										category !== '' &&
										category !== 'Select a category' &&
										category !== 'Loading'
									) {
										if (keywords !== null && keywords !== undefined && keywords !== '') {
											if (
												placeImages.length !== 0 &&
												placeImages !== null &&
												placeImages !== undefined
											) {
												if (homeImage !== '' && homeImage !== null && homeImage !== undefined) {
													if (
														(isOfferingPromo === true && promotionalImage === '') ||
														promotionalImage === null ||
														promotionalImage === undefined
													) {
														alert('Promotional image is required..!');
														return;
													}
													// ADDING DATA HERE
													addImages();
												} else {
													alert('Add a home image');
												}
											} else {
												alert('Add atleast 1 place image');
											}
										} else {
											alert('Please add a few keywords for better user experience');
										}
									} else {
										alert('Please select a category');
									}
								} else {
									alert('About Places Cannot be empty');
								}
							}
						} else {
							alert('At least one mobile number is required');
						}
					} else {
						alert('Address cant be empty');
					}
				} else {
					alert('Place Name cant be empty');
				}
			} else {
				alert('Longitude is not valid');
			}
		} else {
			alert('Latitude is not valid');
		}
	};

	const addImages = async () => {
		var urls = [];
		setLoading(true);

		const compressedHomeImage = await imageCompression(homeImage, options);
		console.log(compressedHomeImage.size);
		const placeImagesCompressed = [];
		for (let i = 0; i < placeImages.length; i++) {
			placeImagesCompressed.push(await imageCompression(placeImages[i], options));
		}
		var promoImageCompressed;
		if (isOfferingPromo === true) {
			promoImageCompressed = await imageCompression(promotionalImage, options);
		}
		storageRef
			.child('places/' + guid())
			.put(compressedHomeImage)
			.then(function(snapshot) {
				snapshot.ref.getDownloadURL().then(function(homeURL) {
					var uploadedCount = 0;
					for (let i = 0; i < placeImagesCompressed.length; i++) {
						storageRef
							.child('places/' + guid())
							.put(placeImagesCompressed[i])
							.then(function(
								snapshot // eslint-disable-line no-loop-func
							) {
								snapshot.ref.getDownloadURL().then(function(downloadURL) {
									uploadedCount = uploadedCount + 1;
									urls.push(downloadURL);
									if (uploadedCount === placeImagesCompressed.length) {
										if (isOfferingPromo === false) {
											// Upload without promo image
											addData(homeURL, urls, '');
										} else {
											storageRef
												.child('places/' + guid())
												.put(promoImageCompressed)
												.then(function(snapshot) {
													snapshot.ref
														.getDownloadURL()
														.then(function(promoURL) {
															addData(homeURL, urls, promoURL);
														})
														.catch((error) => {
															setLoading(false);
															alert('Error Uploading Image!', error);
														});
												})
												.catch((error) => {
													setLoading(false);
													alert('Error Uploading Image!', error);
												});
										}
									}
								});
							})
							.catch((error) => {
								setLoading(false);
								alert('Error Uploading Image!', error);
							});
					}
				});
			})
			.catch((error) => {
				setLoading(false);
				alert('Error Uploading Image!', error);
			});
	};

	const addData = (home_url, places_urls, promo_url) => {
		var docref = db.collection(CONSTANTS.PLACES).doc();
		docref
			.set({
				about_store       : about,
				address           : address,
				category_id       : categoryID,
				date_created      : new Date(),
				home_image_url    : home_url,
				images_url        : places_urls,
				is_sponsored      : isSponsored,
				mobile_no         : mobileNumber,
				name              : name,
				search_keywords   : keywords,
				video_url         : videoUrl,
				is_offering_promo : isOfferingPromo,
				offer_image_url   : promo_url,
				latitude          : parseFloat(latitude),
				longitude         : parseFloat(longitude),
				location_url      : locationUrl
			})
			.then(function() {
				setLoading(false);
				alert('Successfully Added!');
			})
			.catch(function(error) {
				setLoading(false);
				alert('Error Adding document: ', error);
			});
	};

	return (
		<NavigationDrawer>
			{isLoading ? (
				<h5>Adding Place...</h5>
			) : (
				<Container>
					<form onSubmit={handleSubmit}>
						<div className="add-places">
							<h1 className="heading-1">Add New Place</h1>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Place Name
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Place Name"
									aria-describedby="inputGroup-sizing-default"
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
									// type="number"
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
									aria-describedby="inputGroup-sizing-default"
									// type="number"
									value={longitude}
									onChange={(e) => setLongitude(e.target.value)}
								/>
							</InputGroup>
							<p>You can easily get Latitude and Longitude from Google Maps!</p>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										Location Url (Google Maps URL)
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									aria-label="Location URL"
									aria-describedby="inputGroup-sizing-default"
									value={locationUrl}
									onChange={(e) => setLocationUrl(e.target.value)}
								/>
							</InputGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
										About Store
									</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Group controlId="AboutForm.ControlTextarea1">
									<Form.Control as="textarea" rows="3" onChange={(e) => setAbout(e.target.value)} />
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
								<SingleImageSelector sendImage={setPromotionalImage} />
							</InputGroup>

							<p>
								<br />
								Select Place Images (200x200)
							</p>
							<MultipleImageSelector sendImages={setPlaceImages} />

							<p>
								<br />
								Select HomePage Image (450x200)
							</p>
							<SingleImageSelector sendImage={setHomeImage} />

							<Button variant="primary" className="u-margin-med" type="submit">
								Add Place
							</Button>
						</div>
					</form>
				</Container>
			)}
		</NavigationDrawer>
	);
};

export default AddPlaces;
