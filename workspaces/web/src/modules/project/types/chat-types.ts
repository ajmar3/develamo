export type ChatInfoType = {
  id: string;
  channels: ProjectChatChannelType[]
};

export type ProjectChatChannelType = {
  id: string,
  name: string,
  createdAt: string
  messages: ProjectChatMessageType[];
  participants: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[];
  admins: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[];
}

export type ProjectChatMessageType = {
  id: string
  sentAt: Date;
  sender: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  };
  text: string;
  seenBy: {
    id: string
  }[];
  channelId: string
}

export type ProjectInfoType = {
  id: string,
  title: string,
  description: string,
  repoURL: string,
  chat: ChatInfoType,
  developers: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[],
  owner: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }
}

export type ProjectDeveloperType = {
  id: string;
  githubUsername: string;
  name: string;
  avatarURL: string;
}

export type ProjectApplicationType = {
  id: string;
  createdAt: string;
  requester: {
      id: string;
      name: string;
      githubUsername: string;
      avatarURL: string;
      bio?: string
  };
}

export type EditProjectType = {
  title: string,
  description: string,
  repoURL: string,
}

export type RemoveDevFromProjectType = {
  projectId: string,
  developerId: string,
}