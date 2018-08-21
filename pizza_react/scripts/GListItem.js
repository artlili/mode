import * as Ons from 'react-onsenui';
import React, { Component } from "react";

const  GListItem = ({onClick, img, id, title, desc, price, hasMinPrice = false}) => {
  return (
    <Ons.ListItem key={id} onClick={onClick}>
      <div className="left" >
        <img src={img} className='list-item__thumbnail' />
      </div>
      <div className="center">
        <div style={{'width': '100%'}}>
          {title}
        </div>
        <div style={{'maxWidth': '100%', 'color': 'gray', 'fontSize': '11px'}}>
          {desc}
        </div>
      </div>
      <div className="right">
        <div >
          { hasMinPrice && ( <div>от</div> ) }
          <div>{price}Р</div>
        </div>
      </div>
    </Ons.ListItem>
  );
}

export default GListItem
