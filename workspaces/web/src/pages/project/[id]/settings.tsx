import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { ProjectLayout } from "modules/project/components/layout";
import { ProjectSettingsLayout } from "modules/project/settings/layout";
import Head from "next/head";

export default function Project() {
  return (
    <>
      <Head>
        <title>Develamo</title>
      </Head>
      <ProjectAuthProvider>
        <ProjectLayout>
          <ProjectSettingsLayout />
        </ProjectLayout>
        <FeedbackMessages />
      </ProjectAuthProvider>
    </>
  );
}
