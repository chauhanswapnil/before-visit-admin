import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import {InputGroup,FormControl, Form, Button} from 'react-bootstrap';

import * as CONSTANTS from '../../constants/constants';

const db = FirebaseApp.firestore();

const AboutusPage = () => {

    const [description, setDescription] = useState('');
    const [videourl, setVideourl] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [visitusurl, setVisitusurl] = useState('');
    const [docid, setDocid] = useState('');

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    const getData = () => {
        db.collection(CONSTANTS.ABOUT_US)
            .get()
            .then(function(querySnapshot) {
                setLoading(false);
                querySnapshot.forEach(function(doc) {
                    setDescription(doc.data().description);
                    setVideourl(doc.data().video_url)
                    setVisitusurl(doc.data().visit_us_url);
                    setDocid(doc.id);
                });
            })
            .catch(function(error) {
                setLoading(false);
                alert('Error Loading data', error);
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        db.collection(CONSTANTS.ABOUT_US).doc(docid).update({
            description: description,
            video_url:  videourl,
            visit_us_url: visitusurl
        }).then(() => {
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            alert('Error Updating data', error);
        })
    };

    return (
        <NavigationDrawer>
            {isLoading ? <h5>Loading...</h5> : <form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
                        About Us
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Group controlId="AboutForm.ControlTextarea1">
                    <Form.Control
                        as="textarea"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    </Form.Group>
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
                    value={videourl}
                    onChange={(e) => setVideourl(e.target.value)}
                    />
                </InputGroup>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
                        Visit Us Link
                    </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                    aria-label="Video Link"
                    aria-describedby="inputGroup-sizing-default"
                    value={visitusurl}
                    onChange={(e) => setVisitusurl(e.target.value)}
                    />
                </InputGroup>
                <Button
                    variant="primary"
                    className="u-margin-med"
                    type="submit"
                >
                    Update
                </Button>
            </form>
            }
            </NavigationDrawer>
    )
}

export default AboutusPage;
