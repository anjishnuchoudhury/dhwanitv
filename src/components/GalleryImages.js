import React, { useState, useCallback, useEffect } from 'react';
import firebaseAppConfig from '../config/firebaseConfig.js';
import GalleryContainer from './GalleryContainer.js';
import Loading from './Loading.js';

export default function GalleryImages() {
  
  const [events, setEvents] = useState([]);
  const [eventImages, setEventImages] = useState(new Map());
  let imageStore =[]; 

  async function getGalleryEvents(){
    const source = 'gallery/';
    await firebaseAppConfig.storage().ref().child(source).list().then((result) => {
      result.prefixes.forEach((prefix) => {
        setEvents(prevState => [...prevState, prefix.name]);
        getEventImages(prefix.name)
      })
    })
  }

  async function getEventImages(name){
    const source = 'gallery/'+name;
    await firebaseAppConfig.storage().ref().child(source).listAll().then((result) => {
      if(result.items.length === 0){
        // loadImagesErrorFlag = "true";
        console.log('length 0');
      }else{
          result.items.forEach((imageRef) => {
              imageRef.getDownloadURL().then((url) => {
                // loadImagesErrorFlag = "false";
                const image = new Image();
                image.src = url;
                var width = Math.round(image.naturalWidth/1000);
                var height = Math.round(image.naturalHeight/1000);
                console.log("Original height: ", height)
                console.log("Original width: ", width)
                var data={
                  src: url,
                  width: width,
                  height: height
                }
                imageStore.push(data)
                setEventImages(new Map(eventImages.set(name, imageStore)))
              });
          })
      }
    }).catch((error) => {
      // loadImagesErrorFlag = "true";
    }); 
  }
  useEffect(() => {
    getGalleryEvents()
  }, [])

  if (events.length > 0) {
    return (
      <>
        <div className="gallery py-5">
          <div className="container">
            {events.map((event, index) => {
              if (eventImages.get(event) !== undefined && eventImages.get(event) !== null && eventImages.get(event).length > 0) {
                return (
                  <div className="imageContainer">
                    <img
                      //style={{ width: 300, height: 200 }}
                      
                      src={eventImages.get(event.index)}

                      // resizeMode="contain"
                    />
                  </div>
                )
              } else {
                return (
                  <div key={index}>
                    <label className=" event-title mb-3">{event}</label>
                    <p className="">Coming soon. Stay tuned!</p>
                  </div>
                )
              }
            })}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    )
  }
}
