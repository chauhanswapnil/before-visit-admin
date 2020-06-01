import React, { useState } from "react";
import { Image, Button } from "react-bootstrap";

import MultipleImageSelector from "../Places/MultipleImageSelector";

import "./index.css";

const ImageGallery = () => {
  const images_array = [
    "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    "https://c6.staticflickr.com/9/8890/28897154101_a8f55be225_b.jpg",
    "https://c7.staticflickr.com/9/8106/28941228886_86d1450016_b.jpg",
    "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
    "https://c8.staticflickr.com/9/8104/28973555735_ae7c208970_b.jpg",
    "https://c1.staticflickr.com/9/8707/28868704912_cba5c6600e_b.jpg",
    "https://c4.staticflickr.com/9/8578/28357117603_97a8233cf5_b.jpg",
    "https://c1.staticflickr.com/9/8056/28354485944_148d6a5fc1_b.jpg",
  ];

  const [images, setImages] = useState(images_array);
  

  const deleteImage = (index) => {
    if (
      window.confirm(`Are you sure you want to delete image number ${index}?`)
    ) {
      var images_new = images.slice();
      images_new.splice(index, 1);
      setImages(images_new);
    }
  };

  return (
    <div>
      <div className="row">
        {images.map((image, i) => (
          <div className="images">
            <Image src={image} className="image" thumbnail />
            <span className="close" onClick={() => deleteImage(i)}>
              Delete
            </span>
          </div>
        ))}
      </div>

      <MultipleImageSelector sendImages={setImages} />

      <Button>Update</Button>
    </div>
  );
};

export default ImageGallery;
