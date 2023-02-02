import { useMediaQuery } from "react-responsive";
import { NavBar } from "modules/common/components/navbar";
import { useDevAuthStore } from "modules/auth/store/auth-store";

export const ProfileLayout = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 1000px)",
  });

  const authStore = useDevAuthStore();

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full">
        <NavBar isMobile={isMobile}/>
      </div>
    </div>
  );
};
