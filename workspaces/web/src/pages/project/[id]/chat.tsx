import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { ProjectChatLayout } from "modules/project/chat/layout";
import { ProjectLayout } from "modules/project/components/layout";

export default function Project() {
  return (
    <ProjectAuthProvider>
      <ProjectLayout>
        <ProjectChatLayout />
      </ProjectLayout>
    </ProjectAuthProvider>
  );
}
