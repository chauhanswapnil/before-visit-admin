import React, { useEffect } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { TextField, RadioGroup, Radio } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as CONSTANTS from '../../constants/constants';

const db = FirebaseApp.firestore();
const storage = FirebaseApp.storage();
var storageRef = storage.ref();


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
}));

const AddCategoryPage = (props) => {

    const {history} = props;

    const [value, setValue] = React.useState('Yes');

    const [image_url, setImageUrl] = React.useState('');

    const [category_name, setCategoryName] = React.useState('');

    const [isLoading, setLoading] = React.useState(false);

    const [isError, setError] = React.useState(false);

    const [isDeleting, setDeleting] = React.useState(false);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading])

    const getData = () => {
        var docref = db.collection(CONSTANTS.CATEGORIES).doc(props.match.params.id);
        docref.get().then(function(doc) {
            setLoading(false);
            setCategoryName(doc.data().name);
            if (doc.data().is_home) {
                setValue("Yes");
            } else {
                setValue("No");
            }
            setImageUrl(doc.data().icon_url);
        }).catch(function(error) {
            setLoading(false);
            setError(true);
        });
    }


    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (window.confirm("Places associated with this category will no longer have any category. Are you sure you want to delete it?")) {
            setDeleting(true);

            db.collection(CONSTANTS.PLACES).where(CONSTANTS.PLACES_CATEGORY_ID, "==",props.match.params.id).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    doc.ref.update({
                        category_id: ''
                    }).then(function() {

                    }).catch(function(error) {
                        setDeleting(false);
                        alert('Error Updating Places:', error);
                    });
                });
                var docref = db.collection(CONSTANTS.CATEGORIES).doc(props.match.params.id);

                docref.delete().then(function() {
                    setDeleting(false);
                    history.push('/categories');
                }).catch(function(error) {
                    setDeleting(false);
                    alert('Error deleting document:', error);
                });
            }).catch(function(error) {
                setDeleting(false);
                alert('Error Getting Places to update', error);
            });
        } else {
            return;
        }
    }

    return (
        <NavigationDrawer>

            {isDeleting ? <h5>Deleting Category...</h5> : (isLoading ? <h5>Loading..</h5> : (isError ?  <h5>Error.! No Document Found!</h5> :<div className="text-center">
                <form onSubmit={handleFormSubmit}>

                    <div style={{marginBottom:"2rem"}}>
                    <TextField id="outlined-basic" label="Category Name" disabled variant="outlined" placeholder="Ex. Apparel" value={category_name}/>
                    </div>

                    <div style={{marginBottom:"2rem"}}>
                        <FormControl component="fieldset">
                        <FormLabel component="legend">On Home Page?</FormLabel>
                        <RadioGroup aria-label="isHome" name="isHome" value={value} disabled>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        </FormControl>
                    </div>
                    <div style={{marginBottom:"2rem"}}><h6>Category Image</h6><img src={image_url} style={{backgroundColor:"black"}}alt="category"/></div>
                    <div><Button type= "submit" variant="contained" color="secondary">Delete</Button></div>
                </form>
            </div>))}
            
        </NavigationDrawer>
    )
}

export default AddCategoryPage;
