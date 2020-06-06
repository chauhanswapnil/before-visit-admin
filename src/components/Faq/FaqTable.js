import React from 'react';
import MaterialTable from 'material-table';
import { withRouter } from 'react-router-dom';

// const useStyles = makeStyles({
// 	root      : {
// 		width : '100%'
// 	},
// 	container : {
// 		maxHeight : 440
// 	}
// });

// const FaqTable = (props) => {
// 	const { rows, columns, history } = props;
// 	const classes = useStyles();
// 	const [ page, setPage ] = React.useState(0);
// 	const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
// 	const handleChangePage = (event, newPage) => {
// 		setPage(newPage);
// 	};

// 	const handleChangeRowsPerPage = (event) => {
// 		setRowsPerPage(+event.target.value);
// 		setPage(0);
// 	};

// 	return (
// 		<Paper className={classes.root}>
// 			<TableContainer className={classes.container}>
// 				<Table stickyHeader aria-label="sticky table">
// 					<TableHead>
// 						<TableRow>
// 							{columns.map((column) => (
// 								<TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
// 									{column.label}
// 								</TableCell>
// 							))}
// 						</TableRow>
// 					</TableHead>
// 					<TableBody>
// 						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
// 							return (
// 								<TableRow
// 									hover
// 									role="checkbox"
// 									tabIndex={-1}
// 									key={row.code}
// 									onClick={() => {
// 										history.push(`/faq/${row.docid}`);
// 									}}>
// 									{columns.map((column) => {
// 										const value = row[column.id];
// 										return (
// 											<TableCell key={column.id} align={column.align}>
// 												{column.format && typeof value === 'number' ? (
// 													column.format(value)
// 												) : (
// 													value
// 												)}
// 											</TableCell>
// 										);
// 									})}
// 								</TableRow>
// 							);
// 						})}
// 					</TableBody>
// 				</Table>
// 			</TableContainer>
// 			<TablePagination
// 				rowsPerPageOptions={[ 1, 10, 25, 100 ]}
// 				component="div"
// 				count={rows.length}
// 				rowsPerPage={rowsPerPage}
// 				page={page}
// 				onChangePage={handleChangePage}
// 				onChangeRowsPerPage={handleChangeRowsPerPage}
// 			/>
// 		</Paper>
// 	);
// };
// export default withRouter(FaqTable);

const FaqTable = (props) => {
	const { rows, columns, history } = props
  
	return (
	  <MaterialTable
		title=""
		columns={columns}
		data={rows}
	    actions={[
	  	{
	  	  icon: 'edit',
	  	  tooltip: 'Edit FAQ',
	  	  onClick: (event, rowData) => history.push(`/faq/${rowData.docid}`)
	  	}
		]}
		options={{
			pageSizeOptions : [10, 50, 100, 200, 1000]
		}}
	  />
	);
  }
  
export default withRouter(FaqTable);
  