import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Header from '../../Header.js';
import Footer from '../../Footer.js';
import MysticMonsoon from './MysticMonsoon.js'

export default function MysticMonsoonWrapper(props){

    return (
        <>
            <Header/>
            <MysticMonsoon/>
            <Footer/>
        </>
    )
}