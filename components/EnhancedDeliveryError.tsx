"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { MapPin, Truck, XCircle, Home } from "lucide-react";
import AddAddressButton from "./AddAddressButton";
import MapDisplay from "./MapDisplay";
import { DeliveryDetails } from "@/lib/types/user_details";
import { useEffect } from "react";
import { setUserDeliveryDetail } from "@/store/slices/addressSlice";

/** Floating animated icons (background decoration) */
const FloatingIcon = ({
  icon: Icon,
  className,
  duration = 3,
  delay = 0,
}: {
  icon: React.ElementType;
  className: string;
  duration?: number;
  delay?: number;
}) => (
  <motion.div
    animate={{ y: [0, -15, 0], opacity: [0.3, 0.7, 0.3] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    className={`pointer-events-none absolute ${className}`}
  >
    <Icon className="w-8 h-8" aria-hidden="true" />
  </motion.div>
);

/** Current address block */
// const CurrentAddressDisplay = ({ address }: { address: IUserAddress }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.4, duration: 0.4 }}
//     className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
//   >
//     <div className="flex items-center justify-center gap-2 mb-2">
//       <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
//       <span className="text-sm font-medium text-red-800">Current Address</span>
//     </div>
//     <p className="text-sm text-red-700 break-words">
//       {address.displayAddress ||
//         `${address.street} ${address.buildingNumber}, ${address.pincode} ${address.town}`}
//     </p>
//   </motion.div>
// );

/** Helpful tips section */
const HelpfulTips = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.4 }}
    className="mt-6 pt-6 border-t border-gray-200"
  >
    <h3 className="text-sm font-semibold text-gray-700 mb-2">
      💡 Helpful Tips
    </h3>
    <ul className="text-xs text-gray-600 space-y-1 text-left mx-auto max-w-xs">
      <li>• We deliver within a 10km radius</li>
      <li>• Try entering a nearby address</li>
      <li>• Check if your postal code is correct</li>
      <li>• Consider pickup if delivery isn&apos;t available</li>
    </ul>
  </motion.div>
);
interface EnhancedDeliveryErrorProps{
   customerDelivery: DeliveryDetails;
}

const EnhancedDeliveryError:React.FC<EnhancedDeliveryErrorProps> = ({customerDelivery}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUserDeliveryDetail(customerDelivery));
  }, [customerDelivery, dispatch]);
  const { data } = useSelector((state: RootState) => state.address);
  const router = useRouter();

  const handleGoHome = () => router.push("/");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4 relative">
      <div className="max-w-md w-full">
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ y: -20, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-12 h-12 text-white" aria-hidden="true" />
            </div>

            {/* Floating small icons around main error */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <MapPin className="w-6 h-6 text-red-400" aria-hidden="true" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -5, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-2 -left-2"
            >
              <Truck className="w-6 h-6 text-orange-400" aria-hidden="true" />
            </motion.div>
          </motion.div>

          {/* Title & Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-bold text-gray-800 mb-3"
          >
            Delivery Not Available
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-gray-600 mb-6 leading-relaxed"
          >
            We&apos;re sorry, but we currently don&apos;t deliver to your
            location.
            <br />
            This could be because you&apos;re outside our delivery radius or the
            address needs verification.
          </motion.p>

          {data?.userLocation && (
            <MapDisplay
              lat={data.userLocation.lat}
              lng={data.userLocation.lng}
            />
          )}

          {/* Actions (sticky on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-4 sticky bottom-0 bg-white pt-4"
          >
            <AddAddressButton textToDisplay="Try Another Address" />

            <Button
              variant="contained"
              startIcon={<Home className="w-4 h-4" aria-hidden="true" />}
              onClick={handleGoHome}
              fullWidth
              sx={{
                background: "linear-gradient(to right, #f87171, #fb923c)",
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(to right, #ef4444, #f97316)",
                },
              }}
              className="!rounded-lg"
            >
              Home
            </Button>
          </motion.div>

          {/* Tips */}
          <HelpfulTips />
        </motion.div>

        {/* Floating Background Elements */}
        <FloatingIcon
          icon={MapPin}
          className="top-1/4 left-1/4 text-red-200"
          duration={4}
        />
        <FloatingIcon
          icon={Truck}
          className="bottom-1/4 right-1/4 text-orange-200"
          duration={3.5}
          delay={1}
        />
      </div>
    </div>
  );
};

export default EnhancedDeliveryError;
