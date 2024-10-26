// PlaceList.jsx
import React from 'react';
import back_arrow from '../../assets/images/back_arrow.png';

const PlaceList = ({ places, image, handleToggle, title, imageId }) => {
  return (
    <div className="specialDay-choice3">
      <div className="specialDay-choice3-top">
        <div onClick={handleToggle}>
          <img src={back_arrow} alt='back_arrow' className="back_arrow"/>
        </div>
        <div className="specialDay-choice3-top-name">{title}</div>
      </div>
      <hr/>
      <div className="specialDay-choice3-places">
        <div className="specialDay-choice3-places-left">
          {places.map((place, index) => (
            index % 2 === 0 && (
              <div className="specialDay-choice3-places-left-thg" key={index}>
                <img src={image} alt="image" id={imageId} />
                <div className="specialDay-choice3-places-left-thg-text">
                  <div className="specialDay-choice3-places-left-thg-text-emotion">{place.emotion}</div>
                  <div className="specialDay-choice3-places-left-thg-text-content">{place.content}</div>
                </div>
              </div>
            )
          ))}
        </div>
        <div className="specialDay-choice3-places-right">
          {places.map((place, index) => (
            index % 2 !== 0 && (
              <div className="specialDay-choice3-places-left-thg" key={index}>
                <img src={image} alt="image" id={imageId} />
                <div className="specialDay-choice3-places-left-thg-text">
                  <div className="specialDay-choice3-places-left-thg-text-emotion">{place.emotion}</div>
                  <div className="specialDay-choice3-places-left-thg-text-content">{place.content}</div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceList;
