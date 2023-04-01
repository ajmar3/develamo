import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { DashFindProjectLayout } from "modules/dash/components/find/layout";
import { DashLayout } from "modules/dash/components/layout";

export default function DashFindProject() {
  return (
    <DevAuthProvider>
      <DashLayout>
        <DashFindProjectLayout />
      </DashLayout>
      <FeedbackMessages />
    </DevAuthProvider>
  );
}
