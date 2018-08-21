import React from 'react';
// import PropTypes from 'prop-types';
import * as Ons from 'react-onsenui';
import styles from 'Styles/Button.scss';

const Button = ({ onClick, children, className, modifier = 'large', ...restProps }) => (
  <Ons.Button
    className={`${styles.button} ${className}`}
    onClick={onClick}
    modifier={modifier}
    {...restProps}
  >
    {children}
  </Ons.Button>
)


export default Button
