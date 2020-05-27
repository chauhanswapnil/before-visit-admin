import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Grid, Button } from '@material-ui/core';
import IssuesTable from './IssuesTable';

var db = FirebaseApp.firestore();

const IssuesPage = () => {

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
    

    const columns = [
        { id: 'name', label: 'Name', minWidth: 120, align: 'center' },
        { id: 'description', label: 'Description', minWidth: 120, align: 'center' },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  },
        { id: 'userid', label: 'User ID', minWidth: 120, align: 'center' },
        { id: 'docid', label: 'Document ID', minWidth: 120, align: 'center' }
      ];
    
    const [rows, setRows] = useState([]);

    function createData( name, description, date_created , userid, docid) {
        return {name, description, date_created , userid, docid };
    }

    const getData = () => {
        var unsubscribe = db.collection("issues_reported").orderBy("date_created","desc").onSnapshot((querySnapshot) => {
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
                var userid = checkForNullorUndefined(data.userid);
                var description = checkForNullorUndefined(data.description);
                var doc_id = doc.id;

                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                    console.log(dc_date);
                }
                rows1.push(createData(
                    name,
                    description,
                    dc_date,
                    userid,
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

    return (
        <NavigationDrawer>
            <Grid item xs={12}>
                <IssuesTable columns={columns} rows={rows}/>
            </Grid>
        </NavigationDrawer>

    )
}

export default IssuesPage;
