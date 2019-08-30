import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import RecipeForm from './RecipeForm'
import Spinner from 'react-bootstrap/Spinner'

class EditRecipe extends Component {
  state = {
    recipe: null
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/recipes/${this.props.match.params.id}`)
      this.setState({ recipe: res.data.recipe })
    } catch (error) {
      this.props.alert({
        heading: 'An Error occured',
        message: 'Please try again later',
        variant: 'danger'
      })
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
      method: 'PATCH',
      url: `${apiUrl}/recipes/${this.state.recipe._id}`,
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
          message: 'You edited your recipe!',
          variant: 'success'
        })
      })
      .then(this.props.history.push(`/recipes/${this.state.recipe._id}`))
      .catch(() => {
        this.props.alert({
          heading: 'An Error occured',
          message: 'Failed to edit recipe',
          variant: 'danger'
        })
      })
  }

  render () {
    const { recipe } = this.state

    if (recipe) {
      return (
        <RecipeForm
          recipe={this.state.recipe}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(EditRecipe)
