import React, { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Loading from "../../components/Loading";

function index() {
  const { data: session } = useSession();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  let router = useRouter();

  useEffect(() => {
    if (router.query.providerid) {
      setProvider(router.query.providerid[0]);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (provider) {
      signIn(provider);
      setLoading(false);
    }
  }, [provider]);

  if (session) window.close();

  return <div>{loading && <Loading />}</div>;
}

export default index;
