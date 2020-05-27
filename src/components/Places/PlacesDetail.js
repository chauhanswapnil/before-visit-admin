import React, { useState, useEffect } from "react";

import "./add-places.css";
import {
  Button,
  InputGroup,
  FormControl,
  Form,
  DropdownButton,
  Dropdown,
  Alert,
  Container
} from "react-bootstrap";
import MultipleImageSelector from "./MultipleImageSelector";
import SingleImageSelector from "./SingleImageSelector";

import * as CONSTANTS from '../../constants/constants';
import NavigationDrawer from '../Navigation';
import FirebaseApp from '../Firebase/base';

var db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();

const PlacesDetail = (props) => {
  const [isLoadingData, setisLoadingData] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState([""]);
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [categoryID, setCategoryID] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isSponsored, setIsSponsored] = useState(false);
  const [isOfferingPromo, setIsOfferingPromo] = useState(false);
  const [promoLink, setPromoLink] = useState("");
  const [city, setCity] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [promotionalImage, setPromotionalImage] = useState("");
  const [homeImage, setHomeImage] = useState("");
  const [placeImages, setPlaceImages] = useState([]);

  const [isError, setIsError] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [show, setShow] = useState(true);

  const [cats, setCats] = useState([]);

  useEffect(() => {
    console.log("In use effect");
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCategories])

  function createData( id, name) {
    return {id, name};
  }

