import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

class Recipes extends Component {
  constructor () {
    super()

    this.state = {
      recipes: []
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/recipes`)
      return this.setState({ recipes: res.data.recipes })
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const recipes = this.state.recipes
    if (recipes.length) {
      const buttonJsx = (
        <React.Fragment>
          <Button href='#create-recipe' user={this.props.user}>Create a Recipe</Button>
        </React.Fragment>
      )
      const listRecipes = recipes.map(recipe => (
        <ListGroup.Item key={recipe._id} as="a" action variant="light" href={`#recipes/${recipe._id}`}>
          {recipe.name}
        </ListGroup.Item>
      ))
      return (
        <React.Fragment>
          { buttonJsx }
          { listRecipes }
        </React.Fragment>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Recipes)
