import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Header from '../../Header.js';
import Footer from '../../Footer.js';
import Pratidhwani from './Pratidhwani.js'

export default function PratidhwaniWrapper(props){

    return (
        <>
            <Header/>
            <Pratidhwani/>
            <Footer/>
        </>
    )
}