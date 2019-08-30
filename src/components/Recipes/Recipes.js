import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
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
      this.props.alert({
        heading: 'An Error occured',
        message: 'Please try again later',
        variant: 'danger'
      })
    }
  }

  render () {
    const recipes = this.state.recipes
    const buttonJsx = (
      <React.Fragment>
        <Button href='#create-recipe' user={this.props.user}>Create a Recipe</Button>
      </React.Fragment>
    )
    if (recipes.length) {
      const myRecipes = recipes.filter(week => week.owner === this.props.user._id)
      const listRecipes = myRecipes.length ? myRecipes.map(recipe => (
        <ListGroup.Item key={recipe._id} as="a" action variant="light" href={`#recipes/${recipe._id}`}>
          {recipe.name}
        </ListGroup.Item>
      )) : <p> You have no recipes! </p>
      return (
        <React.Fragment>
          { buttonJsx }
          <h1>Your Recipes</h1>
          { listRecipes }
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        { buttonJsx }
        <p> You have no plans yet! </p>
      </React.Fragment>
    )
  }
}

export default withRouter(Recipes)
