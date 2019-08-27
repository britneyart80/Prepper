import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
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
      .catch(console.error)
  }

  render () {
    const { weeks } = this.state
    if (weeks.length) {
      const buttonJsx = (
        <React.Fragment>
          <Button onClick={this.createPlan} user={this.props.user}>Create a Plan</Button>
        </React.Fragment>
      )
      const plans = weeks.slice(0).reverse().filter(week => week.owner === this.props.user._id).map(week => (
        <ListGroup.Item key={week._id} as="a" action variant="light" href={`#weeks/${week._id}`}>
          {week.name}
        </ListGroup.Item>
      ))
      return (
        <React.Fragment>
          {buttonJsx}
          <h1> Your Weekly Meal Plans </h1>
          {plans}
        </React.Fragment>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Weeks)
