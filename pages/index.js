import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import tw from 'tailwind-styled-components'
import mapboxgl from '!mapbox-gl'
import Link from 'next/link'

mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3N0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

export default function Home() {

   
    return (
        <wrapper>
            <map id='map'></map>
            <ActionItems>
                {/*Header*/}
                <header>
                    <UberLogo src='https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg' />
                    <Profile>
                        <Name>Criss</Name>
                        <UserImage src='https://i.ibb.co/5RjchBg/profile-img.png' />
                    </Profile>
                </header>

                {/*ActionButtons*/}
                <ActionButtons>
                    <Link href='/search'>
                        <ActionButton>
                            <ActionButtomImage src='https://i.ibb.co/cyvcpfF/uberx.png' />
                            Ride
                        </ActionButton>
                    </Link>
                    <ActionButton>
                        <ActionButtomImage src='https://i.ibb.co/n776JLm/bike.png' />
                        Wheels
                        </ActionButton>
                    <ActionButton>
                        <ActionButtomImage src='https://i.ibb.co/7JjW8cT/reserve.png' />
                        Reserve
                        </ActionButton>
                </ActionButtons>

                
                {/*InputButtons*/}
                <InputBotton>Where to?</InputBotton>
                {/*SavedPlaces*/}
            </ActionItems>
        </wrapper>
    )
}

const wrapper = tw.div`
    flex flex-col  h-screen
`

const ActionItems = tw.div`
    flex-1 p-4
`

const map = tw.div`
    bg-red-500 flex-1
`
const UberLogo = tw.img`
    h-28
`

const Profile = tw.div`
    flex items-center
`
const Name = tw.div`
    mr-4 w-20 text-sm
`
const UserImage = tw.img`
    h-12 w-12 rounded-full border border-gray-200 p-px cursor-pointer
`
const header = tw.div`
    flex justify-between items-center
`
const ActionButtons = tw.div`
    flex
`
const ActionButton = tw.div`
    bg-gray-200 flex-1 m-1 h-32 items-center flex flex-col justify-center rounded-lg transform hover:scale-105 transition text-xl cursor-pointer
`
const ActionButtomImage = tw.img`
    h-3/5
`
const InputBotton = tw.div`
    h-20 bg-gray-200 text-2xl p-4 flex items-center mt-8 rounded-lg cursor-pointer
`