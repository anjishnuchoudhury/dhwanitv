import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Header from '../../Header.js';
import Footer from '../../Footer.js';
import RaagaAndRhythm from './RaagaAndRhythm.js'

export default function RaagaAndRhythmWrapper(props){

    return (
        <>
            <Header/>
            <RaagaAndRhythm/>
            <Footer/>
        </>
    )
}