import { signIn, getProviders } from "next-auth/react";
import { CgCloseO } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";

const redirectTo = { callbackUrl: "http://manmakesmonster.com" };

export default function SignIn({ providers, showSignIn, setShowSignIn }) {
  if (!showSignIn) return;

  return (
    <div className="gameRulesBackdrop">
      <div className="singIn-wrapper">
        <h2>
          <p>Sign in with:</p>
          <button onClick={() => setShowSignIn(false)}>
            <CgCloseO className="signInClose" />
          </button>
        </h2>

        <ul className="authProviderButtonContainer">
          {Object.values(providers).map((provider) => (
            <li>
              {provider.name === "Google" && <FcGoogle className="Google" />}
              <button
                onClick={() => signIn(provider.id, redirectTo)}
                className="authProviderButton">
                {`Sign in with ${provider.name}`}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
