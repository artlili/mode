import React, { Component } from "react";
import * as Ons from 'react-onsenui';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from "Styles/MultiSelectModal.scss";
import {ToolBar} from 'UI/ToolBar';
import Button from 'UI/Button';
import FixedBottomButton from 'Components/FixedBottomButton';


// Модалка должна открываться с предстановлленной выбором
// должна передавать сообщение назад к родителю
//const list = [
  //{id: 1, title: 'колбаса', price: 40},
  //{id: 2, title: 'ананасы', price: 40},
  //{id: 3, title: 'шампиньоны', price: 40},
  //{id: 4, title: 'креветки', price: 40},
//];


class Presenter {
  constructor({list, countsByIds, maxElements}) {
    this.list        = list;
    this.countsByIds = countsByIds;
    this.maxElements = maxElements;
  }

  get totalPrice() {
    const res = _.chain(this.countsByIds)
    .toPairs()
    .map(([id,count]) => this.list.find( x => x.id == id ).price * count)
    .sum()
    .value();
    //return "+300Р";
    return res ? `+${res}Р` : '';
  }

  get availableCount() {
    return this.maxElements - this.totalCount;
  }

  get totalCount() {
    return _.chain(this.countsByIds)
      .values()
      .sum()
      .value();
  }
}

class MultiSelectModal extends Component {

  constructor(props) {
    const {list, selected, renderRow } = props;
    console.log('MULTI_START');
    console.log(list);
    console.log('MULTI_END');
    super(props)

    this.renderRowTemplate = props.renderRow || this.defaultRenderRow;
    this.state = {
      countsByIds: selected || {},
    }
  }


  get maxElements() {
    return this.props.maxElements;
  }

  get maxElementsPerItem() {
    return this.props.maxElementsPerItem;
  }


  get presenter() {
    return new Presenter({...this.props, countsByIds: this.state.countsByIds});
  }

  totalCount() {
    return this.presenter.totalCount;
  }

  renderToolbar = () => {
    return(
      <ToolBar title="Доп. ингредиенты" navigator={this.props.navigator} />
    );
  }

  onConfirmClick() {
    const clearedData = _.omitBy(this.state.countsByIds, x => (x == 0))
    console.log(clearedData);
    this.props.ACTION_CONFIRM(clearedData);
    this.props.navigator.popPage();
  }


  onPlusClick(id) {
    const count = this.state.countsByIds[id];
    console.log('PLUS-CLICK');
    console.log(this.totalCount());
    console.log(this.props.maxElements);
    console.log('PLUS-CLICK');
    if (count >= this.maxElementsPerItem)      { return }
    if (this.totalCount() >= this.maxElements) { return }

    this.setState({countsByIds: {...this.state.countsByIds, [id]: (this.state.countsByIds[id] || 0) + 1 }});
  }

  onMinusClick(id) {
    const count = this.state.countsByIds[id];
    if (count == 0) { return }

    this.setState({countsByIds: {...this.state.countsByIds, [id]: count - 1 }});
  }


  _renderList() {
    return(
      <Ons.List
      dataSource={this.props.list}
      renderRow={this.renderRow}
      />);
  }



  defaultRenderRow = ({id, name, price}) => {

    const count = this.state.countsByIds[id] || 0 ;
    console.log(count);
    return (

      <div className={styles.listItem} key={id}>
        <Ons.ListItem>
          <div>
            {name}
            <div className={styles.listItem__btn}>
              <Ons.Button modifier='quiet' onClick={this.onMinusClick.bind(this, id)}>-</Ons.Button>
              <Ons.Button modifier='quiet' onClick={this.onPlusClick.bind(this, id)}>+</Ons.Button>
            </div>
          </div>
          <div>
            <div className={styles.listItem__price}>{price} ₽</div>
            <div className={styles.listItem__count}>{count} x</div>
          </div>
        </Ons.ListItem>
      </div>

    );
  };

  renderRow = (item = {}) => {
    return this.renderRowTemplate({
      ...item,
      ACTION_MINUS: this.onMinusClick.bind(this, item.id),
      ACTION_PLUS:  this.onPlusClick.bind(this, item.id),
    });
  }

  render() {
    const presenter = this.presenter;
    //let items = this.props.list.map(({title, id}) => <div onClick={this.onSelected.bind(this, id)} >{title} {id == this.state.selected ? "selected" : null}</div>);
    return (
      <Ons.Page key={"Item"} renderToolbar={this.renderToolbar.bind(this)}>
        <div className={styles.availableCount}> Доступно {presenter.availableCount} шт.</div>
        { this._renderList() }
        <FixedBottomButton title="OK" onClick={this.onConfirmClick.bind(this)} />
      </Ons.Page>
    );
      //<button className="button superbutton" onClick={this.onAddToCart.bind(this}>Положить в корзину</button>
  }
}

//export default withRouter(ItemPage);
export default MultiSelectModal;
