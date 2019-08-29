import React, { Fragment } from 'react'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import recipes from './../../images/recipes.png'
import timeline from './../../images/timeline.png'
import shoppingcart from './../../images/shopping-cart.png'

const Home = (props) => {
  if (props.user) {
    return (
      <Fragment>
        <header>
          <Row className='in-head justify-content-start align-items-end'>
            <h2> Start your meal prep journey...</h2>
          </Row>
        </header>
        <div className='home-content'>
          <div className='hp-buttons d-flex flex-column justify-content-center align-items-center'>
            <Button href='#weeks'> Weekly Plans </Button>
            <Button href='#recipes'> My Recipes </Button>
            <Button href='#cart'> My Cart </Button>
          </div>
          <div className='help justify-content-start'>
            <h2> Need help? </h2>
            <Button href='#help'> Instructions </Button>
          </div>
        </div>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <header>
        <Row className='head-display justify-content-center align-items-center'>
          <div>
            <h1>PLANNING AND PREPARING MADE EASY</h1>
            <h4>
              Save your favorite recipes, plan out your weekly meals, and have your shopping list compiled for you!
            </h4>
            <p className='auth-links'><a href='#sign-up'> Sign Up </a> or <a href='#sign-in'>Sign In</a> today!</p>
          </div>
        </Row>
      </header>
      <div className='home-content'>
        <h2> How <span>Prepper</span> works </h2>
        <Row className='how-content justify-content-center align-items-center'>
          <div className='how-section'>
            <h4> Create Your Favorite Recipes </h4>
            <img src={recipes}/>
            <p>Our app lets you save your favorite recipes so that you can add them to your meal plan at the click of a button.</p>
          </div>
          <div className='how-section'>
            <h4> Make A Meal Plan </h4>
            <img src={timeline}/>
            <p>Create a custom meal plan sectioned into each day of the week for easy planning</p>
          </div>
          <div className='how-section'>
            <h4> Add to your shopping cart </h4>
            <img src={shoppingcart}/>
            <p>Tired of manually keeping track of everything you need to buy? Add ingredients from your planned recipes into your shopping cart. Our cart will compile the total amount of things you need to buy for you! </p>
          </div>
        </Row>
      </div>
      <Row className='footer'>
        <div className='credits'><p>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a>, <a href="https://www.flaticon.com/authors/nikita-golubev" title="Nikita Golubev">Nikita Golubev</a>, <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p></div>
      </Row>
    </Fragment>
  )
}

export default Home
