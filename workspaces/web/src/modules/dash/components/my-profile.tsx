import { BoltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import Image from "next/image";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";
import { DashUpdateProfileModal } from "./update-profile-modal";

export const DashMyProfile: React.FC = () => {
  const userInfo = useDevAuthStore((state) => state.devInfo);
  return (
    <div className="w-full px-6 py-4">
      <div className="w-full flex gap-5 items-center">
        <Image
          width={100}
          height={100}
          src={userInfo?.avatarURL as string}
          alt="User Profile Picture"
          className="rounded-full p-1 border border-secondary"
        />
        <div>
          <div className="text-lg font-semibold">{userInfo?.name}</div>
          <a
            href={"https://github.com/" + userInfo?.githubUsername}
            className="text-base-content text-opacity-70"
          >
            @{userInfo?.githubUsername}
          </a>
        </div>
      </div>
      <div className="text-sm mt-3">{userInfo?.bio}</div>
      <div className="w-full flex justify-center mt-4">
        <label
          htmlFor="update-profile-modal"
          className="btn btn-outline btn-block"
        >
          Update Profile
        </label>
      </div>
      <DashUpdateProfileModal />
    </div>
  );
};
