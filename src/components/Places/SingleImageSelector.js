import React, { Component, useState, useEffect } from 'react';
import "./add-places.css";

const SingleImageSelector = (props) => {

    const [file, setFile] = useState(props.imageFile);

    const uploadSingleFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        props.sendImage(e.target.files[0]);
    }

    return (
        <div>
            <div className="form-group preview">
                {file ? <img className="img-border" src={file} key={Date.now()} alt='' /> : ''}
            </div>

            <div className="form-group">
                <input type="file" className="form-control" onChange={uploadSingleFile} />
            </div>
        </div>
    )
}

export default SingleImageSelector;
