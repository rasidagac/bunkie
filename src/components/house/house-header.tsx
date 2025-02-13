import CopyToClipboard from "@/components/copy-to-clipboard";

interface HouseHeaderProps {
  houseTitle: string;
  code: string;
}

const HouseHeader: React.FC<HouseHeaderProps> = ({ houseTitle, code }) => {
  return (
    <div>
      <h1 className="text-xl font-bold">{houseTitle}</h1>
      <CopyToClipboard
        textToCopy={code}
        label="Copy code"
        variant="ghost"
        className="h-fit p-0 text-gray-500"
      />
    </div>
  );
};

export default HouseHeader;
