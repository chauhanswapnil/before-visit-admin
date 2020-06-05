import React, { useState } from 'react';
import './add-places.css';

const MultipleImageUpdate = (props) => {
	const [ , setFileArray ] = useState([]);

	const uploadMultipleFiles = (e) => {
		var array = [];
		for (let i = 0; i < e.target.files.length; i++) {
			array.push(URL.createObjectURL(e.target.files[i]));
			props.imagesArray.push(URL.createObjectURL(e.target.files[i]));
		}
		setFileArray(props.imagesArray);
		props.sendImages(props.imagesArray);
	};

	return (
		<div>
			<div className="form-group">
				<input type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
			</div>
		</div>
	);
};

export default MultipleImageUpdate;
