
interface FeaturesTotalValueProps {
  totalValue: number;
}

export function FeaturesTotalValue({ totalValue }: FeaturesTotalValueProps) {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">Selected Features Value:</span>
        <span className="font-semibold text-green-600">
          +${totalValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
