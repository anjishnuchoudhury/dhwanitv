import React from 'react';

export default function Viewport(props){

    return(
        <div className="video-player-container">
            {/* <iframe className="video-player" src={`https://player.vimeo.com/video/${props.link}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen  title={props.title}></iframe> */}
            <iframe className="video-player" src={props.link} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen  title={props.title}></iframe>
        </div>
    )
}