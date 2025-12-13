import React, { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { carList } from '../data/carList';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

const RideSelector = ({ pickupCoordinates, dropoffCoordinates }) => {
  const [rideDuration, setRideDuration] = useState(0);

  useEffect(() => {
    // 🛑 Prevent invalid API calls
    if (
      !pickupCoordinates ||
      !dropoffCoordinates ||
      pickupCoordinates[0] === 0 ||
      dropoffCoordinates[0] === 0
    ) {
      return;
    }

    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=${MAPBOX_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes[0]) {
          setRideDuration(data.routes[0].duration / 100);
        }
      })
      .catch((error) => {
        console.error('Mapbox directions error:', error);
      });
  }, [pickupCoordinates, dropoffCoordinates]);

  return (
    <Wrapper>
      <TitleContainer>
        <Title>Choose a ride, or swipe for more options</Title>
        <Subtitle>Prices may vary depending on demand</Subtitle>
      </TitleContainer>
      
      <CarList>
        {carList.map((car, index) => (
          <Car key={index}>
            <CarImageContainer>
              <CarImage src={car.imgUrl} alt={car.service} />
            </CarImageContainer>
            
            <CarDetails>
              <ServiceSection>{car.service}</ServiceSection>
              <Capacity>{car.capacity || "4 passengers"}</Capacity>
              <TimeSection>
                <ClockIcon>🕒</ClockIcon>
                <TimeText>5 min away</TimeText>
              </TimeSection>
            </CarDetails>
            
            <PriceSection>
              <Price>Ksh {(rideDuration * car.multiplier).toFixed(0)}</Price>
              <PriceNote>approx. price</PriceNote>
            </PriceSection>
          </Car>
        ))}
      </CarList>
    </Wrapper>
  );
};

export default RideSelector;

/* Styled Components - Updated to match Uber style */
const Wrapper = tw.div`
  flex-1 flex flex-col bg-white
`;

const TitleContainer = tw.div`
  px-4 py-3 border-b border-gray-100
`;

const Title = tw.div`
  text-gray-800 font-medium text-center text-base
`;

const Subtitle = tw.div`
  text-gray-500 text-center text-xs mt-1
`;

const CarList = tw.div`
  flex-1 overflow-y-auto
`;

const Car = tw.div`
  flex items-center px-4 py-3 border-b border-gray-100
  hover:bg-gray-50 transition-colors duration-150
  cursor-pointer
`;

const CarImageContainer = tw.div`
  mr-4
`;

const CarImage = tw.img`
  h-16 w-16 object-contain
`;

const CarDetails = tw.div`
  flex-1
`;

const ServiceSection = tw.div`
  font-medium text-gray-800 text-base
`;

const Capacity = tw.div`
  text-gray-500 text-xs mt-1
`;

const TimeSection = tw.div`
  flex items-center mt-2
`;

const ClockIcon = tw.span`
  text-xs mr-1
`;

const TimeText = tw.div`
  text-blue-500 text-xs font-medium
`;

const PriceSection = tw.div`
  text-right ml-4
`;

const Price = tw.div`
  font-bold text-gray-800 text-lg
`;

const PriceNote = tw.div`
  text-gray-500 text-xs mt-1
`;