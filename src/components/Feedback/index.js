import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Grid, Button } from '@material-ui/core';
import FeedbackTable from './FeedbackTable';

var db = FirebaseApp.firestore();

const FeedbackPage = () => {

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
    

    const columns = [
        { id: 'name', label: 'Name', minWidth: 120, align: 'center' },
        { id: 'rating', label: 'Rating', minWidth: 120, align: 'center' },
        { id: 'review', label: 'Review', minWidth: 120, align: 'center'  },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  },
        { id: 'userid', label: 'User ID', minWidth: 120, align: 'center' },
        { id: 'docid', label: 'Document ID', minWidth: 120, align: 'center' }
      ];
    
    const [rows, setRows] = useState([]);

    function createData( name, rating, review, date_created , userid, docid) {
        return {name, rating, review, date_created , userid, docid};
    }

    const getData = () => {
        var unsubscribe = db.collection("feedback").orderBy("date_created","desc").onSnapshot((querySnapshot) => {
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
                var rating = checkForNullorUndefined(data.rating); 
                var review = checkForNullorUndefined(data.review);
                var date_created = checkForNullorUndefined(data.date_created);
                var userid = checkForNullorUndefined(data.userid);
                var docid = doc.id;

                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                    console.log(dc_date);
                }
                rows1.push(createData(
                    name, 
                    rating, 
                    review, 
                    dc_date,
                    userid,
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
            <Grid item xs={12}>
                <FeedbackTable columns={columns} rows={rows}/>
            </Grid>
        </NavigationDrawer>

    )
}

export default FeedbackPage;
