import React from "react"
import { Skeleton, Box } from "@mui/material"

export default function ReservationFormSkeleton() {
  return (
    <Box
      className="max-w-5xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-6 md:p-12"
      sx={{ maxWidth: "900px" }}
    >
      {/* Container with CSS grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side */}
        <Box className="flex flex-col gap-6">
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
        </Box>

        {/* Right side */}
        <Box className="flex flex-col gap-6">
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={48} width="100%" />
        </Box>
      </Box>
    </Box>
  )
}
