import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import tw from 'tailwind-styled-components'
import mapboxgl from '!mapbox-gl'
import Link from 'next/link'
import { useRouter } from 'next/router'
import RideSelector from './components/RideSelector'

const confirm = () => {

    const useRouter = useRouter()
    const { pickup, dropoff } = Router.query

    const[ pickupCoordinates, setPickupCoordinates ] = useState([0,0]);
    const[ dropoffCoordinates, setDropoffCoordinates ] = useState([0,0]);


    const getPickupCoordinates = (pickup) => {
            //fetch coordinates
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?`+
                new URLSearchParams({
                    access_token: 'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg',
                    limit: 1
                })
            )
            .then(response => response.json())
            .then(data => {
                setPickupCoordinates(data.features[0].center);
            })
    }

    const getDropoffCoordinates = (dropoff) => {
            //fetch coordinates
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?`+
                new URLSearchParams({
                    access_token: 'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg',
                    limit: 1
                })
            )
            .then(response => response.json())
            .then(data => {
                setDropoffCoordinates(data.features[0].center)
            })
    }
    useEffect(() => {
        getPickupCoordinates(pickup);
        getDropoffCoordinates(dropoff);
    }, [ pickup, dropoff ])

  return (
    <Wrapper>
        <ButtonContainer>
            <Link href='/search'>
               <BackButton src='https://img.icons8.com/ios-filled/50/000000/left.png' />
            </Link>
        </ButtonContainer>
        <Map 
        pickupCoordinates={pickupCoordinates}
        dropoffCoordinates={dropoffCoordinates}
        />
        <RideContainer>
            <RideSelector 
            pickupCoordinates={pickupCoordinates}
            dropoffCoordinates={dropoffCoordinates}
            />

            <ConfirmButtonContainer>
                <confirmButtom>
                    Confirm Uber
                </confirmButtom>
            </ConfirmButtonContainer>
        </RideContainer>
    </Wrapper>
  )
}

export default confirm

const confirmButtom = tw.div`
bg-black text-white text-center py-4 m-4 text-xl cursor-pointer rounded-lg
`
const Wrapper = tw.div`
flex-1 bg-blue-500 h-screen overflow-y-scroll
`
const RideContainer = tw.div`
h-1/2 flex flex-col
`
const Map = tw.div`
h-1/2
`
const ConfirmButtonContainer = tw.div`
border-t-2 border-gray-200 flex-1
`
const ButtonContainer = tw.div`
bg-white px-4 rounded-full absolute top-4 left-4 z-10 shadow-md cursor-pointer
` 
const BackButton = tw.img`
h-full cursor-pointer object-contain
`