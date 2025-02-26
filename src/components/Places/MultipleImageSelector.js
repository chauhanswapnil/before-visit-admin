import React, { useState } from 'react';
import './add-places.css';

const MultipleImageSelector = (props) => {
	const [ fileArray, setFileArray ] = useState([]);

	const uploadMultipleFiles = (e) => {
		var array = [];
		var array1 = [];
		for (let i = 0; i < e.target.files.length; i++) {
			array.push(URL.createObjectURL(e.target.files[i]));
			array1.push(e.target.files[i]);
		}
		setFileArray(array);
		props.sendImages(array1);
	};

	return (
		<div>
			<div className="form-group multi-preview">
				{fileArray.map((url) => <img className="img-border" src={url} alt="..." />)}
			</div>

			<div className="form-group">
				<input type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
			</div>
		</div>
	);
};

export default MultipleImageSelector;
