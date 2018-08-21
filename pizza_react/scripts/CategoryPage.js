import React, { Component } from "react";
import * as Ons from 'react-onsenui';
import PropTypes from 'prop-types';
import CartIcon from 'UI/CartIcon';
import Repository from "./Repository";
import GListItem from './GListItem'

const sortF = {
  ratingDesc: (a,b) => { return b.rating - a.rating },
  priceInc:   (a,b) => { return a.minPrice - b.minPrice },
  priceDesc:  (a,b) => { return b.minPrice - a.minPrice },
}

class CategoryPage extends Component {

  state = {
    sortBy: 'ratingDesc',
    filterObj: null,
    isFilterSet: false,
  }


  _products() {
    if (this.state.isFilterSet) {
      return Repository.productsByFilter(this.state.filterObj)
    } else {
      return Repository.productsByCategoryId(this.props.category.id);
    }
  }

  sortedProducts() {
    return this._products().sort(sortF[this.state.sortBy]);
  }

  get title() {
    return this.props.category.title;
  }

  onFilterConfirm = (filterObj) => {
    this.setState({filterObj: filterObj, isFilterSet: true})
  }

  disableFilter = () => {
    this.setState({isFilterSet: false})
  }

  renderToolbar = () => {
   return  <Toolbar title={this.title}  navigator={this.props.navigator} count={this.context.stateRepository.totalCount()} />
  }

  onUpdateFilter = (newFilter) => {
    this.setState({sortBy: newFilter});
  }

  onClick = (id) => {
    this.props.navigator.pushPage({type: "product", options: {id: id}});
  }

  onFilterClick = () => {
    if (this.state.isFilterSet) {
      this.disableFilter()
    } else {
    this.props.navigator.pushPage({type: "tags", options: {category: this.props.category, onConfirm: this.onFilterConfirm}}, {animation: 'lift-md'});
    }
  }


  _renderProducts() {
    console.log(this.sortedProducts())
    return this.sortedProducts().map((p) => {
      return (<GListItem key={p.id} img={p.thumbImgUrl} id={p.id} title={p.name} desc={p.humanDescription} price={p.minPrice} onClick={this.onClick.bind(this, p.id)} hasMinPrice={p.isPizza}/>)
    });
  }


  render() {
    return (
      <Ons.Page key={"Categories"} renderToolbar={this.renderToolbar}>
        <FilterBar onUpdateFilter={this.onUpdateFilter} >
          {true && <FilterButton isSet={this.state.isFilterSet} onClick={this.onFilterClick} /> }
        </FilterBar>

        <Ons.List>
          {this._renderProducts()}
        </Ons.List>
      </Ons.Page>
    );
  }
}

CategoryPage.contextTypes = {
  stateRepository: PropTypes.object,
  categories: PropTypes.object,
  openMenuHandler: PropTypes.func,
};

let FilterBar = ({onUpdateFilter, filter, onFilterClick, children}) => {
  const onChange = (event) => {
    const  res = event.index == 0 ? 'ratingDesc' : 'priceInc' // 1 index
    onUpdateFilter(res);
  };

  return (
    <React.Fragment>
      <Ons.Segment index={0} onPostChange={() => onChange(event)} >
        <button>популярности</button>
        <button>По цене</button>
      </Ons.Segment>
      {children}
    </React.Fragment>
  );
};


const FilterButton = ({isSet = false, onClick }) => {
  const body = isSet ? "убрать фильтр" : "Фильтр"
  return (
  <Ons.Button modifier="outline" onClick={onClick}>{body}</Ons.Button>
  )
}

const Toolbar = ({title, count, navigator}) =>  {
  return(
    <Ons.Toolbar>
      <div className='left'><Ons.BackButton>Назад</Ons.BackButton></div>
      <div className='center'>{title}</div>
      <div className='right'>
        <CartIcon navigator={navigator} count={count} />
      </div>
    </Ons.Toolbar>
  );
}



export default CategoryPage;
