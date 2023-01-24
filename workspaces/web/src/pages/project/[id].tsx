import { ProjectAuthProvider } from "modules/auth/components/project-auth-provider";

export default function Project() {
  return (
    <ProjectAuthProvider>
      hello
    </ProjectAuthProvider>
  );
}
