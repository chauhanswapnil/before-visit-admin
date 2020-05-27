import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import InterestsTable from './InterestsTable';
import * as CONSTANTS from '../../constants/constants';
import { Container, Row, Col } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import './index.css';
import { Grid, Button } from '@material-ui/core';

var db = FirebaseApp.firestore();

const InterestsPage = () => {

    const [isLoading, setLoading] = useState(true);

    const [newName, setNewName] = useState('');

    const [newLoading, setNewLoading] = useState(false);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
    

    const columns = [
        { id: 'name', label: 'Interest', minWidth: 120, align: 'center' },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  },
        { id: 'doc_id', label: 'Document ID', minWidth: 120, align: 'center' }
      ];
    
    const [rows, setRows] = useState([]);

    function createData( name, date_created , doc_id) {
        return {name, date_created, doc_id };
    }

    const getData = () => {
        var unsubscribe = db.collection(CONSTANTS.INTERESTS).orderBy(CONSTANTS.INTERESTS_DATE_CREATED,"desc").onSnapshot((querySnapshot) => {
            handleQuery(querySnapshot);
        }, (error) => {
            alert(error);
        });

        return () => unsubscribe();
    };

    const handleQuery = (querySnapshot) => {
        setLoading(false);
            const rows1 = [];

            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                var name = checkForNullorUndefined(data.name);
                var date_created = checkForNullorUndefined(data.date_created); 
                var doc_id = doc.id;

                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                    console.log(dc_date);
                }
                rows1.push(createData(
                    name,
                    dc_date,
                    doc_id
                    ));                
            });
            setRows(rows1);
    }

    const checkForNullorUndefined = (value) => {
        if(value !== undefined && value !== null) {
            return value;
        } else {
            return '';
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var docref = db.collection(CONSTANTS.INTERESTS).doc();
        setNewLoading(true);
        docref.set({
            name: newName,
            date_created: new Date()
        })
        .then(function() {
            setNewLoading(false);
            setNewName('');
            alert("Successfully Added!");
        })
        .catch(function(error) {
            setNewLoading(false);
            alert("Error Adding document: ", error);
        });

    };

    const handleChange = (event) => {
        setNewName(event.target.value);
    }

    return (
        <NavigationDrawer title="interests_page">
            <Grid item xs={12}>
                <InterestsTable columns={columns} rows={rows}/>
            </Grid>
            <div style={{marginTop:"2rem"}}>

                {newLoading ? <h5>Adding Data..!</h5> : 
                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Row>
                    <Col>
                    <TextField id="outlined-basic" label="Interest" variant="outlined" value={newName} onChange={handleChange}/> </Col>
                    </Row>
                    <Row style={{marginTop:"1.5rem"}}>
                    <Col><Button type= "submit" variant="contained" color="primary">Add</Button></Col>
                    </Row>
                </form> 
                }
                
            </div>

        </NavigationDrawer>
    )

}

export default InterestsPage;
