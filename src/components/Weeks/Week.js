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
      .then(() => {
        this.props.alert({
          heading: 'Success!',
          message: 'You deleted your meal plan',
          variant: 'success'
        })
      })
  }

  editWeek = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        this.props.alert({
          heading: 'Success!',
          message: 'You renamed your plan.',
          variant: 'success'
        })
        this.setState({ editing: false })
      })
      .catch(() => {
        this.props.alert({
          heading: 'An Error occured',
          message: 'Failed to rename plan',
          variant: 'danger'
        })
      })
  }

  render () {
    const { week } = this.state

    if (week) {
      const returnBtn = (<Button href='#weeks'>Return to Plans</Button>)
      const buttonJsx = (
        <div className='buttonjsx mb-3'>
          <Button onClick={this.editWeek}>Edit Plan Name</Button>
          <Button onClick={this.deleteWeek}>Delete Plan</Button>
          {returnBtn}
        </div>
      )
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const orderedDays = [week[0], week[1], week[2], week[3], week[4], week[5], week[6]]
      let title = (<h1 className='page-header'>{week.name}</h1>)
      if (this.state.editing) {
        title = <EditWeek
          user={this.props.user}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}/>
      }
      return (
        <div className='week-page'>
          { title }
          <div className='week-content justify-content-space-between align-items-center'>
            {this.props.user && week && this.props.user._id === week.owner ? buttonJsx : returnBtn}
            <div className='weekdays d-flex'>
              {orderedDays.map((recipes, index) => (
                <Link key={index} to={`/weeks/${this.state.week._id}/${index}`}>
                  <div className='weekday'>
                    <h2> {days[index]} </h2>
                    <p>{orderedDays[index].length} meals planned</p>
                  </div>
                </Link>
              ))}
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

export default withRouter(Week)
