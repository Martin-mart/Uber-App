import React, { useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/router';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebase';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
  }, []);

  return (
    <Wrapper>
      <UberLogo src="https://i.ibb.co/ZMhy8ws/uber-logo.png" />
      <Title>Sign in to access your account</Title>
      <HeadImage src="https://i.ibb.co/CsV9RYZ/login-image.png" />
      <SignInButton onClick={() => signInWithPopup(auth, provider)}>
        Sign In with Google
      </SignInButton>
    </Wrapper>
  );
};

export default Login;

const Wrapper = tw.div`
  h-screen bg-gray-200 flex flex-col justify-center items-center p-4
  sm:p-6 md:p-8
`;

const SignInButton = tw.div`
  bg-black text-white py-3 px-6 mt-6 cursor-pointer w-full sm:w-3/4 md:w-1/2 text-center rounded-lg hover:bg-gray-800
`;

const UberLogo = tw.img`
  h-16 sm:h-20 md:h-24 w-auto mb-6
`;

const Title = tw.div`
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 text-center mb-6
`;

const HeadImage = tw.img`
  object-contain w-full sm:w-3/4 md:w-1/2 mb-6
`;
