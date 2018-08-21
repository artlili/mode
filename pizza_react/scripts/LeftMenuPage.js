import React, { Component } from "react";
import * as Ons from 'react-onsenui';
import Repository           from "./Repository";

const ITEMS = [{title:'Меню', id: 'categories'}, {title: 'Избранное', id: 'favorites'}, {title: 'Личный кабинет', id: 'cabinet'}]
  //, 'Личный Кабинет', 'Избранное', 'О Компании', 'Обратный звонок', 'Заказ по телефону', 'г.Москва']

let LeftMenuPage  = ({onClick, selected, cityTitle})  => {
  const items = ITEMS.concat([{title: cityTitle, id: 'city'}]);
  return (
    <Ons.Page>
      <Ons.List
    dataSource={items}
    renderRow={({title, id}) => (
      <Ons.ListItem key={id} disabled={selected == id ? true : null} onClick={onClick.bind(undefined, id)} tappable>{title}</Ons.ListItem>
    )}
      />
      </Ons.Page>
  );

}


export default LeftMenuPage;
