import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Home from '../Home/Home'
import Header from '../Header/Header'
import SignUp from '../SignUp/SignUp'
import SignIn from '../SignIn/SignIn'
import SignOut from '../SignOut/SignOut'
import ChangePassword from '../ChangePassword/ChangePassword'

// Recipe imports
import Recipes from '../Recipes/Recipes'
import Recipe from '../Recipes/Recipe'
import EditRecipe from '../Recipes/EditRecipe'
import CreateRecipe from '../Recipes/CreateRecipe'

class App extends Component {
  constructor () {
    super()

    this.state = {
      user: null,
      alerts: []
    }
  }

  setUser = user => this.setState({ user })

  clearUser = () => this.setState({ user: null })

  alert = ({ heading, message, variant }) => {
    this.setState({ alerts: [...this.state.alerts, { heading, message, variant }] })
  }

  render () {
    const { alerts, user } = this.state

    return (
      <Fragment>
        <Header user={user} />
        {alerts.map((alert, index) => (
          <AutoDismissAlert
            key={index}
            heading={alert.heading}
            variant={alert.variant}
            message={alert.message}
          />
        ))}
        <main className="container">
          <Route exact path='/' render={ Home } />

          {/* Auth Routes */}
          <Route exact path='/sign-up' render={() => (
            <SignUp alert={this.alert} setUser={this.setUser} />
          )} />
          <Route exact path='/sign-in' render={() => (
            <SignIn alert={this.alert} setUser={this.setUser} />
          )} />
          <AuthenticatedRoute user={user} exact path='/sign-out' render={() => (
            <SignOut alert={this.alert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} exact path='/change-password' render={() => (
            <ChangePassword alert={this.alert} user={user} />
          )} />

          {/* Recipe Routes */}
          <AuthenticatedRoute user={user} exact path='/recipes' render={ Recipes }/>
          <AuthenticatedRoute user={user} exact path='/recipes/:id' render={() => (
            <Recipe user={user}/>
          )}/>
          <AuthenticatedRoute user={user} path='/recipes/:id/edit' render={() => (
            <EditRecipe user={user} alert={this.alert}/>
          )}/>
          <AuthenticatedRoute user={user} path='/create-recipe' render={() => (
            <CreateRecipe user={user} alert={this.alert}/>
          )}/>
        </main>
      </Fragment>
    )
  }
}

export default App
