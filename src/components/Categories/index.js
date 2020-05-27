import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { Button, Grid } from '@material-ui/core';

import * as ROUTES from '../../constants/routes';
import * as CONSTANTS from '../../constants/constants';
import CategoryTable from './CategoryTable';


var db = FirebaseApp.firestore();

const CategoriesPage = (props) => {

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])
    

    const columns = [
        { id: 'name', label: 'Interest', minWidth: 120, align: 'center' },
        { id: 'is_home', label: 'Is Home?', minWidth: 120, align: 'center' },
        { id: 'icon_url', label: 'Icon', minWidth: 120, align: 'center' },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  },
        { id: 'doc_id', label: 'Document ID', minWidth: 120, align: 'center' }
      ];
    
    const [rows, setRows] = useState([]);

    function createData( name, is_home, icon_url, date_created, doc_id ) {
        return {name, is_home, icon_url, date_created, doc_id };
    }

    const getData = () => {
        var unsubscribe = db.collection(CONSTANTS.CATEGORIES).orderBy(CONSTANTS.CATEGORIES_DATE_CREATED,"desc").onSnapshot((querySnapshot) => {
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
                var is_home_bool = checkForNullorUndefined(data.is_home);
                var icon_url = checkForNullorUndefined(data.icon_url);
                var date_created = checkForNullorUndefined(data.date_created); 
                var doc_id = doc.id;

                var is_home = "";

                if (is_home_bool === true) {
                    is_home = "Yes";
                }
                if (is_home_bool === false) {
                    is_home = "No"
                }
                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                }
                rows1.push(createData(
                    name,
                    is_home,
                    icon_url,
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

    return (
        <NavigationDrawer>

            <Button variant="contained" color="primary" style={{marginBottom:"2rem"}} onClick={()=> props.history.push(ROUTES.CATEGORIES_ADD)}>Add Category</Button>

            <Grid item xs={12}>
                <CategoryTable columns={columns} rows={rows}/>
            </Grid>
        </NavigationDrawer>
    )
}

export default CategoriesPage;
