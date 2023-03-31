import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";
import { ProjectKanbanLayout } from "modules/project/kanban/layout";
import { ProjectLayout } from "modules/project/components/layout";

export default function Project() {
  return (
    <ProjectAuthProvider>
      <ProjectLayout>
        <ProjectKanbanLayout />
      </ProjectLayout>
    </ProjectAuthProvider>
  );
}
