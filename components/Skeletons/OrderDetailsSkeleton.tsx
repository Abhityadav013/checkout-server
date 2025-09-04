import { Divider } from "@mui/material";

// components/Skeletons/OrderDetailsSkeleton.tsx
export default function OrderDetailsSkeleton() {
    const SkeletonBox = () => (
        <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-100 rounded cursor-pointer animate-pulse">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-300" /> {/* Icon placeholder */}
                <div className="flex flex-col gap-1">
                    <div className="h-4 w-28 bg-gray-300 rounded" /> {/* Name placeholder */}
                    <div className="h-3 w-20 bg-gray-200 rounded" /> {/* Phone/address/time/etc */}
                </div>
            </div>
            <div className="h-4 w-4 bg-gray-300 rounded" /> {/* Arrow icon */}
        </div>
    );

    const StyledDivider = () => (
        <Divider sx={{ backgroundColor: '#E0E0E0', my: 1 }} />
    );

    return (
        <div className="bg-white rounded-lg shadow p-4 space-y-4 max-w-md mx-auto mt-10">
            <h2 className="text-xl font-semibold">Order details</h2>

            <SkeletonBox /> {/* UserInfo */}
            <StyledDivider />

            <SkeletonBox /> {/* AddressInfo */}
            <StyledDivider />

            <SkeletonBox /> {/* DeliveryTime */}
            <StyledDivider />

            <SkeletonBox /> {/* DeliveryNote */}
        </div>
    );
}
