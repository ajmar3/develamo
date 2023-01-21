export type ChatListDMType = {
  id: string;
  participants: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[];
  messages: {
    id: string
    sentAt: Date;
    sender: {
      id: string;
      githubUsername: string;
      name: string;
      avatarURL: string;
    };
    text: string;
    seen: boolean;
  }[];
};

export type ChatListProjectType = {
  id: string;
  participants: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[];
  messages: {
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
  }[];
};

export type ChatInfoType = {
  id: string;
  participants: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  }[];
  messages: {
    id: string
    sentAt: Date;
    sender: {
      id: string;
      githubUsername: string;
      name: string;
      avatarURL: string;
    };
    text: string;
    seen: boolean;
  }[];
}

export type DirectMessageType = {
  id: string
  sentAt: Date;
  sender: {
    id: string;
    githubUsername: string;
    name: string;
    avatarURL: string;
  };
  text: string;
  seen: boolean;
}