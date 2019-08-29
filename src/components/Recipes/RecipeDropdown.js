import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Dropdown from 'react-bootstrap/Dropdown'

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
      const myRecipes = res.data.recipes.filter(recipe => recipe.owner === this.props.user._id)
      return this.setState({ recipes: myRecipes })
    } catch (error) {
      console.error(error)
    }
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
      <Dropdown>
        <Dropdown.Toggle variant='dark' id='dropdown-basic'>Add Recipes</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item >No Recipes yet</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default withRouter(RecipeDropdown)
