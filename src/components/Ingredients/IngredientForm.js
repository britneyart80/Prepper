import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const IngredientForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="name">
      <Form.Label>Ingredient Name</Form.Label>
      <Form.Control
        name="name"
        type="text"
        placeholder="Enter ingredient name"
      />
    </Form.Group>

    <Form.Group controlId="amount">
      <Form.Label>Amount</Form.Label>
      <Form.Control
        name="amount"
        type="text"
        placeholder="Enter unit"
      />
    </Form.Group>

    <Form.Group controlId="unit">
      <Form.Label>Unit</Form.Label>
      <Form.Control
        name="unit"
        type="text"
        placeholder="Enter unit"
      />
    </Form.Group>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
)

export default IngredientForm
