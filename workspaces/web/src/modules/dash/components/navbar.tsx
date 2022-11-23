interface IDashNavBar {
  isMobile: boolean;
}


export const DashNavBar:React.FC<IDashNavBar> = (props) => {
  return (
    <div className="w-full h-full">
      <div className="h-full navbar bg-base-100 border-b border-base-300 flex justify-center items-center">
        <div className="w-full h-full max-w-8xl">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-2xl font-header">
              develamo
            </a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
