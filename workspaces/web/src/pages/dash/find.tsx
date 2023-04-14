import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { DashFindProjectLayout } from "modules/dash/components/find/layout";
import { DashLayout } from "modules/dash/components/layout";
import Head from "next/head";

export default function DashFindProject() {
  return (
    <>
      <Head>
        <title>Develamo</title>
      </Head>
      <DevAuthProvider>
        <DashLayout>
          <DashFindProjectLayout />
        </DashLayout>
        <FeedbackMessages />
      </DevAuthProvider>
    </>
  );
}
