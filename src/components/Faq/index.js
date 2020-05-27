import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Grid, Button } from '@material-ui/core';
import FaqTable from './FaqTable';

import * as ROUTES from '../../constants/routes';

var db = FirebaseApp.firestore();

const FaqPage = (props) => {

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
    

    const columns = [
        { id: 'question', label: 'Question', minWidth: 120, align: 'center' },
        { id: 'answer', label: 'Answer', minWidth: 120, align: 'center' },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  },
        { id: 'docid', label: 'Document ID', minWidth: 120, align: 'center' }
      ];
    
    const [rows, setRows] = useState([]);

    function createData( question, answer, date_created , docid) {
        return {question, answer, date_created , docid};
    }

    const getData = () => {
        var unsubscribe = db.collection("faq").orderBy("date_created","desc").onSnapshot((querySnapshot) => {
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
                var question = checkForNullorUndefined(data.question);
                var answer = checkForNullorUndefined(data.answer); 
                var date_created = checkForNullorUndefined(data.date_created);
                var docid = doc.id;

                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                    console.log(dc_date);
                }
                rows1.push(createData(
                    question, 
                    answer, 
                    dc_date,
                    docid
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

    return (
        <NavigationDrawer>
            <Button variant="contained" color="primary" style={{marginBottom:"2rem"}} onClick={()=> props.history.push(ROUTES.FAQ_ADD)}>Add FAQ</Button>
            <Grid item xs={12}>
                <FaqTable columns={columns} rows={rows}/>
            </Grid>
        </NavigationDrawer>

    )
}

export default FaqPage;
