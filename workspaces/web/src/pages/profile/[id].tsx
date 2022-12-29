import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";


export default function Home() {
  return (
    <DevAuthProvider>
      hello
    </DevAuthProvider>
  );
}
