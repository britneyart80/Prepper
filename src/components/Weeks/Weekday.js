import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import WeekdayRecipe from './WeekdayRecipe'
import RecipeDropdown from './../Recipes/RecipeDropdown'

class Weekday extends Component {
  constructor () {
    super()

    this.state = {
      weekday: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks/${this.props.match.params.id}`)
      this.setState({ weekday: res.data.week[this.props.match.params.index] })
    } catch (error) {
      console.error(error)
    }
  }

  deleteWeek = () => {
    event.preventDefault()
    axios.delete(`${apiUrl}/weeks/${this.props.match.params.id}`,
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

  addRecipe = (event) => {
    event.preventDefault()
    const updated = this.state.weekday
    updated.push(event.target.id)
    axios({
      method: 'PATCH',
      url: `${apiUrl}/weeks/${this.props.match.params.id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        week: {
          [this.props.match.params.index]: updated
        }
      }
    })
      .then(res => {
        console.log(res)
        this.props.alert({
          heading: 'Success!',
          message: 'You added a Recipe!',
          variant: 'success'
        })
        this.setState({ editing: false })
      })
      .catch(console.error)
  }

  onDeleteRecipe = (event) => {
    event.preventDefault()
    console.log(event.target.id)
    const updated = this.state.weekday.filter(id => id !== event.target.id)
    this.setState({ weekday: updated })
    axios({
      method: 'PATCH',
      url: `${apiUrl}/weeks/${this.props.match.params.id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        week: {
          [this.props.match.params.index]: updated
        }
      }
    })
  }

  render () {
    const { weekday } = this.state
    const index = this.props.match.params.index
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if (weekday) {
      console.log(weekday)
      const buttonJsx = (
        <RecipeDropdown
          url={`${apiUrl}/weeks/${this.props.match.params.id}`}
          index={index}
          addRecipe={this.addRecipe}/>
      )
      const recipes = weekday.map(recipeId => (
        <WeekdayRecipe user={this.props.user} key={recipeId} id={recipeId} onDeleteRecipe={this.onDeleteRecipe}/>
      ))

      const noRecipes = (
        <h6> You currently have no recipes added! </h6>
      )

      return (
        <div>
          <h2> {days[index]} </h2>
          {weekday.length > 0 ? recipes : noRecipes}
          {buttonJsx}
          <Button href={'#weeks/' + this.props.match.params.id}>Return to Weekly Plan</Button>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Weekday)
