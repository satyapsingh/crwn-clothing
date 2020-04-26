import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';

import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connect } from 'react-redux';  
import {setCurrentUser} from './redux/user/user.actions';


class App extends React.Component {
  unsubcribeFromAuth = null;

  componentDidMount () {
    const {setCurrentUser} = this.props;
    this.unsubcribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      //this.setState({currentUser: user});
      
      if (userAuth) {
        const userDocRef = await createUserProfileDocument(userAuth);

        userDocRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
              ...snapShot.data()
          });

        });
        
      }

      setCurrentUser(userAuth);

    });
  }

  componentWillUnmount () {
    this.unsubcribeFromAuth();
  }

  render () {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path="/signin" 
                render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignInAndSignUpPage />)} />
        </Switch>
      </div>
    );
  }
  
}
const mapStateProps = ({user}) => ({
  currentUser: user.currentUser
});
const mapDispathToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateProps, mapDispathToProps)(App);
