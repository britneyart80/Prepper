import React, { Component } from 'react'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'

class WeekdayRecipe extends Component {
  constructor () {
    super()

    this.state = {
      recipe: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/recipes/${this.props.id}`)
      this.setState({ recipe: res.data.recipe })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const { recipe } = this.state
    if (recipe) {
      return (
        <div>
          <h3> {recipe.name} </h3>
          <h4> {recipe.description} </h4>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default WeekdayRecipe
