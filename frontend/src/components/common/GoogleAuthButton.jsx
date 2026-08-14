import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Google Identity Services failed to load."));

    document.head.appendChild(script);
  });
};

const GoogleAuthButton = ({ onCredential, text = "continue_with" }) => {

  console.log(
    "Google Client ID configured:",
    Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  );
  const buttonRef = useRef(null);

  const [available, setAvailable] = useState(
    Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  );

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Google Auth: VITE_GOOGLE_CLIENT_ID is missing.");

      setAvailable(false);
      return;
    }

    let cancelled = false;

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript();

        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response?.credential) {
              console.error("Google Auth: No credential received.");
              return;
            }

            onCredential(response.credential);
          },
        });

        buttonRef.current.innerHTML = "";

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text,
          width: buttonRef.current.offsetWidth || 320,
        });

        setAvailable(true);
      } catch (error) {
        console.error("Google Auth initialization failed:", error);
        setAvailable(false);
      }
    };

    initializeGoogle();

    return () => {
      cancelled = true;
    };
  }, [onCredential, text]);

  if (!available) {
    return null;
  }

  return (
    <div ref={buttonRef} className="flex min-h-[44px] w-full justify-center" />
  );
};

export default GoogleAuthButton;
