import React, { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Loading from "../../components/Loading";

function index({ channel }) {
  const { data: session } = useSession();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  let router = useRouter();

  useEffect(() => {
    if (router.query.providerid && !session) {
      setProvider(router.query.providerid[0]);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (session) {
      channel.postMessage({ message: "success", channel: "logIn" });
      setLoading(true);
      window.close();
    }
  }, [router.isReady, session]);

  useEffect(() => {
    if (provider && !session) {
      signIn(provider);
      setLoading(false);
    }
  }, [provider]);

  return <div>{loading && <Loading />}</div>;
}

export default index;
