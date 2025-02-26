import CopyToClipboard from "@/components/common/copy-to-clipboard";

interface HouseHeaderProps {
  houseTitle: string;
  groupCode: string;
}

const HouseHeader: React.FC<HouseHeaderProps> = ({ houseTitle, groupCode }) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{houseTitle}</h1>
      <CopyToClipboard
        textToCopy={groupCode}
        label="Copy code"
        variant="ghost"
        className="h-fit p-0 text-gray-500"
      />
    </div>
  );
};

export default HouseHeader;
