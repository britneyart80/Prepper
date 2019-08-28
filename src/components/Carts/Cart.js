import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
// import Button from 'react-bootstrap/Button'
// import IngredientForm from './../Ingredients/IngredientForm'

class Cart extends Component {
  constructor () {
    super()

    this.state = {
      hash: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/carts`)
      const cart = res.data.carts.find(cart => cart.owner === this.props.user._id)
      const populated = []
      const myHash = {}
      if (cart) {
        const promises = cart.ingredients.map(async ingredientId => {
          const res = await axios(`${apiUrl}/ingredients/${ingredientId}`)
          populated.push(res.data.ingredient)
        })

        Promise.all(promises)
          .then(() => {
            populated.forEach(ingredient => {
              if (!myHash[ingredient.name]) {
                myHash[ingredient.name] = { unit: ingredient.unit, total: ingredient.amount }
              } else {
                myHash[ingredient.name] = { unit: myHash[ingredient.name].unit, total: myHash[ingredient.name].total + ingredient.amount }
              }
            })
          })
          .then(() => this.setState({ hash: myHash }))
          .then(() => console.log(this.state.hash))
      }
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const { hash } = this.state
    if (hash) {
      const list = Object.keys(hash).map(key => {
        console.log(key)
        return (
          <li key={key}> {key}, {hash[key].total} {hash[key].total > 1 ? hash[key].unit + 's' : hash[key].unit} </li>
        )
      })
      return (
        <div>
          <h1>Your Shopping Cart</h1>
          <h3> compiled for you! </h3>
          <ul>
            {list}
          </ul>
        </div>
      )
    }
    return (
      <div>
        <h1>Your Shopping Cart</h1>
        <h3> compiled for you! </h3>
        <p> Your list is empty </p>
      </div>
    )
  }
}

export default withRouter(Cart)
