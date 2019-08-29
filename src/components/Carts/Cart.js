import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import axios from 'axios'
import apiUrl from './../../apiConfig'

class Cart extends Component {
  constructor () {
    super()

    this.state = {
      hash: null,
      ingredients: null,
      cart: null
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
                myHash[ingredient.name] = { ingredients: [ingredient], unit: ingredient.unit }
              } else {
                myHash[ingredient.name].ingredients.push(ingredient)
              }
            })
          })
          .then(() => this.setState({ hash: myHash, ingredients: populated, cart: cart }))
      }
    } catch (error) {
      console.error(error)
    }
  }

  deleteAll = (event) => {
    event.preventDefault()
    const deleteKey = event.target.dataset.key
    const filtered = this.state.ingredients.filter(ingredient => ingredient.name !== deleteKey)
    const ids = filtered.slice(0).map(ingredient => ingredient._id)
    const newHash = this.state.hash
    delete newHash[deleteKey]
    console.log(newHash)
    axios({
      method: 'PATCH',
      url: `${apiUrl}/carts/${this.state.cart._id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        cart: {
          ingredients: ids
        }
      }
    })
      .then(this.setState({ hash: newHash, ingredients: filtered }))
      .catch(console.error)
  }

  render () {
    const { hash, ingredients } = this.state
    if (hash && ingredients.length) {
      const list = Object.keys(hash).map(key => {
        console.log(key)
        return (
          <Form.Group key={key} controlId="formBasicChecbox">
            <Form.Check
              data-key={key}
              onClick={this.deleteAll}
              type="checkbox"
              label={`${key}, ${hash[key].ingredients.length} ${hash[key].ingredients.length > 1 ? hash[key].unit + 's' : hash[key].unit}`} />
          </Form.Group>
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
