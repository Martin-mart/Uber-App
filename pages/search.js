import React from 'react'
import tw from 'tailwind-styled-components'


const search = () => {
  return (
    <Wrapper>
        {/*Button container*/}
        <ButtonContainer>
            <BackButton src='https://img.icons8.com/ios-filled/50/000000/left.png' />
        </ButtonContainer>

        {/*input container*/}
        <InputContainer>
            <FromToIcons>
                <Circle src='https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png' />
                <Line src='https://img.icons8.com/ios/50/9CA3AF/vertical-line.png' />
                <Square src='https://img.icons8.com/windows/50/000000/square-full.png' />
            </FromToIcons>
            <InputBoxes>
                <Input placeholder='Enter pickup location' />
                <Input placeholder='Where to?' />
            </InputBoxes>
            <PlusIcon src='https://img.icons8.com/ios-filled/50/000000/plus-math.png' />
        </InputContainer>


        {/*saved places*/}
        <SavedPlaces>
            <StarIcon src='https://img.icons8.com/ios-filled/50/ffffff/star--v1.png' />
            Saved Places
        </SavedPlaces>


        {/*confirm location button*/}
        <ConfirmLocationButton>Confirm Location</ConfirmLocationButton>
    </Wrapper>
  )
}

export default Search

const Wrapper = tw.div`
flex-1  bg-gray-200 h-screen
`
const ButtonContainer = tw.div`
bg-white px-4
`
const BackButton = tw.img`
h-12 cursor-pointer
`
const InputContainer = tw.div`
bg-white flex items-center px-4 mb-2
`
const FromToIcons = tw.div`
w-10 flex flex-col mr-2 items-center
`
const Circle = tw.img`
h-3.5
`
const Line = tw.img`
h-10
`
const Square = tw.img`
h-3.5
`
const InputBoxes = tw.div`
flex flex-col flex-1
`
const Input = tw.input`
h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none border-none
`
const PlusIcon = tw.img`
h-10 w-10 bg-gray-200 rounded-full ml-3
`
const SavedPlaces = tw.div`
flex items-center bg-white px-4 py-2
`
const StarIcon = tw.img`
h-10 w-10 bg-gray-400 p-2 rounded-full mr-2
`
const ConfirmLocationButton = tw.div`
bg-black text-white text-center m-4 px-4 py-3 text-xl rounded-lg cursor-pointer
`