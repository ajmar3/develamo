import { BoltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import Image from "next/image";
import { useState } from "react";
import { useUpdateDeveloperMutation } from "../../hooks/useUpdateDeveloperMutation";
import { DashTabEnum, useDashNavStore } from "../../stores/nav-store";

export const DashUpdateProfileModal: React.FC = () => {
  const userInfo = useDevAuthStore((state) => state.devInfo);
  const updateMutation = useUpdateDeveloperMutation();

  const [nameInput, setNameInput] = useState(userInfo?.name);
  const [bioInput, setBioInput] = useState(userInfo?.bio);

  return (
    <>
      <input
        type="checkbox"
        id="update-profile-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Profile</h3>
          <div className="w-full mt-5">
            <div className="mb-1">Name</div>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name..."
              className="input input-bordered w-full max-w-xs focus:input-secondary"
            />
          </div>
          <div className="w-full mt-5">
            <div className="mb-1">Bio</div>
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Bio..."
              className="textarea textarea-bordered focus:textarea-secondary w-96"
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="modal-action">
              <label htmlFor="update-profile-modal" className="btn">
                Cancel
              </label>
            </div>
            <div className="modal-action">
              <label htmlFor="update-profile-modal" className="btn btn-primary" onClick={() => updateMutation.mutate({
                name: nameInput as string,
                bio: bioInput as string
              })}>
                Save Changes
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
