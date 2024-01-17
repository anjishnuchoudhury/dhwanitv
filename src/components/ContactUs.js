import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Contact from './Contact';

export default function ContactUs(props) {

    useEffect(() => {
        window.scroll(0, 0);
    }, [])
    return (
        <>
            <Header />
            <Contact/>
            <Footer />
        </>
    )

}