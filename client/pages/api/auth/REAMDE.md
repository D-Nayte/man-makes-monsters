# Importand!!

https://console.developers.google.com/apis/credentials

The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;

For production: https://{YOUR_DOMAIN}/api/auth/callback/google
For development: http://localhost:3000/api/auth/callback/google

##ALSD
NEXTAUTH_URL=https://example.com to the server domain
//this is important for production - we need the domain so Auth knows it. for devlopment we need don't

# App wrapper

```js
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

# Hook

```js
import { signIn, getProviders, useSession } from "next-auth/react";
//...

const { data: session } = useSession();
```
