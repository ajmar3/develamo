import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import DesktopHomeLayout from "../modules/home/desktop/layout";
import MobileHomeLayout from "../modules/home/mobile/layout";

export default function Home() {
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
    <>
      <DesktopHomeLayout />
    </>
  );

  else return (
    <>
      <MobileHomeLayout />
    </>
  );
}
