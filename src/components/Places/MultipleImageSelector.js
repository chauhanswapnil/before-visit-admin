import React, { Component, useState } from 'react';
import "./add-places.css";

const MultipleImageSelector = (props) => {

    const [fileArray, setFileArray] = useState([]);

    const uploadMultipleFiles = (e) => {
        var array = [];
        for (let i=0; i < e.target.files.length; i++) {
            array.push(URL.createObjectURL(e.target.files[i]));
        }
        
        props.sendImages(setFileArray(array));
    }

    return (
        <div>
            <div className="form-group multi-preview">
                { fileArray.map(url => ( <img className="img-border" src={url} alt="..." /> )) }
            </div>

            <div className="form-group">
                <input type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
            </div>
        </div>
    )
}

export default MultipleImageSelector;
