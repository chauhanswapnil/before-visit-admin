import React, { useState, useReducer } from 'react';
import { Image, Button } from 'react-bootstrap';
import './index.css';
import FirebaseApp from '../Firebase/base';

import * as firebase from 'firebase/app';

var db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const ImageGallery = (props) => {
	const [ isUploading, setUploading ] = useState(false);
	const [ images, setImages ] = useState(props.location.imageProps ? props.location.imageProps.placeImages : []);
	const [ imagesUpload, setImagesUpload ] = useState([]);
	const [ imagesUploadShow, setImagesUploadShow ] = useState([]);
	const [ , forceUpdate ] = useReducer((x) => x + 1, 0);

	const uploadMultipleFiles = (e) => {
		var array1 = imagesUpload;
		var array = imagesUploadShow;
		for (let i = 0; i < e.target.files.length; i++) {
			array1.push(e.target.files[i]);
			array.push(URL.createObjectURL(e.target.files[i]));
		}
		setImagesUpload(array1);
		setImagesUploadShow(array);
		forceUpdate();
	};

	const deleteImage = (index) => {
		if (window.confirm(`Are you sure you want to delete image number ${index}?`)) {
			var imageToDelete = images[index];
			db
				.collection('places')
				.doc(props.location.imageProps.placeid)
				.update({
					images_url : firebase.firestore.FieldValue.arrayRemove(imageToDelete)
				})
				.then(() => {
					var deleteRef = storage.refFromURL(imageToDelete);
					deleteRef
						.delete()
						.then(() => {
							alert('Delete Successfully!');
						})
						.catch(() => {
							alert('An error occured in deleting the file');
						});
				})
				.catch((error) => {
					alert('Error Deleting Image', error);
					props.history.goBack();
				});

			var images_new = images.slice();
			images_new.splice(index, 1);
			setImages(images_new);
		}
	};

	const deleteImageUpload = (index) => {
		if (window.confirm(`Are you sure you want to delete image number ${index}?`)) {
			var images_new_show = imagesUploadShow.slice();
			images_new_show.splice(index, 1);
			setImagesUploadShow(images_new_show);

			var images_new = imagesUpload.slice();
			images_new.splice(index, 1);
			setImagesUpload(images_new);
			console.log(images_new);
		}
	};

	function guid() {
		function _p8(s) {
			var p = (Math.random().toString(16) + '000000000').substr(2, 8);
			return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
		}
		return _p8() + _p8(true) + _p8(true) + _p8();
	}

	const uploadImages = () => {
		if (window.confirm(`The selected images will be uploaded.! Continue ?`)) {
			var urls = [];
			setUploading(true);
			var uploadedCount = 0;
			for (let i = 0; i < imagesUpload.length; i++) {
				storageRef
					.child('places/' + guid())
					.put(imagesUpload[i])
					.then(function(snapshot) // eslint-disable-line no-loop-func
					{
						snapshot.ref.getDownloadURL().then(function(downloadURL) {
							uploadedCount = uploadedCount + 1;
							urls.push(downloadURL);
							if (uploadedCount === imagesUpload.length) {
								// addData(homeURL, urls, '');
								db
									.collection('places')
									.doc(props.location.imageProps.placeid)
									.update({
										images_url : firebase.firestore.FieldValue.arrayUnion(...urls)
									})
									.then(() => {
										setUploading(false);
										alert('Uploaded Images!');
										props.history.goBack();
									})
									.catch((error) => {
										setUploading(false);
										alert('Error Adding Images', error);
										props.history.goBack();
									});
							}
						});
					})
					.catch((error) => {
						setUploading(false);
						alert('Error Uploading Image!', error);
						props.history.goBack();
					});
			}
		}
	};

	return (
		<div>
			{props.location.imageProps ? isUploading ? (
				<h5>Uploading Images...</h5>
			) : (
				<div>
					<div className="row">
						{console.log('IInsiede', images)}
						{images.map((image, i) => (
							<div className="images">
								<Image src={image} className="image" thumbnail />
								<span className="close" onClick={() => deleteImage(i)}>
									Delete
								</span>
							</div>
						))}
					</div>

					<div className="form-group">
						<input
							type="file"
							className="form-control"
							onChange={uploadMultipleFiles}
							multiple
							accept="image/*"
						/>
					</div>

					<Button onClick={uploadImages}>Upload Images</Button>

					<div className="row">
						{imagesUploadShow.map((image, i) => (
							<div className="images">
								<Image src={image} className="image" thumbnail />
								<span className="close" onClick={() => deleteImageUpload(i)}>
									Delete
								</span>
							</div>
						))}
					</div>
				</div>
			) : (
				<h5>
					Uh-Oh! An error occured. You need to be on update place details page and click on "View Places
					Images" to come here.
				</h5>
			)}
		</div>
	);
};

export default ImageGallery;
