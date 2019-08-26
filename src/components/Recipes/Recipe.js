import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

class Recipe extends Component {
  constructor () {
    super()

    this.state = {
      recipe: null
    }
  }

  async componentDidMount () {
    console.log('i got here')
    try {
      const res = await axios(`${apiUrl}/recipes/${this.props.match.params.id}`)
      this.setState({ recipe: res.data.recipe })
    } catch (error) {
      console.error(error)
    }
  }

  deleteRecipe = () => {
    event.preventDefault()
    axios.delete(`${apiUrl}/recipes/${this.state.recipe._id}`,
      {
        headers: {
          'Authorization': `Bearer ${this.props.user.token}`
        },
        data: {
          recipe: this.state.recipe
        }
      })
      .then(() => (
        this.props.history.push('/recipes')
      ))
  }

  render () {
    const { recipe } = this.state

    if (recipe) {
      const buttonJsx = (
        <React.Fragment>
          <Button href={`#recipes/${recipe._id}/edit`} user={this.props.user}>Edit Recipe</Button>
          <Button onClick={this.deleteRecipe}>Delete Recipe</Button>
        </React.Fragment>
      )
      return (
        <div>
          <h2> {recipe.name} </h2>
          <h4> {recipe.description} </h4>
          {this.props.user && recipe && this.props.user._id === recipe.owner ? buttonJsx : ''}
          <Button href={'#recipes'}>Return to Recipes</Button>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Recipe)
