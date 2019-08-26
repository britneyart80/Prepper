import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const RecipeForm = ({ recipe, handleChange, handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="name">
      <Form.Label>Recipe Title</Form.Label>
      <Form.Control
        name="name"
        type="text"
        placeholder="Enter recipe name"
        value={recipe.name}
        onChange={handleChange}
      />
    </Form.Group>

    <Form.Group controlId="description">
      <Form.Label>Description</Form.Label>
      <Form.Control
        name="description"
        type="text"
        placeholder="Enter recipe description"
        value={recipe.description}
        onChange={handleChange}
      />
    </Form.Group>
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </Form>
)

export default RecipeForm
