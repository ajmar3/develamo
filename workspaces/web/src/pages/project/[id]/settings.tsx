import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { FeedbackMessages } from "modules/common/components/feedback-messages";
import { ProjectLayout } from "modules/project/components/layout";
import { ProjectSettingsLayout } from "modules/project/settings/layout";

export default function Project() {
  return (
    <ProjectAuthProvider>
      <ProjectLayout>
        <ProjectSettingsLayout />
      </ProjectLayout>
      <FeedbackMessages />
    </ProjectAuthProvider>
  );
}
