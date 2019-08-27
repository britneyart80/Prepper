import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner'

class RecipeDropdown extends Component {
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

  addRecipe = () => {
    console.log('added')
  }

  render () {
    const recipes = this.state.recipes
    if (recipes.length) {
      const listRecipes = recipes.map(recipe => (
        <Dropdown.Item key={recipe._id} onClick={this.props.addRecipe} id={recipe._id}>{recipe.name}</Dropdown.Item>
      ))
      return (
        <Dropdown>
          <Dropdown.Toggle variant='dark' id='dropdown-basic'>Add Recipes</Dropdown.Toggle>
          <Dropdown.Menu>
            { listRecipes }
          </Dropdown.Menu>
        </Dropdown>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(RecipeDropdown)
