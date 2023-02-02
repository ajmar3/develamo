import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { DashLayout } from "modules/dash/components/layout";
import { DashMyProjectLayout } from "modules/dash/components/my-projects/layout";


export default function DashMyProjects() {
  return (
    <DevAuthProvider>
      <DashLayout>
        <DashMyProjectLayout />
      </DashLayout>
    </DevAuthProvider>
  );
}
