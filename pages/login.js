import React , {useEffect} from 'react'
import tw from 'tailwind-styled-components'
import { useRouter } from 'next/router'
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { auth, provider } from '../firebase'


const Login = () => {

    const router = useRouter();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user){
                router.push('/');
            }
        });
    }, []);

  return (
    <Wrapper>
        <UberLogo src='https://i.ibb.co/ZMhy8ws/uber-logo.png' />
        <Title>Sign in to access your account</Title>
        <HeadImage src='https://i.ibb.co/CsV9RYZ/login-image.png' />
        <SignInButton onClick={() => signInWithPopup(auth, provider)}>Sign In with Google</SignInButton>
    </Wrapper>
  )
}

export default Login

const Wrapper = tw.div`
h-screen bg-gray-200 flex flex-col w-screen p-4
`
const SignInButton = tw.div`
bg-black text-white  py-4 mt-4 self-center cursor-pointer w-full
`
const UberLogo = tw.img`
h-20 w-auto object-contain self-start
`
const Title = tw.div`
text-5xl pt-4 text-gray-500
`
const HeadImage = tw.img`
object-contain w-full
`