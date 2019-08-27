import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import moment from 'moment'

class Week extends Component {
  constructor () {
    super()

    this.state = {
      week: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks/${this.props.match.params.id}`)
      console.log(res)
      this.setState({ week: res.data.week })
    } catch (error) {
      console.error(error)
    }
  }

  deleteWeek = () => {
    event.preventDefault()
    axios.delete(`${apiUrl}/weeks/${this.state.week._id}`,
      {
        headers: {
          'Authorization': `Bearer ${this.props.user.token}`
        },
        data: {
          week: this.state.week
        }
      })
      .then(() => (
        this.props.history.push('/weeks')
      ))
  }

  // getRecipes = () => {
  //   Object.keys(this.state.week).forEach(recipesKey => {
  //     const recipes
  //     (this.state.week[recipesKey]).forEach(async recipeId => {
  //       const res = await axios(`${apiUrl}/recipes/${recipeId}`)
  //     })
  //   })
  // }

  render () {
    const { week } = this.state

    if (week) {
      const buttonJsx = (
        <React.Fragment>
          <Button href={`#weeks/${week._id}/edit`} user={this.props.user}>Edit Week</Button>
          <Button onClick={this.deleteWeek}>Delete Week</Button>
        </React.Fragment>
      )
      const orderedDays = [week['mon'], week['tues'], week['weds'], week['thurs'], week['fri'], week['sat'], week['sun']]
      return (
        <div>
          <h2>{moment(week.weekOf).format('YYYY-DD-MM')}</h2>
          {this.props.user && week && this.props.user._id === week.owner ? buttonJsx : ''}
          {orderedDays.forEach(recipes => {
            recipes.forEach(recipeId => {
              const recipe = this.getRecipe(recipeId)
              console.log(recipe)
            })
          })}
          <Button href={'#weeks'}>Return to Weeks</Button>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Week)
