import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { DashLayout } from "modules/dash/components/layout";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Dash() {
  

  return {
    redirect: {
      destination: '/dash/find',
      permanent: false,
    },
  };
}
