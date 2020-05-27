import React, {useState, useEffect} from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import * as CONSTANTS from '../../constants/constants';
import {  Row, Col } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';

import {withRouter} from 'react-router-dom';

import './index.css';
import {  Button } from '@material-ui/core';

var db = FirebaseApp.firestore();

const InterestsDetail = (props) => {

    const [isLoading, setLoading] = useState(true);

    const [name, setName] = useState('');

    const [isError, setError] = useState(false);

    const {history} = props;

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    const getData = () => {
        var docref = db.collection(CONSTANTS.INTERESTS).doc(props.match.params.id);
        docref.get().then(function(doc) {
            setLoading(false);
            setName(doc.data().name);
        }).catch(function(error) {
            setLoading(false);
            setError(true);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (window.confirm("Are you sure you want to delete this interest?")) {
            var docref = db.collection(CONSTANTS.INTERESTS).doc(props.match.params.id);
            docref.delete().then(function() {
                history.push('/interests');
            }).catch(function(error) {
                console.error("Error deleting document: ", error);
            });
        } else {
            return;
        } 
    };

    const handleChange = (event) => {
        setName(event.target.value);
    }

    return (
        <NavigationDrawer title="interests_detail">
            {isLoading ? <h5>Loading...</h5> : (isError ? <h5>Error.! No Document Found!</h5> : <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Row>
                <Col>
                <TextField id="outlined-basic" label="Interest" variant="outlined" value={name} onChange={handleChange}/> </Col>
                </Row>
                <Row style={{marginTop:"1.5rem"}}>
                <Col><Button type= "submit" variant="contained" color="secondary">Delete</Button></Col>
                </Row>
            </form> )
            }
        </NavigationDrawer>
    )
}

export default withRouter(InterestsDetail);
