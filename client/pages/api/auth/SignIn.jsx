import { signIn, getProviders } from "next-auth/react";
import { CgCloseO } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({ providers, showSignIn, setShowSignIn }) {
  const [redirectTo, setRedirectTo] = useState(null);
  const router = useRouter();

  const handleSignIn = (providerId) => {
    let openWindow = window.open(
      `/signin/${providerId}`,
      "Sign In",
      "width=400,height=600,resizable,scrollbars=yes,status=1"
    );

    openWindow?.focus();
  };

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
            <li key={provider.id}>
              {provider.name === "Google" && <FcGoogle className="Google" />}
              <button
                onClick={() => {
                  handleSignIn(provider.id);
                  setShowSignIn(false);
                }}
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
