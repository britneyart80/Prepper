import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class EditWeek extends Component {
  state = {
    week: null
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks/${this.props.match.params.id}`)
      this.setState({ week: res.data.week })
    } catch (error) {
      console.error(error)
    }
  }

  render () {
    const { week } = this.state

    if (week) {
      return (
        <Form onSubmit={this.props.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label><h3 className='form-title'>Plan Name</h3></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a name for your plan"
              onChange={this.props.handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(EditWeek)
