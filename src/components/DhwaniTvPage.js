import React from 'react';
import DhwaniTv from './DhwaniTv';
import Footer from './Footer';
import Header from './Header';

export default class DhwaniTvPage extends React.Component{
  render(){
    return(
      <div >
        <Header/>
        <DhwaniTv/>
        <Footer/>
      </div> 
    )
  }
}