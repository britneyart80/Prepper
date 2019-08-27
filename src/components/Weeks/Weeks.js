import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import ListGroup from 'react-bootstrap/ListGroup'
import moment from 'moment'

class Weeks extends Component {
  constructor () {
    super()

    this.state = {
      weeks: []
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks`)
      return this.setState({ weeks: res.data.weeks })
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const weeks = this.state.weeks
    if (weeks.length) {
      return weeks.slice(0).reverse().filter(week => week.owner === this.props.user._id).map(week => (
        <ListGroup.Item key={week._id} as="a" action variant="light" href={`#weeks/${week._id}`}>
          Week of: {moment(week.weekOf).format('YYYY-DD-MM')}
        </ListGroup.Item>
      ))
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Weeks)
