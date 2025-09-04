import { Box, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';
import BackSection from './BackSection';

interface NavBarNavigationSectionProps {
  label: string;
  redirect_url?: string;
  isImage?: boolean;
  isLanguageSwitcher?: boolean;
}
const NavBarNavigation: React.FC<NavBarNavigationSectionProps> = ({
  label,
  redirect_url,
  isImage,
  isLanguageSwitcher,
}) => {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: { xs: 56, sm: 64 },
        backgroundColor: 'white',
        boxShadow: 2,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 4, md: 8 },
      }}
    >
      <BackSection redirect_url={redirect_url} />
      {/* Center: Title */}
      <Box
        sx={{
          position: 'absolute',
          left: isLanguageSwitcher ?'50%' :'40%',
          transform: 'translateX(-50%)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 600,
            color: 'black',
            whiteSpace: 'nowrap',
            textAlign: 'center',
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Right: Optional image */}
      {isImage ? (
        <Image
          src="https://testing.indiantadka.eu/assets/food.webp"
          alt="Decorative food"
          width={40}
          height={40}
          className="rounded"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <Box sx={{ width: 40 }} /> // Placeholder for alignment
      )}
    </Box>
  );
};

export default NavBarNavigation;
