import React, { Component } from 'react';
import * as Ons from 'react-onsenui';
import styles from 'Styles/ToolBar.scss';


export const ToolBar = props => {

  let handleBackClick = navigator => () =>
    navigator.popPage();

  return (
    <Ons.Toolbar className={styles.toolbar}>
      <div className="left">
        <span
          className={styles.toolbar__close}
          onClick={handleBackClick(props.navigator)}
        >
          <ons-icon icon="md-plus" size="30px" />
        </span>
      </div>
      <div className="center">{props.title}</div>
    </Ons.Toolbar>
  );
};

export default ToolBar
