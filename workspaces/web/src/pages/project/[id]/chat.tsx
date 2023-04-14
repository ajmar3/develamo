import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { ProjectChatLayout } from "modules/project/chat/layout";
import { ProjectLayout } from "modules/project/components/layout";
import Head from "next/head";

export default function Project() {
  return (
    <>
      <Head>
        <title>Develamo</title>
      </Head>
      <ProjectAuthProvider>
        <ProjectLayout>
          <ProjectChatLayout />
        </ProjectLayout>
        <FeedbackMessages />
      </ProjectAuthProvider>
    </>
  );
}
