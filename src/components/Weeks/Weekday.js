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
      this.props.alert({
        heading: 'An Error occured',
        message: 'Please try again later',
        variant: 'danger'
      })
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

  addRecipe = async (event) => {
    event.preventDefault()
    const updated = this.state.weekday
    updated.push(event.target.id)
    await axios({
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
        this.props.alert({
          heading: 'Success!',
          message: 'You added a Recipe!',
          variant: 'success'
        })
        this.setState({ editing: false })
      })
      .catch(() => {
        this.props.alert({
          heading: 'An Error occured',
          message: 'Failed to add a recipe',
          variant: 'danger'
        })
      })
  }

  onDeleteRecipe = (event) => {
    event.preventDefault()
    const og = this.state.weekday
    const index = this.state.weekday.findIndex(id => id === event.target.id)
    og.splice(index, 1)
    const updated = og
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
      const buttonJsx = (
        <RecipeDropdown
          url={`${apiUrl}/weeks/${this.props.match.params.id}`}
          index={index}
          addRecipe={this.addRecipe}
          user={this.props.user}
        />
      )
      const recipes = weekday.map(recipeId => (
        <WeekdayRecipe user={this.props.user} key={recipeId + Math.random()} id={recipeId} alert={this.props.alert} onDeleteRecipe={this.onDeleteRecipe}/>
      ))

      const noRecipes = (
        <h6> You currently have no recipes added! </h6>
      )

      return (
        <div>
          <h2 className='subheader'> {days[index]} </h2>
          <div className='weekday-body d-flex'>
            <div className='col-3 weekday-btns d-flex flex-column justify-content-center'>
              {buttonJsx}
              <Button href={'#weeks/' + this.props.match.params.id}>Return to Weekly Plan</Button>
            </div>
            <div className='weekday-recipes col-8 d-flex justify-content-around'>
              {weekday.length > 0 ? recipes : noRecipes}
            </div>
          </div>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Weekday)
