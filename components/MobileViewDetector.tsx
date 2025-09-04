"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import { setMobileView } from "@/store/slices/mobileSlice";

const MobileViewDetector: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMobileView(isMobile));
  }, [isMobile, dispatch]);

  return null;
};

export default MobileViewDetector;
