import React, { useEffect, useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';

const db = FirebaseApp.firestore();

const FaqDetail = (props) => {
	const [ answer, setAnswer ] = useState('');
	const [ question, setQuestion ] = useState('');
	const [ isLoading, setLoading ] = useState(true);
	const [ isError, setError ] = useState(false);

	useEffect(
		() => {
			console.log('In use effect');
			getData();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ isLoading ]
	);

	const getData = () => {
		db
			.collection('faq')
			.doc(props.match.params.id)
			.get()
			.then(function(doc) {
				setLoading(false);
				setAnswer(doc.data().answer);
				setQuestion(doc.data().question);
			})
			.catch(function(error) {
				setLoading(false);
				setError(true);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		setLoading(true);

		db
			.collection('faq')
			.doc(props.match.params.id)
			.update({
				answer   : answer,
				question : question
			})
			.then(() => {
				setLoading(false);
				props.history.push('/faq');
			})
			.catch((error) => {
				setLoading(false);
				alert('Error Adding FAQ', error);
			});
	};

	const handleDelete = (e) => {
		e.preventDefault();
		if (window.confirm('Are you sure you want to delete it?')) {
			var docref = db.collection('faq').doc(props.match.params.id);
			docref
				.delete()
				.then(function() {
					props.history.push('/faq');
				})
				.catch(function(error) {
					setError(true);
					alert('Error deleting document:', error);
				});
		}
		else {
			return;
		}
	};

	return (
		<NavigationDrawer>
			{isError ? (
				<h5>ERROR. Something went wrong..!</h5>
			) : isLoading ? (
				<h5>Loading...</h5>
			) : (
				<form onSubmit={handleSubmit}>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
								Question
							</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							aria-label="Question"
							aria-describedby="inputGroup-sizing-default"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
					</InputGroup>

					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text className="bgblue" id="inputGroup-sizing-default">
								Answer
							</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Group controlId="Answer.ControlTextarea1">
							<Form.Control
								as="textarea"
								rows="3"
								value={answer}
								onChange={(e) => setAnswer(e.target.value)}
							/>
						</Form.Group>
					</InputGroup>

					<Button variant="primary" type="submit">
						Update
					</Button>
					<div>
						<h6>OR</h6>
					</div>
					<Button variant="danger" color="secondary" onClick={handleDelete}>
						Delete
					</Button>
				</form>
			)}
		</NavigationDrawer>
	);
};

export default FaqDetail;
