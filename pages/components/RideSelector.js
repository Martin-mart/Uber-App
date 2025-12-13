import React, { use } from 'react'
import tw from 'tailwind-styled-components'
import { carList } from '../data/carList'
import { useState, useEffect } from 'react'

const RideSelector = ({ pickupCoordinates, dropoffCoordinates }) => {
    const [rideDuration, setRideDuration] = useState(0);

    useEffect(() => {
        rideDuration = fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}?access_token=pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg`
)
            .then(response => response.json())
            .then(data => {
                //giving the first route which is the fastest and is a 0
                setRideDuration(data.routes[0].duration / 100);
            })

    }, [pickupCoordinates, dropoffCoordinates])

  return (
    <Wrapper>
        <Title>Choose a ride, or swipe up for options</Title>
        <CarList>
            {carList.map((car, index) => (
                <Car key={index}>
                    <CarImage src={car.imgUrl} />
                    <CarDetails>
                        <ServiceSection>{car.service}</ServiceSection>
                        <Time>5 min away</Time>
                    </CarDetails>
                    <Price>{'ksh' + (rideDuration * car.multiplier).toFixed(2)}</Price>
                </Car>
            ))}
        </CarList>
    </Wrapper>
  )
}

export default RideSelector

const Wrapper = tw.div`
flex-1 flex flex-col overflow-y-scroll
`
const Title = tw.div`
text-gray-500 text-center text-sm py-2 border-b
`
const CarList = tw.div`
flex-1 overflow-y-scroll
`
const Car = tw.div`
flex p-4 items-center
`
const CarImage = tw.img`
h-14 mr-4
`  
const CarDetails = tw.div`
flex-1
`
const ServiceSection = tw.div`
font-medium
`
const Time = tw.div`
text-xs text-blue-500
`
const Price = tw.div`
text-sm
`