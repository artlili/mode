import React from 'react';
import * as Ons from 'react-onsenui';
import styles from 'Styles/CartIcon.scss';

const foo = () => {};

let CartIcon = props => {
  let handleClick = navigator => () =>
    navigator.pushPage({
      type: 'cart',
      animation: 'lift-md'
    });

  return (
    <React.Fragment>
      <Ons.ToolbarButton
        className={styles.cartIcon}
        onClick={handleClick(props.navigator)}
      >
        <Ons.Icon icon="fa-shopping-cart" className={styles.cartIcon_image} />

        <div className={styles.cartIcon_badge}>{props.count}</div>
      </Ons.ToolbarButton>
    </React.Fragment>
  );
};

export default CartIcon;
