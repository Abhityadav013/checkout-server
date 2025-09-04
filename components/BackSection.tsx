'use client'
import React from "react";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";

const BackSection = ({ redirect_url }: { redirect_url?: string }) => {
  const router = useRouter();

  const handleRouting = () => {
    if (redirect_url) {
      router.push(redirect_url)
    } else {
      router.back()
    }
  }
  return (
    <IconButton
      aria-label="Go back"
      onClick={handleRouting}
      sx={{ color: "black" }}
    >
      <ArrowBackIcon fontSize="small" />
    </IconButton>
  );
};

export default BackSection;
