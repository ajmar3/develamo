import { BoltIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { DashTabEnum, useDashNavStore } from "../stores/nav-store";

export const DashSideMenu: React.FC = () => {
  const navStore = useDashNavStore();

  const menuItems = [
    {
      title: "Find A Project",
      setting: DashTabEnum.FIND,
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
    },
    {
      title: "My Projects",
      setting: DashTabEnum.MY_PROJECTS,
      icon: <BoltIcon className="h-6 w-6" />,
    },
  ];

  const menuItemsJSX = menuItems.map((item, index) => {
    return (
      <li key={index} onClick={() => navStore.setSelectedTab(item.setting)}>
        <div className="w-full h-10 flex gap-5">
          <span
            className={
              navStore.selectedTab == item.setting ? "text-primary" : ""
            }
          >
            {item.icon}
          </span>
          {item.title}
        </div>
      </li>
    );
  });

  return (
    <div className="w-full h-full border-r border-base-400">
      <ul className="menu bg-base-100 w-full p-2 rounded-box">{menuItemsJSX}</ul>
    </div>
  );
};
