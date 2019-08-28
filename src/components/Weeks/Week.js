import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import EditWeek from './EditWeek'

class Week extends Component {
  constructor () {
    super()

    this.state = {
      week: null,
      editing: false
    }
  }

  async componentDidMount () {
    try {
      const res = await axios(`${apiUrl}/weeks/${this.props.match.params.id}`)
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

  editWeek = () => {
    this.setState({ editing: true })
  }

  handleChange = event => {
    this.setState({
      week: {
        ...this.state.week,
        name: event.target.value
      }
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    console.log('submitting this!', this.state.week)
    axios({
      method: 'PATCH',
      url: `${apiUrl}/weeks/${this.state.week._id}`,
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      },
      data: {
        week: {
          name: this.state.week.name
        }
      }
    })
      .then(res => {
        console.log(res)
        this.props.alert({
          heading: 'Success!',
          message: 'You renamed your plan.',
          variant: 'success'
        })
        this.setState({ editing: false })
      })
      .catch(console.error)
  }

  render () {
    const { week } = this.state

    if (week) {
      const buttonJsx = (
        <React.Fragment>
          <Button onClick={this.editWeek}>Edit Plan Name</Button>
          <Button onClick={this.deleteWeek}>Delete Weekly Plan</Button>
        </React.Fragment>
      )
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const orderedDays = [week[0], week[1], week[2], week[3], week[4], week[5], week[6]]
      let title = (<h2>{week.name}</h2>)
      if (this.state.editing) {
        title = <EditWeek
          user={this.props.user}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}/>
      }
      return (
        <div>
          { title }
          {orderedDays.map((recipes, index) => (
            <div key={index}>
              <Link to={`/weeks/${this.state.week._id}/${index}`}>
                <h2> {days[index]} </h2>
              </Link>
              <p>{orderedDays[index].length} meals planned</p>
            </div>
          ))}
          {this.props.user && week && this.props.user._id === week.owner ? buttonJsx : ''}
          <Link to='/weeks'>
            <Button>Return to Plans</Button>
          </Link>
        </div>
      )
    }
    return (
      <Spinner animation="border" />
    )
  }
}

export default withRouter(Week)
