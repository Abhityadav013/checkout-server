'use client';

import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { handleBasketState } from '@/store/slices/basketSlice';
// import { RootState } from '@/store';
// import { handleBasketState } from '@/store/slices/basketSlice';

interface BasketDrawerProps {
  children: React.ReactNode;
}

const BasketDrawer = ({ children }: BasketDrawerProps) => {
  const isBasketOpen = useSelector((state: RootState) => state.basket.isBasketOpen);
  const dispatch = useDispatch();
  
  const handleBasketToggle = () => {
    dispatch(handleBasketState(!isBasketOpen));
  };

  return (
    <Drawer
      anchor="bottom"
      open={isBasketOpen}
      onClose={handleBasketToggle}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: "100%",
          height: "85%", // Take up most of the screen but not all
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          overflow: "hidden", // Prevent scrolling issues
        },
      }}
    >
      {/* Close button positioned absolutely */}
      <IconButton
        onClick={handleBasketToggle}
        sx={{ 
          position: "absolute", 
          top: 16, 
          right: 16, 
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      
      {/* Content */}
      {children}
    </Drawer>
  );
};

export default BasketDrawer;
