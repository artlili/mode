import React, { Component }   from "react";
import * as Ons               from 'react-onsenui';
//import ons  from 'onsenui';

import MainPage             from "./MainPage";
import LeftMenuPage         from "./LeftMenuPage";
import Repository           from "./Repository";
import StateRepository      from "./StateRepository";

import Reducer              from "./Reducer";

import _    from 'lodash';
import fp   from 'lodash/fp';

import PropTypes from 'prop-types';
import './App.scss';

_.memoize.Cache = Map


class Presenter {

}

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }
  //
  navigatorRef = React.createRef()
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      cart: [],
      favorites: [],
      cartGifts: [],
      cartChopstics: 0,
      cityId: 1,
      deliveryData: {},
      changeCash: 0,
      currentScreen: 'categories',
      tmpAddress: {}, // TODO NEEDED ?
      currentOrder: null, // TODO NEEDED ?
      userId: null,
      userAccessToken: null,
      _card: { },
      orderId: null,
      promoCode: null,    // Введеный promoCode
      orderInfo: {id: null, sum: null, timeDelivery: null }
    }
  }

  //[{obj:{id: 1, sousId: 2}, quantity: 1}, {id: 1, sousId: ]

  dispatch(action) {
    return new Promise((resolve, reject) => {
    const res = Reducer(this.state, action)
    if (res) {
      this.setState(res, () => resolve());
    } else {
      resolve();
    }
    });
  }

  componentDidMount() {
    //window.foo = this.props.categories;
    //this.props.location.search.substr(1).split("&")
    let queryDict = {};
    decodeURIComponent(window.location.search.substr(1)).split('&').forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]})
    this.query = queryDict;
    //console.log('gorod');
  }


  chatId() {
    //return 11;
    return this.query.chat_id;
  }

  hideMenu() {
    this.setState({isOpen: false});
  }

  showMenu() {
    this.setState({isOpen: true});
  }

  openOffersPage(navigator) {
    navigator.pushPage({type: 'offers'})
  }


  getChildContext() {
    return {
      dispatch:         this.dispatch.bind(this),
      state:            this.state,
      stateRepository:  StateRepository(this.state),
      openMenuHandler: this.showMenu.bind(this),
      openOffersPage: this.openOffersPage.bind(this),
    }
  }

  AddProductHandler(id, num) {
    this.setState({counts:{ ...this.state.counts, [id]: num}});
  }

  onSideClick(name) {
    this.navigatorRef.current.resetPage({type: name}, {animation: 'fade'});
    this.setState({isOpen: false, currentScreen: name});
  }


  render() {
    return(
      <Ons.Splitter>
        <Ons.SplitterSide
          side='left'
          style={{
            boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
          }}
          collapse={true}
          width={200}
          isOpen={this.state.isOpen}
          onClose={this.hideMenu.bind(this)}
          onOpen={this.showMenu.bind(this)}
        >
          <LeftMenuPage selected={this.state.currentScreen} cityTitle={"г." + Repository.cityNameById(this.state.cityId)} onClick={this.onSideClick.bind(this)}/>
        </Ons.SplitterSide>
        <Ons.SplitterContent>
          <MainPage cityId={this.state.cityId} navRef={this.navigatorRef}/>
        </Ons.SplitterContent>
      </Ons.Splitter>
    );
  }
}

App.childContextTypes = {
  dispatch:   PropTypes.func,
  repository: PropTypes.object,
  categories: PropTypes.object,
  products: PropTypes.object,
  counts:   PropTypes.object,
  ACTION_CLEAR_CART: PropTypes.func,
  AddHandler: PropTypes.func,
  FinishHandler: PropTypes.func,
  openMenuHandler: PropTypes.func,
  openOffersPage: PropTypes.func,
  state:      PropTypes.object,
  query:      PropTypes.object,
  stateRepository: PropTypes.object,
};


export default App;
//export default withRouter(App);
