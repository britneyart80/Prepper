import React, { Component } from 'react'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

class WeekdayRecipe extends Component {
  constructor () {
    super()

    this.state = {
      cart: null,
      recipe: null,
      fullDescription: false
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/recipes/${this.props.id}`)
      const cartRes = await axios(`${apiUrl}/carts`)
      const cart = cartRes.data.carts.find(cart => cart.owner === this.props.user._id)
      this.setState({ cart: cart, recipe: res.data.recipe })
    } catch (err) {
      console.error(err)
    }
  }

  toggleDescription = () => {
    this.setState({ fullDescription: !this.state.fullDescription })
  }

  addToCart = (event) => {
    event.preventDefault()
    const updated = this.state.cart.ingredients
    updated.push(event.target.ingredientid)
    console.log(updated)
    axios({
      method: 'PATCH',
      url: `${apiUrl}/carts/${this.state.cart._id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        cart: {
          ingredients: updated
        }
      }
    })
      .then(res => {
        console.log(res)
        this.props.alert({
          heading: 'Success!',
          message: 'You added an ingredient to your shopping list',
          variant: 'success'
        })
      })
      .catch(console.error)
  }

  render () {
    const { recipe, fullDescription, cart } = this.state
    if (recipe) {
      console.log(cart)
      let desc = (<h4> {(recipe.description).substring(0, 150) + ' ...'} </h4>)
      if (fullDescription) {
        desc = (
          <React.Fragment>
            <h4> {recipe.description} </h4>
            { recipe.ingredients.map(ingredient => (
              <li key={ingredient._id}> {`${ingredient.name}, ${ingredient.amount} ${ingredient.amount > 1 ? ingredient.unit + 's' : ingredient.unit}`}
                <Button onClick={this.addToCart} ingredientid={ingredient._id}> Add to Shopping Cart </Button>
              </li>
            )) }
          </React.Fragment>
        )
      }
      return (
        <div>
          <h3> {recipe.name} </h3>
          <div onClick={this.toggleDescription}>
            { desc }
          </div>
          <Button onClick={this.props.onDeleteRecipe} id={this.props.id}> Delete recipe </Button>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default WeekdayRecipe
