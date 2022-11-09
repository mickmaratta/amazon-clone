import { getProviders, signIn } from "next-auth/react";
import google from "../../assets/images/google-logo.png";
import Header from "../../components/Header";
import Image from "next/image";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
const router = useRouter();
const { query: { callbackUrl } } = useRouter();
  const handleDemoSignIn = () => {
    signIn("credentials", { username: "Carlos Cat", password: "password", redirect: false});
    router.push('/')
  };
  const handleGoogleSignIn = (id) => {
    signIn(id, {callbackUrl});
    router.push('/')
  };
  
  return (
    <div className="h-screen bg-amazon_blue">
      <div className="flex h-[80%] items-center justify-center flex-col gap-10">
        <Image
          src="https://links.papareact.com/f90"
          width={150}
          height={40}
          objectFit="contain"
          className="cursor-pointer"
        />
        <div className="bg-white w-96 py-10 rounded-md shadow-lg flex flex-col items-center gap-8">
          <h2 className="text-2xl text-amazon_blue tracking-wide font-bold">
            Sign In
          </h2>
          {Object.values(providers).map((provider) => (
            <div
              className="flex flex-col gap-6 w-full items-center"
              key={provider.name}
            >
              {provider.name === "Google" && (
                <button
                  className="signInButton"
                  onClick={() => handleGoogleSignIn(provider.id)}
                >
                  <img className="h-6" src={google} alt="" />
                  Sign in with {provider.name}
                </button>
              )}
              {provider.name === "Credentials" && (
                <button className="signInButton" onClick={() => handleDemoSignIn()}>
                  Sign in with Demo
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
