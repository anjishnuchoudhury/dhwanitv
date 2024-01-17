import React, { useState, useCallback, useEffect } from 'react';
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

export default function GalleryContainer(props) {

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };
  console.log(props.eventImages)
  return (
    <>
        <div key={props.index} className="mb-5">
            <label className="event-title mb-3">{props.eventName}</label>
            <Gallery photos={props.eventImages} onClick={openLightbox} />
        </div>
        <ModalGateway>
            {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
                <Carousel
                currentIndex={currentImage}
                views={props.eventImages.map(x => ({
                    ...x,
                    srcset: x.srcSet,
                    caption: x.title
                }))}
                />
            </Modal>
            ) : null}
        </ModalGateway>
    </>
  );

}