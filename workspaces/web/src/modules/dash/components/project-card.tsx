import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useDevAuthStore } from "modules/auth/store/auth-store";
import Image from "next/image";
import { useEffect } from "react";
import { useProjectDetailsStore } from "../stores/project-details.store";

export type DashProjectCardType = {
  id: string;
  title: string;
  description: string;
  finished: boolean;
  finishedAt?: string;
  createdAt: string;
  owner: {
    id: string;
    name?: string;
    githubUsername: string;
    avatarURL: string;
  };
  developers: {
    id: string;
    name?: string;
    githubUsername: string;
    avatarURL: string;
  }[];
  tags: {
    id: string;
    title: string;
  }[];
  likes: {
    developer: {
      id: string
    }
  }[]
};

export const DashProjectCard: React.FC<DashProjectCardType> = (props) => {
  const projectDetailsStore = useProjectDetailsStore();
  const developer = useDevAuthStore(state => state.devInfo?.id)

  useEffect(() => {
    if (!projectDetailsStore.modalOpen && projectDetailsStore.projectInfo) {
      projectDetailsStore.setModalOpen(true);
    }
  }, [projectDetailsStore.projectInfo]);

  return (
    <label
      className="w-full p-4 bg-base-100 shadow-md rounded-sm cursor-pointer hover:shadow-lg"
      onClick={() => projectDetailsStore.setProjectInfo(props)}
      htmlFor="project-details-modal"
    >
      <div className="text-lg">{props.title}</div>
      <div className="max-h-24 text-neutral-content text-opacity-90 overflow-y-hidden my-3">
        {props.description}
      </div>
      <div className="max-w-full overflow-x-hidden flex gap-2">
        {props.tags.map((tag) => (
          <div className="p-1 bg-base-300" key={tag.id}>
            {tag.title}
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between items-center mt-3">
        <div className="flex gap-2">
          <Image
            src={props.owner.avatarURL}
            width={50}
            height={50}
            className="rounded-full p-1 border"
            alt="Owner profile picture"
          />
          <div>
            <div className="text-sm text-neutral-content text-opacity-70">
              Owner
            </div>
            <div className="">
              {props.owner.name ? props.owner.name : props.owner.githubUsername}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className={props.likes.some(x => x.developer.id == developer) ? "btn btn-primary" : "btn"}>
            <HandThumbUpIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </label>
  );
};
