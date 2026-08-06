import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Home", position: "left-[calc(50.00%_-_544px)]" },
  { label: "Project", position: "left-[calc(50.00%_-_390px)]" },
  { label: "About", position: "left-[calc(50.00%_-_224px)]" },
  { label: "Process", position: "left-[calc(50.00%_+_114px)]" },
  { label: "Contact", position: "left-[calc(50.00%_+_286px)]" },
  { label: "Reviews", position: "left-[calc(50.00%_+_452px)]" },
];

export const Phyo = (): JSX.Element => {
  return (
    <div className="bg-white w-full min-w-[1440px] min-h-[1763px] flex flex-col">
      <nav className="ml-[131px] w-[1191px] h-[100px] relative mt-14">
        <div className="absolute top-[3px] left-[calc(50.00%_-_596px)] w-[1179px] h-[95px] bg-white rounded-[100px] border border-solid border-[#c1b8a7] shadow-[0px_8px_18px_#cda1561a,0px_33px_33px_#cda15617,0px_74px_44px_#cda1560d,0px_131px_53px_#cda15603,0px_205px_57px_transparent]" />

        {navigationItems.map((item, index) => (
          <button
            key={index}
            className={`${item.position} absolute top-[42px] [font-family:'Inria_Serif',Helvetica] font-normal text-[#454023] text-2xl text-center tracking-[0] leading-[120.0px] whitespace-nowrap cursor-pointer hover:opacity-80 transition-opacity`}
          >
            {item.label}
          </button>
        ))}

        <img
          className="absolute top-0 left-[calc(50.00%_-_72px)] w-[98px] h-[100px] rounded-[453px] object-cover"
          alt="Image"
          src="/figmaAssets/image-1.png"
        />
      </nav>

      <h1 className="h-[158px] w-[986px] self-center mt-[123px] [font-family:'Vigosamine-Regular',Helvetica] font-normal text-[#454023] text-[92px] text-center tracking-[-1.84px] leading-[100px]">
        Lorem Ipsum is simply dummy text of the printing
      </h1>

      <Button className="ml-px h-[115px] w-[303px] self-center mt-[222px] bg-[#890002] hover:bg-[#6d0002] rounded-[35px] p-[7.33px]">
        <span className="[font-family:'Inter_Tight',Helvetica] font-normal text-white text-[67.4px] text-center tracking-[-1.35px] leading-[73.3px] whitespace-nowrap">
          Explore
        </span>
      </Button>

      <img
        className="w-[1440px] h-[807.96px] mt-[119px]"
        alt="Group"
        src="/figmaAssets/group-2147226555.png"
      />
    </div>
  );
};
