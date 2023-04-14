import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { ProjectKanbanLayout } from "modules/project/kanban/layout";
import { ProjectLayout } from "modules/project/components/layout";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import Head from "next/head";

export default function Project() {
  return (
    <>
      <Head>
        <title>Develamo</title>
      </Head>
      <ProjectAuthProvider>
        <ProjectLayout>
          <ProjectKanbanLayout />
        </ProjectLayout>
        <FeedbackMessages />
      </ProjectAuthProvider>
    </>
  );
}
