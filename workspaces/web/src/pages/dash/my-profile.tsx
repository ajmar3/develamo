import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { DashLayout } from "modules/dash/components/layout";
import { DashMyProfileLayout } from "modules/dash/components/my-profile/layout";
import Head from "next/head";

export default function DashMyProjects() {
  return (
    <>
      <Head>
        <title>Develamo</title>
      </Head>
      <DevAuthProvider>
        <DashLayout>
          <DashMyProfileLayout />
        </DashLayout>
        <FeedbackMessages />
      </DevAuthProvider>
    </>
  );
}
