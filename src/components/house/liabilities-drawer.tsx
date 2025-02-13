import { Button } from "@ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@ui/drawer";

interface LiabilitiesDrawerProps {
  houseTitle: string;
  balances: {
    amount: string;
    creditor: string;
    creditor_name: string;
    debtor: string;
    debtor_name: string;
  }[];
}

const LiabilitiesDrawer: React.FC<LiabilitiesDrawerProps> = ({
  houseTitle,
  balances,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline">
          Liabilities
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Liabilities for {houseTitle}</DrawerTitle>
          <DrawerDescription>
            Settle up with your friends and housemates
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-6">
          {balances.map((debt, index) => (
            <div
              key={index}
              className="flex justify-between rounded-full border border-gray-200 px-4 py-2 text-base"
            >
              <span>{debt.creditor_name}</span>
              <span>{Number(debt.amount)}</span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LiabilitiesDrawer;
