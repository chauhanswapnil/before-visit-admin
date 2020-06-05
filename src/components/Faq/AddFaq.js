import React, { useState } from 'react';
import FirebaseApp from '../Firebase/base';
import NavigationDrawer from '../Navigation';
import { InputGroup, FormControl, Form, Button } from 'react-bootstrap';

const db = FirebaseApp.firestore();

const AddFaq = (props) => {
	const [ answer, setAnswer ] = useState('');
	const [ question, setQuestion ] = useState('');
	const [ isLoading, setLoading ] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		db
			.collection('faq')
			.doc()
			.set({
				answer       : answer,
				question     : question,
				date_created : new Date()
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

	return (
		<NavigationDrawer>
			{isLoading ? (
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

					<Button variant="primary" className="u-margin-med" type="submit">
						Add FAQ
					</Button>
				</form>
			)}
		</NavigationDrawer>
	);
};

export default AddFaq;
