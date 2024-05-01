import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading.js";
import $ from "jquery";
import crypto from "crypto";

export default function EventCarousel({
  listOfEvents,
  eventImages,
  title,
  display,
}) {
  const algorithm = "aes-256-cbc";
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const encrypt = (eventJSON) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(eventJSON);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  };

  useEffect(() => {
    $(`#infinite-carousel-${title} .right-button`).on("click", () => {
      let $infinite_carousel_row = $(`#infinite-carousel-${title} .row`);
      let $col = $infinite_carousel_row.find(".event-card:first");
      $infinite_carousel_row.append($col[0].outerHTML);
      $col.remove();
    });
    $(`#infinite-carousel-${title} .left-button`).on("click", () => {
      let $infinite_carousel_row = $(`#infinite-carousel-${title} .row`);
      let $col = $infinite_carousel_row.find(".event-card:last");
      $infinite_carousel_row.prepend($col[0].outerHTML);
      $col.remove();
    });
  }, []);
  if (listOfEvents !== null && listOfEvents !== undefined) {
    return (
      <div
        id={`infinite-carousel-${title}`}
        className={`${display} justify-content-center align-items-center mb-5`}
      >
        <button className="control slider-button left-button position-relative pl-0">
          <i className="fa fa-angle-left"></i>
        </button>
        <div
          className="row w-100 flex-nowrap wrapper"
          style={{ overflow: "hidden" }}
        >
          {listOfEvents.map((event, index) => {
            let link =
              window.location.origin +
              "/view-event?data=" +
              JSON.stringify(encrypt(JSON.stringify(event))) +
              "&isfree=free&key=" +
              key.toString("hex");
            event.image = eventImages.get(event.title);
            return (
              <div
                className="col-6 col-sm-5 col-md-4 col-xl-3 text-center list-item event-card"
                key={index}
              >
                {event.payment === "free" ? (
                  <a href={link} className="carousel-image-container">
                    <img
                      src={eventImages.get(event.title)}
                      className="w-100 image-carousel"
                      alt={event.title}
                    ></img>
                    <div className="content"></div>
                    <div className="play-icon position-absolute">
                      <i
                        class="fa fa-play fa-play-icon image-over-font"
                        aria-hidden="true"
                      ></i>
                      <label className="text-white image-over-font">
                        &nbsp;&nbsp;{event.title}
                      </label>
                    </div>
                  </a>
                ) : (
                  <Link to={{ pathname: "/show-event", event: event }}>
                    <img
                      src={eventImages.get(event.title)}
                      className="w-100 image-carousel"
                      alt={event.title}
                    ></img>
                    <div className="content"></div>
                    <div className="play-icon position-absolute">
                      <i
                        class="fa fa-play fa-play-icon image-over-font"
                        aria-hidden="true"
                      ></i>
                      <label className="text-white image-over-font">
                        &nbsp;&nbsp;{event.title}
                      </label>
                    </div>
                    <div className="premium-text position-absolute">
                      <label className="text-golden">PREMIUM</label>
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <button className="control slider-button right-button position-relative pr-0">
          <i className="fa fa-angle-right"></i>
        </button>
      </div>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    );
  }
}
