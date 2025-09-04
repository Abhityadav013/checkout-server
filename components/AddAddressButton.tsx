'use client';
import React from 'react';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useRouter } from 'next/navigation';
import { openAddressModel } from '@/store/slices/addressSlice';

interface AddAddressButtonProps {
  textToDisplay: string;
}

const AddAddressButton: React.FC<AddAddressButtonProps> = ({ textToDisplay }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const handleProfileModal = () => {
    router.push('/');
   dispatch(openAddressModel({isDeliveryAddressUpdating:true}));
    return;
  };
  return (
    <Button
      variant="outlined"
      onClick={handleProfileModal}
      fullWidth
      sx={{
        borderColor: '#f97316',
        color: '#f97316',
        '&:hover': { borderColor: '#ea580c', backgroundColor: '#fff7ed' },
      }}
      className="!rounded-lg"
    >
      {' '}
      {textToDisplay}
    </Button>
  );
};

export default AddAddressButton;
