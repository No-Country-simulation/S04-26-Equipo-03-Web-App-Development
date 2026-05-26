export const RutyHelpCallout = () => {
  return (
    <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] p-[13.25px] px-[15.24px] flex items-center justify-between w-full mt-[8px]">
      <div className="flex flex-col">
        <span className="text-[#374151] text-[13px] font-semibold font-['Inter'] leading-[19.5px]">¿No sabés bien qué elegir?</span>
        <span className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">Te ayudamos con sugerencias basadas en tu CV o LinkedIn.</span>
      </div>
      <button className="bg-white border border-[#d1d5db] px-[12.25px] py-[8.25px] rounded-[8px] text-[#1f2937] text-[12px] font-medium font-['Inter'] shadow-none hover:bg-gray-50 transition-colors cursor-pointer shrink-0">
        Pedir ayuda a Ruty
      </button>
    </div>
  );
};
