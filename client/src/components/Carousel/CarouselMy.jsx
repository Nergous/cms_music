import React, { useState, useEffect } from "react";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import cl from "./CarouselMy.module.css";

function CarouselMy({ imgs }) {
    return (
        <>
            {imgs.length > 0 && (
                <Carousel className={cl.carousel__mine}>
                    {imgs.map((image, index) => (
                        <Carousel.Item key={index} interval={5000}>
                            <div className={cl.carousel_item_container}></div>
                            <img
                                className={cl.image__carousel}
                                src={`/uploads/carousel/${image}`}
                                alt={`Фотография ${index + 1}`}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}
        </>
    );
}

export default CarouselMy;
