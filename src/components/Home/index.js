import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import {Row, Col, Container} from 'react-bootstrap';
import UsersTable from '../Users/UsersTable';
import { Grid } from '@material-ui/core';

import * as CONSTANTS from '../../constants/constants';

var db = FirebaseApp.firestore();

const HomePage = () => {

    const [newUsersToday, setNewUsersToday] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        console.log("In use effect");
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = [
        { id: 'name', label: 'Name', minWidth: 120, align: 'center' },
        { id: 'email', label: 'Email', minWidth: 120, align: 'center'  },
        { id: 'mobile', label: 'Phone', minWidth: 120 , align: 'center' },
        { id: 'gender', label: 'Gender', minWidth: 120 , align: 'center' },
        { id: 'interests', label: 'Interests', minWidth: 120 , align: 'center' },
        { id: 'dob', label: 'Date of Birth', minWidth: 120 , align: 'center' },
        { id: 'address', label: 'Address', minWidth: 120, align: 'center'  },
        { id: 'notifpref', label: 'Notification Pref', minWidth: 120 , align: 'center' },
        { id: 'date_created', label: 'Date Created', minWidth: 120, align: 'center'  }
      ];

    function createData(name, email, mobile, gender, interests, dob, address, notifpref, date_created) {
        return { name, email, mobile, gender, interests, dob, address, notifpref, date_created };
    }

    const getData = () => {
        var unsubscribe = db.collection(CONSTANTS.USERS).orderBy(CONSTANTS.USERS_DATE_CREATED,"desc").onSnapshot((querySnapshot) => {
            handleQuery(querySnapshot);
        }, (error) => {
            alert(error);
        });
        return () => unsubscribe();
    };

    const handleQuery = (querySnapshot) => {
            setTotalUsers(querySnapshot.docs.length);
            const rows1 = [];
            var today_users_count = 0;

            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                var name = checkForNullorUndefined(data.name);
                var email = checkForNullorUndefined(data.email);
                var mobile_no = checkForNullorUndefined(data.mobile_no);
                var gender = checkForNullorUndefined(data.gender);
                var interests = checkForNullorUndefined(data.interests);
                var dob = checkForNullorUndefined(data.dob);
                var address = checkForNullorUndefined(data.address);
                var notification_pref = checkForNullorUndefined(data.notification_pref);
                var date_created = checkForNullorUndefined(data.date_created);

                if (dob !== '') { var dob_date = doc.data().dob.toDate().toLocaleDateString("en-IN"); }
                if (interests !== '') {
                    var interests_string = "";
                    interests.forEach((interest) => {
                        interests_string = interests_string + " " + interest;
                    });
                }

                if (date_created !== '') { 
                    var dc_date = doc.data().date_created.toDate().toLocaleDateString("en-IN"); 
                    var today = new Date().toLocaleDateString("en-IN");
                    if (today === dc_date) {
                        today_users_count = today_users_count + 1;
                        rows1.push(createData(
                            name,
                            email,
                            mobile_no,
                            gender,
                            interests_string,
                            dob_date,
                            address,
                            notification_pref,
                            dc_date
                        ));
                    }
                }
            });
            setNewUsersToday(today_users_count);
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
            <Container>
                <Row>
                    <Col lg={6} className="text-center">
                        <div className="top-box">
                            <h3>New Users Today</h3>
                            <h4>{newUsersToday}</h4>
                        </div>
                    </Col>
                    <Col lg={6} className="text-center">
                        <div className="top-box">
                            <h3>Total Users</h3>
                            <h4>{totalUsers}</h4>
                        </div>
                    </Col>
                </Row>
            </Container>
            <h5>New Users Today</h5>
            <Grid item xs={12}>
                <UsersTable columns={columns} rows={rows}/>
            </Grid>
        </NavigationDrawer>
    )
}

export default HomePage;
