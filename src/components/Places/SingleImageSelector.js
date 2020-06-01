import React, { useState, useEffect } from 'react';
import "./add-places.css";

const SingleImageSelector = (props) => {

    const [file, setFile] = useState(null);

    const uploadSingleFile = (e) => {
        setFile(URL.createObjectURL(e.target.files[0]));
        props.sendImage(e.target.files[0]);
    }

    return (
        <div>
            <div className="form-group preview">
                {file ? <img className="img-border" src={file} alt='' /> : ''}
            </div>

            <div className="form-group">
                <input type="file" className="form-control" onChange={uploadSingleFile} />
            </div>
        </div>
    )
}

export default SingleImageSelector;
