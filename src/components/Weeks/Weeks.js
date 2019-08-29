import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import moment from 'moment'

class Weeks extends Component {
  constructor () {
    super()

    this.state = {
      weeks: [],
      week: null
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks`)
      this.setState({ weeks: res.data.weeks, week: { name: (moment(new Date()).format('YYYY-DD-MM')), owner: this.props.user._id } })
    } catch (error) {
      console.error(error)
    }
  }

  createPlan = () => {
    axios({
      method: 'POST',
      url: `${apiUrl}/weeks`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        week: this.state.week
      }
    })
      .then(res => {
        this.props.alert({
          heading: 'Success!',
          message: 'You created a new Plan!',
          variant: 'success'
        })
        return res
      })
      .then((res) => this.props.history.push(`/weeks/${res.data.week._id}`))
      .catch(error => {
        console.error(error)
        this.setState({ email: '', password: '' })
        alert({
          heading: 'An Error occured',
          message: 'Please try again',
          variant: 'danger'
        })
      })
  }

  render () {
    const { weeks } = this.state
    const buttonJsx = (
      <React.Fragment>
        <Button onClick={this.createPlan} user={this.props.user}>Create a Plan</Button>
      </React.Fragment>
    )
    if (weeks.length) {
      const myPlans = weeks.slice(0).reverse().filter(week => week.owner === this.props.user._id)
      const plans = myPlans.length ? myPlans.map(week => (
        <ListGroup.Item key={week._id} as="a" action variant="light" href={`#weeks/${week._id}`}>
          {week.name}
        </ListGroup.Item>
      )) : <p> You have no plans! </p>
      return (
        <React.Fragment>
          {buttonJsx}
          <h1> Your Weekly Meal Plans </h1>
          {plans}
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        { buttonJsx }
        <p> You have no plans yet! </p>
      </React.Fragment>
    )
  }
}

export default withRouter(Weeks)
