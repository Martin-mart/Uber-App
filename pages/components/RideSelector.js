import React, { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { carList } from '../data/carList';

const RideSelector = ({ pickupCoordinates, dropoffCoordinates }) => {
  const [rideDuration, setRideDuration] = useState(0);

  useEffect(() => {
    if (!pickupCoordinates || !dropoffCoordinates) return;

    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=YOUR_MAPBOX_TOKEN`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          setRideDuration(data.routes[0].duration / 100);
        }
      });
  }, [pickupCoordinates, dropoffCoordinates]);

  return (
    <Wrapper>
      <Title>Choose a ride, or swipe for more options</Title>
      <CarList>
        {carList.map((car, index) => (
          <Car key={index}>
            <CarImage src={car.imgUrl} />
            <CarDetails>
              <ServiceSection>{car.service}</ServiceSection>
              <Time>5 min away</Time>
            </CarDetails>
            <Price>{'ksh ' + (rideDuration * car.multiplier).toFixed(2)}</Price>
          </Car>
        ))}
      </CarList>
    </Wrapper>
  );
};

export default RideSelector;

/* Styled Components */
const Wrapper = tw.div`flex-1 flex flex-col overflow-y-scroll`;
const Title = tw.div`text-gray-500 text-center text-sm py-2 border-b`;
const CarList = tw.div`flex flex-col sm:flex-row sm:overflow-x-scroll`;
const Car = tw.div`flex sm:flex-col sm:min-w-[150px] p-4 items-center border-b sm:border-b-0 sm:border-r`;
const CarImage = tw.img`h-14 w-14 object-contain mb-2 sm:mb-0 sm:mr-0 sm:mb-2`;
const CarDetails = tw.div`flex-1 text-center sm:text-left`;
const ServiceSection = tw.div`font-medium`;
const Time = tw.div`text-xs text-blue-500`;
const Price = tw.div`text-sm font-semibold mt-2`;
