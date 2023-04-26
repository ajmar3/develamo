import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useSignInMutation } from "modules/home/hooks/useSignInMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function DesktopHomeLayout() {
  const router = useRouter();

  const mutation = useSignInMutation();

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (router.query.code && !mutation.isSuccess) {
      mutation.mutate({
        code: router.query.code as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, router.query]);

  useEffect(() => {
    const token = document.cookie.split(";").find((c) => c.includes("Authorization"))?.split("=")[1];
    if (mutation.isSuccess && !token) {
      document.cookie = `Authorization=${mutation.data}; path=/; SameSite=None;`;
      setCount(count + 1);
    }
    if (mutation.isError) {
      document.cookie = "";
    }
    
  }, [mutation.data]);


  useEffect(() => {
    const token = document.cookie.split(";").find((c) => c.includes("Authorization"))?.split("=")[1];
    if (token) {
      router.push("/dash/find");
    }
  }, [count]);

  
  return (
    <div className="w-screen h-screen">
      <div className="spacer layer flex justify-center items-center">
        <div className="w-140 border rounded-md shadow-xl bg-base-200 p-8">
          <div className="w-full flex mb-5">
            <Image
              src={"/images/develamo_logo_with_name_white.png"}
              alt=""
              width={"400"}
              height={"0"}
            />
          </div>
          <div className="text-lg mb-5">
            Welcome to Develamo, a community for developers to meet and build
            projects together using their favourite technologies!
          </div>
          <Link
            href={process.env.NEXT_PUBLIC_GITHUB_URL || "#"}
            className="w-full"
          >
            <button
              className={
                mutation.isLoading
                  ? "btn btn-primary w-full loading"
                  : "btn btn-primary w-full"
              }
              disabled={mutation.isLoading}
            >
              Sign in with Github
              <span className="mx-4">|</span>
              <FontAwesomeIcon
                icon={faGithub}
                className="text-white"
                size="2x"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
