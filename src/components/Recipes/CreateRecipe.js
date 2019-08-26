import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import RecipeForm from './RecipeForm'

class CreateRecipe extends Component {
  state = {
    recipe: {
      name: '',
      description: ''
    }
  }

  handleChange = event => {
    this.setState({
      recipe: {
        ...this.state.recipe,
        [event.target.name]: event.target.value
      }
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    axios({
      method: 'POST',
      url: `${apiUrl}/recipes`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        recipe: this.state.recipe
      }
    })
      .then(res => {
        this.props.alert({
          heading: 'Success!',
          message: 'You created a recipe!',
          variant: 'success'
        })
        return res
      })
      .then((res) => this.props.history.push(`/recipes/${res.data.recipe._id}`))
      .catch(console.error)
  }

  render () {
    return (
      <RecipeForm
        recipe={this.state.recipe}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}

export default withRouter(CreateRecipe)
