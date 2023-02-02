import { DevAuthProvider } from "modules/auth/components/developer-auth-provider";
import { DashLayout } from "modules/dash/components/layout";
import { DashMyProfileLayout } from "modules/dash/components/my-profile/layout";


export default function DashMyProjects() {
  return (
    <DevAuthProvider>
      <DashLayout>
        <DashMyProfileLayout />
      </DashLayout>
    </DevAuthProvider>
  );
}