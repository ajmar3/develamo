import Image from "next/image";

export const DashNavBar = () => {
  return (
    <div className="w-full bg-base-200 flex justify-center sticky top-0">
      <div className="max-w-8xl w-full flex justify-between px-4 py-2 shadow-md">
        <Image src={"/images/DEVELAMO ELEPHANT WHT.png"} width={50} height={50} alt="hello"/>
      </div>
    </div>
  );
};
