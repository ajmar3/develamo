import { LoadingSpinner } from "modules/common/components/loading-spinner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const ProjectNavBar = () => {
  const router = useRouter();
  const [route, setRoute] = useState("");
  const [routerPath, setRouterPath] = useState("");

  useEffect(() => {
    if (router.pathname && router.pathname.split("/").length > 2) {
      setRoute(router.pathname.split("/")[3]);
      setRouterPath("/" + router.asPath.split("/").slice(1, 3).join("/"));
    }
  }, [, router.pathname]);

  return (
    <div className="w-full bg-base-200 flex flex-col items-center sticky top-0 shadow-md">
      <Link
        href={"/dash/find"}
        className="max-w-8xl w-full flex justify-between px-4 py-3"
      >
        <Image
          src={"/images/DEVELAMO ELEPHANT WHT.png"}
          width={50}
          height={50}
          alt="hello"
        />
      </Link>
      <div className="w-full max-w-8xl px-3">
        <div className="w-full border-b border-base-content"></div>
      </div>
      <div className="max-w-8xl w-full flex gap-3 px-4 py-3">
        <Link
          href={routerPath + "/chat"}
          className={route == "chat" ? "btn btn-sm btn-primary" : "btn btn-sm"}
        >
          Chat
        </Link>
        <Link
          className={
            route == "kanban" ? "btn btn-sm btn-primary" : "btn btn-sm"
          }
          href={routerPath + "/kanban"}
        >
          Kanban
        </Link>
        <Link
          className={
            route == "settings" ? "btn btn-sm btn-primary" : "btn btn-sm"
          }
          href={routerPath + "/settings"}
        >
          Settings
        </Link>
      </div>
    </div>
  );
};