const getData = () => {
    var docref = db.collection(CONSTANTS.PLACES).doc(props.match.params.id);
    docref.get().then(function(doc) {
      setisLoadingData(false);
      var data = doc.data();
      setName(data.name);
      setAddress(data.address);
      setMobileNumber(data.mobile_no);
      setAbout(data.about_store);
      setCategoryID(data.category_id);
      setKeywords(data.search_keywords);
      setVideoUrl(data.video_url);
      setIsSponsored(data.is_sponsored);
      setIsOfferingPromo(data.is_offering_promo);
      setPromotionalImage(data.offer_image_url);
      console.log(promotionalImage);
    }).catch(function(error) {
        setIsError(true);
        setisLoadingData(false);        
    });
    setCategory("Loading");
    var unsubscribe = db.collection(CONSTANTS.CATEGORIES).onSnapshot((querySnapshot) => {
        var rows1 = [];
        querySnapshot.forEach(function(doc) {
          var data = doc.data();
          var id = doc.id;
          var name = data.name;
          rows1.push(createData(
            id,
            name
            ));       
        });
        setLoadingCategories(false);
        setCategory('Select a category');
        rows1.map(row => {
          if (row.id === categoryID) {
            setCategory(row.name);
          }
        })
        setCats(rows1);
    }, (error) => {
        alert(error);
    });

  return () => unsubscribe();
}

  const addMobileNumber = (i) => {
    console.log(mobileNumber);
    let mo = mobileNumber.concat([""]);
    setMobileNumber(mo);
  };

  const removeMobileNumber = (i) => {
    setMobileNumber(mobileNumber);
    let mo = [...mobileNumber.slice(0, i), ...mobileNumber.slice(i + 1)];
    setMobileNumber(mo);
    console.log(mobileNumber);
  };

  function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

  const handleSubmit = (e) => {
      e.preventDefault();
      if (name !== null && name !== undefined && name !== '') {
        if (address !== null && address !== undefined && address !== '') {
          if ( mobileNumber !== null && mobileNumber !== undefined) {
            var check = 1;
            console.log(mobileNumber);
            for (let i = 0; i<mobileNumber.length; i++) {
              if (isNaN(mobileNumber[i]) === true || mobileNumber[i] === '') {
                check = 0;
              }
            }
            if (check === 0) {
              alert('Mobile Number is invalid')
            } else {
              if (about !== null && about !== undefined && about !== '' ) {
                if (category !== null && category !== undefined && category !== '' && category !== 'Select a category' && category !== 'Loading') {
                    
                  if (keywords !== null && keywords !== undefined && keywords !== '') {
                      if (placeImages.length !== 0 && placeImages !== null && placeImages !== undefined) {
                        if (homeImage !== '' && homeImage !== null && homeImage !== undefined) { 
                          if (isOfferingPromo == true && promotionalImage === '' || promotionalImage === null || promotionalImage === undefined) {
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
  };

  const addImages = () => {
      var urls=[];
      setLoading(true);
      storageRef.child('places/'+ guid()).put(homeImage).then(function(snapshot) {
        snapshot.ref.getDownloadURL().then(function(homeURL) {
          var uploadedCount = 0;
            for(let i = 0; i < placeImages.length ; i++) {
                storageRef.child('places/'+guid()).put(placeImages[i]).then(function(snapshot) {
                  snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    uploadedCount = uploadedCount + 1;
                    urls.push(downloadURL);
                    if (uploadedCount === placeImages.length) {
                      if (isOfferingPromo === false) {
                        // Upload without promo image
                        addData(homeURL,urls,"");
                      } else {
                        storageRef.child('places/'+ guid()).put(promotionalImage).then(function(snapshot) {
                          snapshot.ref.getDownloadURL().then(function(promoURL) {
                            addData(homeURL,urls,promoURL);
                          }).catch((error) => {
                            setLoading(false);
                            alert('Error Uploading Image!',error);
                          });
                        }).catch((error) => {
                          setLoading(false);
                          alert('Error Uploading Image!',error);
                        })
                      }
                    }
                  })
                }).catch((error) => {
                  setLoading(false);
                  alert('Error Uploading Image!',error);
                })
            }
        });                                        
      }).catch((error)=> {
          setLoading(false);
          alert('Error Uploading Image!',error);
      });
  };

  const addData = (home_url , places_urls , promo_url) => {
      var docref = db.collection(CONSTANTS.PLACES).doc();
      docref.set({
          about_store: about,
          address: address,
          category_id: categoryID,
          date_created: new Date(),
          home_image_url: home_url,
          images_url: places_urls,
          is_sponsored: isSponsored,
          mobile_no: mobileNumber,
          name: name,
          search_keywords: keywords,
          video_url: videoUrl,
          is_offering_promo: isOfferingPromo,
          offer_image_url: promo_url
      })
      .then(function() {
          setLoading(false);
          alert("Successfully Added!");
      })
      .catch(function(error) {
          setLoading(false);
          alert("Error Adding document: ", error);
      });
  };

  return (

    <NavigationDrawer>
      {isLoadingData ? <h5>Loading Data...</h5> : (isError ? <h5>Error Retreiving Data</h5> : (isLoading ? <h5>Updating Place...</h5> : 
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
              let mo = [...mobileNumber];
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
              className={mobileNumber.length <= 1 ? "opa" : "undefined"}
              onClick={() => removeMobileNumber(i)}
            >
              Remove
            </Button>
          </InputGroup.Append>
        </InputGroup>
      ))}

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
        <div>
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Search categories"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
          />
        </div>
        {cats.map((cat) => (
          <Dropdown.Item key={cat.id}>
            <div
              onClick={() => {
                setCategory(cat.name);
                setCategoryID(cat.id);
              }}
            >
              {cat.name}
            </div>
          </Dropdown.Item>
        ))}
      </DropdownButton>
            <br/>
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
          <InputGroup.Checkbox aria-label="Checkbox for PromoOffers" checked={isOfferingPromo} onChange={() => setIsOfferingPromo(!isOfferingPromo)}/>
        </InputGroup.Prepend>
        <InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
          Promotional Offers(450 x 200)
        </InputGroup.Text>
        {isOfferingPromo ? <SingleImageSelector  imageFile={promotionalImage} sendImage={setPromotionalImage}/> : ''}        
      </InputGroup>

      <div><a href="/places/images"><h6>View Places Images</h6></a></div>
      <div><a href="/places/home/image"><h6>View Home Image</h6></a></div>
      <br/>
      <Button
        variant="primary"
        className="u-margin-med"
        type="submit"
      >
        Add Place
      </Button>
    </div>
    </form>
    </Container>
      ))
      }
          </NavigationDrawer>
  );
};

export default PlacesDetail;
