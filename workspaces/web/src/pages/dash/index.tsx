import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { DashLayout } from "modules/dash/components/layout";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Dash() {
  return (
    <DevAuthProvider>
      <DashLayout />
    </DevAuthProvider>
  );
}
