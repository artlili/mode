import React, { Component } from "react";
import * as Ons from 'react-onsenui';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from "Styles/SelectModal.scss";
import {ToolBar} from 'UI/ToolBar';
import Button from 'UI/Button';


// Модалка должна открываться с предстановлленной выбором
// должна передавать сообщение назад к родителю

class SelectModal extends Component {

  constructor(props) {
    const {selected } = props;
    super(props)
    this.state = { selected: selected }
  }


  renderToolbar = () => {
    return(
      <ToolBar title="Выбор соуса" navigator={this.props.navigator} />
    );
  }

  onSelected(index) {
    console.log(index);
    this.setState({selected: index});
  }

  onConfirmClick() {
    console.log(this.props);
    this.props.ACTION_CONFIRM(this.state.selected);
    this.props.navigator.popPage();
  }

  render() {
    return (
      <Ons.Page key={"Item"} renderToolbar={this.renderToolbar}>
      <Ons.List
      className = {styles.list }
      dataSource={this.props.list}
      renderRow={({name, id}) => {
        const newTitle = `${name} ${id == this.state.selected ? "selected" : ""}`;
        const className = id == this.state.selected ? styles.__selected : "";

        return (
          <Ons.ListItem key={id} className={[className, styles.listItem].join(' ')} tappable onClick={this.onSelected.bind(this, id)}>{name}</Ons.ListItem>
        );
      }}
      />
      <Button onClick={this.onConfirmClick.bind(this)} >Применить</Button>
      </Ons.Page>
    );
      //<button className="button superbutton" onClick={this.onAddToCart.bind(this}>Положить в корзину</button>
  }
}


      <Ons.List
      dataSource={['Акция 1', '9 мая', '2 пиццы по цене одной',]}
      renderRow={(title) => (
        <Ons.ListItem key={title} tappable>{title}</Ons.ListItem>
      )}
      />


//export default withRouter(ItemPage);
export default SelectModal;
