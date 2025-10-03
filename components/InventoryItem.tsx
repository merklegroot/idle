import { formattingUtil } from '@/utils/formattingUtil';

interface InventoryItemProps {
  resourceKey: string;
  name: string;
  icon: string;
  amount: number;
  onClick: () => void;
}

export default function InventoryItem({ resourceKey, name, icon, amount, onClick }: InventoryItemProps) {
  if (amount === 0) return null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3"
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{name}</div>
        <div className="text-sm text-gray-500">{formattingUtil.formatNumber(amount)}</div>
      </div>
    </div>
  );
}
