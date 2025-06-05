import CopyToClipboard from "@/components/common/copy-to-clipboard";

interface GroupHeaderProps {
  groupCode: string;
  groupName: string;
}

export function GroupHeader({ groupCode, groupName }: GroupHeaderProps) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-bold">{groupName}</h1>
      <CopyToClipboard
        className="h-fit p-0 text-gray-500 hover:bg-transparent"
        label="Copy code"
        textToCopy={groupCode}
        variant="ghost"
      />
    </div>
  );
}
