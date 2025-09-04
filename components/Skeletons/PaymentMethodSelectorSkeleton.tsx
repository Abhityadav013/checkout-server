// components/Skeletons/PaymentMethodSelectorSkeleton.tsx
export default function PaymentMethodSelectorSkeleton() {
  const SkeletonBox = () => (
    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-md animate-pulse cursor-default">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-300" /> {/* Icon placeholder */}
        <div className="h-5 w-32 rounded bg-gray-300" /> {/* Text placeholder */}
      </div>
      <div className="h-5 w-5 bg-gray-300 rounded" /> {/* Arrow icon placeholder */}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mt-10 select-none">
      <div className="h-7 w-40 mb-6 rounded bg-gray-300 animate-pulse" /> {/* Heading placeholder */}

      <SkeletonBox />
    </div>
  );
}
