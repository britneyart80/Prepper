import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import IngredientForm from './../Ingredients/IngredientForm'

class Recipe extends Component {
  constructor () {
    super()

    this.state = {
      recipe: null,
      adding: false,
      ingredients: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/recipes/${this.props.match.params.id}`)
      this.setState({ recipe: res.data.recipe, ingredients: res.data.recipe.ingredients })
    } catch (error) {
      this.props.alert({
        heading: 'An Error occured',
        message: 'Please try again later',
        variant: 'danger'
      })
    }
  }

  removeFromWeeks = async () => {
    const weeks = await axios(`${apiUrl}/weeks`)
    const myWeeks = weeks.data.weeks.filter(week => week.owner === this.props.user._id)
    const promises = []
    if (myWeeks) {
      myWeeks.forEach(week => {
        Object.keys(week).forEach(async key => {
          let array = week[key]
          if (Array.isArray(array)) {
            array = array.filter(recipeId => recipeId !== this.state.recipe._id)
          }
          if (array === this.state.recipe._id) {
            array = []
          }
          const promise = await axios({
            method: 'PATCH',
            url: `${apiUrl}/weeks/${week._id}`,
            headers: {
              'Authorization': `Bearer ${this.props.user.token}`
            },
            data: {
              week: {
                [key]: array
              }
            }
          })
          promises.push(promise)
        })
      })
      Promise.all(promises)
    }
  }

  deleteRecipe = async () => {
    event.preventDefault()
    const p1 = await axios.delete(`${apiUrl}/recipes/${this.state.recipe._id}`,
      {
        headers: {
          'Authorization': `Bearer ${this.props.user.token}`
        },
        data: {
          recipe: this.state.recipe
        }
      })
    const carts = await axios(`${apiUrl}/carts`)
    const cart = await carts.data.carts.find(cart => cart.owner === this.props.user._id)
    const inCart = cart.ingredients
    this.state.ingredients.forEach(ingredientId => {
      inCart.filter(i => ingredientId !== i)
    })
    const removed = await this.removeFromWeeks()

    Promise.all([p1, removed])
      .then(() => (
        this.props.history.push('/recipes')
      ))
  }

  addIngredient = () => {
    this.setState({ adding: true })
  }

  // for adding an ingredient
  handleSubmit = event => {
    event.preventDefault()
    const data = new FormData(event.target)
    const dataName = data.get('name')
    const dataUnit = data.get('unit')
    const dataAmount = data.get('amount')
    data.set('owner', this.props.user._id)
    data.set('recipe', this.state.recipe._id)
    axios({
      method: 'POST',
      url: `${apiUrl}/ingredients`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        ingredient: {
          name: dataName,
          unit: dataUnit,
          amount: dataAmount,
          owner: this.props.user._id,
          recipe: this.state.recipe._id
        }
      }
    })
      .then(res => {
        const updated = this.state.recipe.ingredients
        updated.push(res.data.ingredient)
        this.props.alert({
          heading: 'Success!',
          message: 'You added an ingredient',
          variant: 'success'
        })
        this.setState({ adding: false, ingredients: updated })
      })
      .catch(() => {
        this.props.alert({
          heading: 'An Error occured',
          message: 'Failed to add an ingredient',
          variant: 'danger'
        })
      })
  }

  deleteIngredient= (event) => {
    event.preventDefault()
    const updated = this.state.ingredients.filter(ingredient => ingredient._id !== event.target.id)
    axios({
      method: 'DELETE',
      url: `${apiUrl}/ingredients/${event.target.id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      }
    })
      .then(this.setState({ ingredients: updated }))
  }

  render () {
    const { recipe, adding, ingredients } = this.state

    if (recipe) {
      const ingredientForm = <IngredientForm
        handleSubmit={this.handleSubmit}
      />
      const buttonJsx = (
        <React.Fragment>
          <Button href={`#recipes/${recipe._id}/edit`} user={this.props.user}>Edit Recipe</Button>
          <Button onClick={this.deleteRecipe}>Delete Recipe</Button>
          <Button onClick={this.addIngredient}>Add Ingredient</Button>
        </React.Fragment>
      )
      const listItems = ingredients.map(ingredient => (
        <React.Fragment key={ingredient._id}>
          <li> {`${ingredient.name}, ${ingredient.amount} ${ingredient.amount > 1 ? ingredient.unit + 's' : ingredient.unit}`}
            <span className='delete-ingredient' onClick={this.deleteIngredient} id={ingredient._id}>X</span>
          </li>
        </React.Fragment>
      ))
      return (
        <div>
          <h2> {recipe.name} </h2>
          <h3> Ingredients: </h3>
          <ul>
            { listItems }
          </ul>
          {adding ? ingredientForm : ''}
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
