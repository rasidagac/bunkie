import CopyToClipboard from "@/components/common/copy-to-clipboard";

interface GroupHeaderProps {
  groupName: string;
  groupCode: string;
}

export function GroupHeader({ groupName, groupCode }: GroupHeaderProps) {
  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-bold">{groupName}</h1>
      <CopyToClipboard
        textToCopy={groupCode}
        label="Copy code"
        variant="ghost"
        className="h-fit p-0 text-gray-500 hover:bg-transparent"
      />
    </div>
  );
}
