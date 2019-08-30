import React, { Component } from 'react'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import cart from './../../images/shopping-cart.png'

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
      this.props.alert({
        heading: 'An Error occured',
        message: 'Please try again later',
        variant: 'danger'
      })
    }
  }

  toggleDescription = () => {
    this.setState({ fullDescription: !this.state.fullDescription })
  }

  addToCart = (event) => {
    event.preventDefault()
    const updated = this.state.cart.ingredients
    updated.push(event.target.dataset.id)
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
      .catch(() => {
        this.props.alert({
          heading: 'An Error occured',
          message: 'Failed to add an ingredient',
          variant: 'danger'
        })
      })
    this.props.alert({
      heading: 'Success!',
      message: 'Added to Shopping List!',
      variant: 'success'
    })
  }

  render () {
    const { recipe, fullDescription } = this.state
    if (recipe) {
      let desc = (<h4 className='recipe-description'> {(recipe.description).substring(0, 150)} <span>...(click for more)</span> </h4>)
      if (fullDescription) {
        desc = (
          <React.Fragment>
            <h4> {recipe.description} </h4>
            { recipe.ingredients.map(ingredient => (
              <li key={ingredient._id}> {`${ingredient.name}, ${ingredient.amount} ${ingredient.amount > 1 ? ingredient.unit + 's' : ingredient.unit}`}
                <img className='recipe-btn' onClick={this.addToCart} data-id={ingredient._id} src={cart}/>
              </li>
            )) }
          </React.Fragment>
        )
      }
      return (
        <div className='weekday-recipe m-2'>
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
