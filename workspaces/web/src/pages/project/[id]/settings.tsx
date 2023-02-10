import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { ProjectLayout } from "modules/project/components/layout";
import { ProjectSettingsLayout } from "modules/project/components/settings/layout";

export default function Project() {
  return (
    <ProjectAuthProvider>
      <ProjectLayout>
        <ProjectSettingsLayout />
      </ProjectLayout>
    </ProjectAuthProvider>
  );
}
