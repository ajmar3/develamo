import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { ProjectLayout } from "modules/project/components/layout";

export default function Project() {
  return (
    <ProjectAuthProvider>
      <ProjectLayout>
        <div className="w-full h-full">setting</div>
      </ProjectLayout>
    </ProjectAuthProvider>
  );
}
