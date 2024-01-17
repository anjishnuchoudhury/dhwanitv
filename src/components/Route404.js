import React from 'react';
import Footer from './Footer';
import Header from './Header';
import PageNotFound from './PageNotFound';

export default function Route404(){
    return (
        <>
            <Header/>
            <PageNotFound/>
            <Footer footer="fixed-footer"/>
        </>
    )
}