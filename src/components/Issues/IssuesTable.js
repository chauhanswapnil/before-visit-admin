import React from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';
import FirebaseApp from '../Firebase/base';

var db = FirebaseApp.firestore();

const ReviewsTable = (props) => {
	const { rows, columns, title } = props;
	
	return (
	  <MaterialTable
		title={title}
		columns={columns}
		data={rows}
	    actions={[
	  	{
	  	  icon: 'save',
	  	  tooltip: 'Change Issue Status',
	  	  onClick: (event, rowData) => {
			if (window.confirm('Are you sure you want to change the status of this issue?')) { 
				db.collection("issues_reported").doc(rowData.docid).update({
					is_hidden: !rowData.is_hidden
				}).then(() => {
					alert("Successfully Updated the Issue..!");
				}).catch((error) => {
					alert("Updating Issue Failed with error", error);
				})
			}
			}
	  	}
	    ]}
		  options={{
			  pageSizeOptions : [10, 50, 100, 200, 1000]
		  }}
	  />
	);
  }
  
  export default withRouter(ReviewsTable);
  