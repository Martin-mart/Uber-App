import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3Jpc3N0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photoUrl: user.photoURL,
        });
      } else {
        setUser(null);
        router.push('/login');
      }
    });
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10', // Changed to light theme
      center: [-99.1332, 19.4326], // Mexico City coordinates from your image
      zoom: 4, // Zoomed out to show North America
    });

    // Add navigation controls like in Uber app
    map.addControl(new mapboxgl.NavigationControl());

    // Add current location marker in the center
    new mapboxgl.Marker({ color: "#3B82F6" })
      .setLngLat([-99.1332, 19.4326])
      .addTo(map);

    window.addEventListener('resize', () => map.resize());
    
    return () => {
      window.removeEventListener('resize', () => map.resize());
    };
  }, []);

  return (
    <Wrapper>
      {/* Top half - Map */}
      <TopContainer>
        <MapContainer id="map" />
        {/* Location indicator on map */}
        <LocationIndicator>
          <LocationDot>📍</LocationDot>
          <LocationText>Current Location</LocationText>
        </LocationIndicator>
      </TopContainer>

      {/* Bottom half - Interface */}
      <BottomContainer>
        <ActionItems>
          {/* Header */}
          <Header>
            <UberLogo src="https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg" />
            <Profile>
              <Name>{user?.name || "User Name"}</Name>
              <UserImage 
                src={user?.photoUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                onClick={() => signOut(auth)}
                alt="Profile"
              />
            </Profile>
          </Header>

          {/* Action Buttons */}
          <ActionButtons>
            <Link href="/search">
              <ActionButton>
                <ActionButtonImage src="https://i.ibb.co/cyvcpfF/uberx.png" alt="Ride" />
                <ActionButtonText>Ride</ActionButtonText>
              </ActionButton>
            </Link>
            <ActionButton>
              <ActionButtonImage src="https://i.ibb.co/n776JLm/bike.png" alt="Wheels" />
              <ActionButtonText>Wheels</ActionButtonText>
            </ActionButton>
            <ActionButton>
              <ActionButtonImage src="https://i.ibb.co/7JjW8cT/reserve.png" alt="Reserve" />
              <ActionButtonText>Reserve</ActionButtonText>
            </ActionButton>
          </ActionButtons>

          {/* Input Button */}
          <Link href="/search">
            <InputButton>
              <InputIcon>📍</InputIcon>
              <InputTextContainer>
                <InputPrimaryText>Where to?</InputPrimaryText>
                <InputSecondaryText>Anywhere • Any time</InputSecondaryText>
              </InputTextContainer>
            </InputButton>
          </Link>
        </ActionItems>
      </BottomContainer>
    </Wrapper>
  );
}

/* Styled Components */

const Wrapper = tw.div`
  flex flex-col h-screen bg-white
`;

/* Top Container (Map) - Exactly half of the screen */
const TopContainer = tw.div`
  relative h-1/2 w-full
`;

const MapContainer = tw.div`
  w-full h-full
`;

const LocationIndicator = tw.div`
  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
  bg-white rounded-full shadow-lg px-4 py-2 flex flex-col items-center
  pointer-events-none
`;

const LocationDot = tw.div`
  text-lg mb-1
`;

const LocationText = tw.div`
  text-xs font-medium text-gray-700 whitespace-nowrap
`;

/* Bottom Container (Interface) - Exactly half of the screen */
const BottomContainer = tw.div`
  h-1/2 w-full bg-white border-t border-gray-200
`;

const ActionItems = tw.div`
  h-full flex flex-col p-6
`;

/* Header */
const Header = tw.div`
  flex justify-between items-center mb-8
`;

const UberLogo = tw.img`
  h-7 w-auto
`;

const Profile = tw.div`
  flex items-center space-x-3
  bg-gray-50 rounded-full pl-3 pr-1 py-1
`;

const Name = tw.div`
  text-sm font-medium text-gray-800 truncate max-w-[100px]
`;

const UserImage = tw.img`
  h-9 w-9 rounded-full border-2 border-white cursor-pointer
  hover:opacity-90 transition-opacity
`;

/* Action Buttons */
const ActionButtons = tw.div`
  flex justify-between mb-6 flex-1
`;

const ActionButton = tw.div`
  flex flex-col items-center justify-center
  w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28
  bg-gray-50 rounded-2xl shadow-sm
  hover:shadow-md transform hover:scale-105 
  transition-all duration-200 cursor-pointer
  active:scale-95
`;

const ActionButtonImage = tw.img`
  h-10 w-10 md:h-12 md:w-12 mb-2
`;

const ActionButtonText = tw.span`
  text-xs md:text-sm font-medium text-gray-800
`;

/* Input Button */
const InputButton = tw.div`
  w-full h-16 bg-gray-50 rounded-full
  shadow-md flex items-center px-6
  cursor-pointer hover:shadow-lg transition-shadow
  border border-gray-100
`;

const InputIcon = tw.div`
  text-xl mr-4 text-gray-600
`;

const InputTextContainer = tw.div`
  flex-1 flex flex-col
`;

const InputPrimaryText = tw.span`
  text-lg font-medium text-gray-800
`;

const InputSecondaryText = tw.span`
  text-xs text-gray-500
`;