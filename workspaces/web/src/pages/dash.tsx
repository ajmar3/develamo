import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";


export default function Dash() {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1000px)'
  });

  //have to use this work around as I am getting a hydration error from Next if I run this conditional without.
  //seems to be a problem with the ssr rendering one thing and my client side code rendering another
  const [showDesktop, setShowDesktop] = useState(true);
  useEffect(() => {
    if (isDesktop) setShowDesktop(true);
    else setShowDesktop(false);
  }, [, isDesktop]);


  if (showDesktop) return (
    <DevAuthProvider>
      <div>DesktopDash</div>
    </DevAuthProvider>
  );

  else return (
    <>
      <div>MobileDash</div>
    </>
  );
}
