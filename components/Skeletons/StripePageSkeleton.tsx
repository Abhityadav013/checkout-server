'use client';

import { Card, CardContent } from '@mui/material';

const StripeCheckoutSkeleton = () => {
    return (
        <>
            {/* Skeleton for the Card Form */}
            <Card className="rounded-xl shadow-md p-4 min-h-[320px] bg-white">
                <CardContent className="space-y-4 animate-pulse">
                    {/* Card label */}
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-300 rounded-full" />
                        <div className="h-4 w-20 bg-gray-300 rounded" />
                    </div>

                    {/* Card number */}
                    <div className="h-12 mt-10 bg-gray-200 rounded-md w-full" />

                    {/* Expiry & CVC */}
                    <div className="flex gap-4">
                        <div className="h-12 bg-gray-200 rounded-md flex-1" />
                        <div className="h-12 bg-gray-200 rounded-md flex-1" />
                    </div>

                    {/* Country selector */}
                    <div className="h-12 bg-gray-200 rounded-md w-full" />

                    <div className="bottom-0 left-0 right-0 bg-white border-t w-full pt-4 animate-pulse">
                        <button className="h-12 bg-gray-300 rounded-md w-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Sticky Pay Button Skeleton */}

        </>
    );
};

export default StripeCheckoutSkeleton;
