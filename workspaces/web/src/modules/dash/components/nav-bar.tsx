import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const DashNavBar = () => {
  const router = useRouter();
  const [route, setRoute] = useState("find");

  useEffect(() => {
    if (router.pathname && router.pathname.split("/").length > 2) {
      setRoute(router.pathname.split("/")[2]);
    }
  }, [, router.pathname]);

  return (
    <div className="w-full bg-base-200 flex flex-col items-center sticky top-0 shadow-md">
      <div className="max-w-8xl w-full flex justify-between px-4 py-3">
        <Image src={"/images/DEVELAMO ELEPHANT WHT.png"} width={50} height={50} alt="hello"/>
      </div>
      <div className="w-full max-w-8xl px-3"><div className="w-full border-b border-base-content"></div></div>
      <div className="max-w-8xl w-full flex gap-3 px-4 py-3">
        <button className={route == "find" ? "btn btn-sm btn-primary" : "btn btn-sm"} onClick={() => router.push("/dash/find", undefined, { shallow: true })}>Find a project</button>
        <button className={route == "my-projects" ? "btn btn-sm btn-primary" : "btn btn-sm"} onClick={() => router.push("/dash/my-projects", undefined, { shallow: true })}>My Projects</button>
        <button className={route == "my-profile" ? "btn btn-sm btn-primary" : "btn btn-sm"} onClick={() => router.push("/dash/my-profile", undefined, { shallow: true })}>My Profile</button>
      </div>
    </div>
  );
};
