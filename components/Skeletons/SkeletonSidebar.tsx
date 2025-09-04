"use client";
import React from "react";
import { Box, Skeleton, Typography, Stack, Divider } from "@mui/material";

const SkeletonSidebar = () => {
  return (
    <Box
      // Root container adapts: full-width on mobile, fixed-width at md+
      sx={{
        position: { xs: "fixed", md: "sticky" },
        bottom: { xs: 0, md: "auto" },
        top: { xs: "auto", md: 0 },
        right: { xs: 0, md: "auto" },
        width: {
          xs: "100%",
          sm: "100%",
          md: 320, // match your wrapper: w-[320px]
          lg: 320,
        },
        px: { xs: 2, md: 2 },
        py: { xs: 1.5, md: 3 },
        bgcolor: "background.paper",
        height: {
          xs: "auto",
          md: "100vh",
        },
        maxHeight: {
          xs: "30vh", // mobile mini panel height
          sm: "30vh",
          md: "100vh",
        },
        borderLeft: { xs: "none", md: "1px solid #eee" },
        borderTop: { xs: "1px solid #eee", md: "none" },
        display: "flex",
        flexDirection: "column",
        justifyContent: { xs: "center", md: "space-between" },
        mx: { xs: 0, md: "auto" },
        zIndex: { xs: 1300, md: 1200 },
        boxShadow: { xs: "0 -8px 24px rgba(0,0,0,0.06)", md: "none" },
      }}
    >
      {/* Desktop/Tablet content (md and up) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          overflowY: "auto",
          flexGrow: 1,
        }}
      >
        {/* Basket Header */}
        <Typography
          variant="h6"
          fontWeight="bold"
          display="flex"
          justifyContent="center"
        >
          Basket
        </Typography>

        {/* Delivery / Collection Toggle */}
        <Stack direction="row" spacing={2} my={3} justifyContent="center">
          <Skeleton variant="rounded" width={120} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Stack>

        {/* Item List Skeletons */}
        <Stack spacing={2} mb={4}>
          {[1, 2, 3, 4].map((_, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Box flexGrow={1}>
                <Skeleton variant="text" width="85%" height={22} />
                <Skeleton variant="text" width="60%" height={18} />
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width={20} height={22} />
                <Skeleton variant="circular" width={28} height={28} />
              </Stack>
              <Skeleton variant="text" width={44} height={22} />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Desktop/Tablet fixed bottom section */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="subtitle1" mb={1}>
          <Skeleton width="40%" />
        </Typography>
        <Skeleton variant="text" width="80%" height={22} />
        <Skeleton variant="text" width="60%" height={22} />
        <Skeleton variant="text" width="50%" height={22} />
        <Box mt={2.5}>
          <Skeleton variant="rounded" width="100%" height={44} />
        </Box>
      </Box>

      {/* Mobile content (xs/sm): compact bottom summary */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: short summary lines */}
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton variant="text" width="50%" height={18} />
          <Skeleton variant="text" width="70%" height={18} />
        </Box>
        {/* Right: checkout button placeholder */}
        <Skeleton
          variant="rounded"
          width={140}
          height={40}
          sx={{ flexShrink: 0 }}
        />
      </Box>
    </Box>
  );
};

export default SkeletonSidebar;
