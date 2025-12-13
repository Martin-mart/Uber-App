import { useEffect, useState, useRef } from 'react';
import tw from 'tailwind-styled-components';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

mapboxgl.accessToken =
  'pk.eyJ1IjoiY3Jpc3R0b2xsb3IiLCJhIjoiY2t2bmdsNnE2MGN1czJwbzQ3eGZtbWw0ciJ9.Df7y8nU6Tm8KXoXo5q3ZIg';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser({
          name: currentUser.displayName,
          photoUrl: currentUser.photoURL,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- MAP INIT ---------------- */
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-99.1332, 19.4326], // Default: Mexico City
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;

    window.addEventListener('resize', () => map.resize());
    return () => window.removeEventListener('resize', () => map.resize());
  }, []);

  if (loading) return <LoadingText>Loading user...</LoadingText>;

  return (
    <Wrapper>
      {/* Map Half */}
      <TopContainer>
        <MapContainer ref={mapContainer} />
      </TopContainer>

      {/* Interface Half */}
      <BottomContainer>
        <ActionItems>
          {/* Header */}
          <Header>
            <UberLogo src="https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg" />
            <Profile>
              <Name>{user?.name || 'User Name'}</Name>
              <UserImage
                src={
                  user?.photoUrl ||
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
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
              <ActionButtonImage src="https://i.ibb.co/5RjchBg/uberblack.png" alt="Reserve" />
              <ActionButtonText>Reserve</ActionButtonText>
            </ActionButton>
          </ActionButtons>

          {/* Input */}
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

/* ---------------- STYLED COMPONENTS ---------------- */
const Wrapper = tw.div`flex flex-col h-screen bg-white`;
const LoadingText = tw.div`text-center mt-10 text-gray-500 text-lg`;

const TopContainer = tw.div`relative h-1/2 w-full`;
const MapContainer = tw.div`w-full h-full`;

const BottomContainer = tw.div`h-1/2 w-full bg-white border-t border-gray-200`;
const ActionItems = tw.div`h-full flex flex-col p-6`;

const Header = tw.div`flex justify-between items-center mb-8`;
const UberLogo = tw.img`h-7 w-auto`;
const Profile = tw.div`flex items-center space-x-3 bg-gray-50 rounded-full pl-3 pr-1 py-1`;
const Name = tw.div`text-sm font-medium text-gray-800 truncate max-w-[100px]`;
const UserImage = tw.img`h-9 w-9 rounded-full border-2 border-white cursor-pointer hover:opacity-90 transition-opacity`;

const ActionButtons = tw.div`flex justify-between mb-6 flex-1`;
const ActionButton = tw.div`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95`;
const ActionButtonImage = tw.img`h-10 w-10 md:h-12 md:w-12 mb-2`;
const ActionButtonText = tw.span`text-xs md:text-sm font-medium text-gray-800`;

const InputButton = tw.div`w-full h-16 bg-gray-50 rounded-full shadow-md flex items-center px-6 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100`;
const InputIcon = tw.div`text-xl mr-4 text-gray-600`;
const InputTextContainer = tw.div`flex-1 flex flex-col`;
const InputPrimaryText = tw.span`text-lg font-medium text-gray-800`;
const InputSecondaryText = tw.span`text-xs text-gray-500`;
