import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Loading from './Loading';

export default function LoadingWrapper(){
    return (
        <>
            <Header/>
            <Loading/>
            <Footer footer="fixed-footer"/>
        </>
    )
}