import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import Link from 'next/link';

const Search = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  return (
    <Wrapper>
      {/* Back button - smaller and cleaner like Uber */}
      <Header>
        <Link href="/">
          <BackButtonContainer>
            <BackButton src="https://img.icons8.com/ios-filled/50/000000/left.png" alt="Back" />
          </BackButtonContainer>
        </Link>
      </Header>

      {/* Input container - cleaner design */}
      <InputContainer>
        <FromToIcons>
          <Circle src="https://img.icons8.com/ios-filled/50/000000/filled-circle.png" alt="Pickup" />
          <Line src="https://img.icons8.com/ios/50/9CA3AF/vertical-line.png" alt="Line" />
          <Square src="https://img.icons8.com/windows/50/000000/square-full.png" alt="Destination" />
        </FromToIcons>
        <InputBoxes>
          <Input
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
          <Input
            placeholder="Where to?"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          />
        </InputBoxes>
        <PlusIcon src="https://img.icons8.com/ios-filled/50/000000/plus-math.png" alt="Add" />
      </InputContainer>

      {/* Saved places - styled like Uber */}
      <SavedPlaces>
        <StarIcon src="https://img.icons8.com/ios-filled/50/ffffff/star--v1.png" alt="Saved" />
        Saved Places
      </SavedPlaces>

      {/* Confirm location button - matches home page style */}
      <Link
        href={{
          pathname: '/confirm',
          query: { pickup: pickup, dropoff: dropoff },
        }}
      >
        <ConfirmButtonContainer disabled={!pickup || !dropoff}>
          Confirm Locations
        </ConfirmButtonContainer>
      </Link>
    </Wrapper>
  );
};

export default Search;

/* Styled Components - Updated to match Uber/home page style */
const Wrapper = tw.div`
  flex flex-col h-screen bg-white
`;

const Header = tw.div`
  px-4 py-3 border-b border-gray-100
`;

const BackButtonContainer = tw.div`
  inline-block
`;

const BackButton = tw.img`
  h-6 w-6 cursor-pointer
`;

const InputContainer = tw.div`
  bg-white flex items-center px-4 py-3 border-b border-gray-100
`;

const FromToIcons = tw.div`
  w-8 flex flex-col items-center mr-3
`;

const Circle = tw.img`
  h-3 w-3
`;

const Line = tw.img`
  h-6 w-0.5 my-1
`;

const Square = tw.img`
  h-3 w-3
`;

const InputBoxes = tw.div`
  flex flex-col flex-1
`;

const Input = tw.input`
  h-12 w-full bg-transparent outline-none text-gray-800 placeholder-gray-400
  border-none focus:outline-none text-base
`;

const PlusIcon = tw.img`
  h-8 w-8 bg-gray-100 rounded-full p-2 ml-3
`;

const SavedPlaces = tw.div`
  flex items-center bg-white px-4 py-4 border-b border-gray-100
  text-gray-800 font-medium
`;

const StarIcon = tw.img`
  h-8 w-8 bg-gray-800 p-2 rounded-full mr-3
`;

const ConfirmButtonContainer = tw.div`
  bg-gray-900 text-white text-center mx-4 mt-4 py-4 
  text-lg font-medium rounded-lg cursor-pointer
  hover:bg-black transition-colors duration-200
  disabled:bg-gray-300 disabled:cursor-not-allowed
  active:scale-95 transform transition-transform
`;