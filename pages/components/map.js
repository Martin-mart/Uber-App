import React, { use } from 'react'
import { useEffect } from 'react'
import mapboxgl from '!mapbox-gl'
import tw from 'tailwind-styled-components'
import Map  from './components/Map'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

const map = (props) => {

    useEffect(() => {
            const map = new mapboxgl.Map({
                container: "map", // container ID
                style: 'mapbox://styles/drakosi/ckvcwq3rw4314o3i2ho8tph',
                center: [-1.3129621994752918, 36.827350878476445], // starting position [lng, lat]
                zoom: 3, // starting zoom
            })
            if(props.pickupCoordinates){
                addToMap(map, props.pickupCoordinates)
            }

            if(props.dropoffCoordinates){
                addToMap(map, props.dropoffCoordinates)
            }

            //auto zoom and centering

            if(props.pickupCoordinates && props.dropoffCoordinates){
                map.fitBounds(
                    [props.pickupCoordinates, props.dropoffCoordinates],
                    {
                        padding: 60
                    }
                )
            }

        }, [props.pickupCoordinates, props.dropoffCoordinates])

        const addToMap = (map, coordinates) => {
          const marker1 = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map);
        }



  return (
    <wrapper id='map'></wrapper>
  )
}

export default map

const wrapper = tw.div`
flex-1  h-1/2
`