/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'leaflet/dist/leaflet.css';

// Dynamically import only the client-side components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

const lat = Number(process.env.NEXT_PUBLIC_INDIAN_TADKA_LAT);
const lng = Number(process.env.NEXT_PUBLIC_INDIAN_TADKA_LNG);

export default function RestaurantMap() {
  const [mounted, setMounted] = useState(false);
  const [L, setLeaflet] = useState<any>(null);
  const [icon, setIcon] = useState<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import 'leaflet' only on the client
    import('leaflet').then((leaflet) => {
      const L = leaflet.default;

      // Fix for marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
      });

      // Create custom icon
      const restaurantIcon = new L.Icon({
        iconUrl: 'https://testing.indiantadka.eu/assets/location-pin.png',
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
        shadowSize: [41, 41],
        shadowAnchor: [13, 41],
      });

      setLeaflet(L);
      setIcon(restaurantIcon);
      setMounted(true);
    });
  }, []);

  if (!mounted || !L || !icon) return null;

  return (
    <Box
      sx={{
        width: '100%',
         height: isMobile ? '60vh' : 400,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2,
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
            <Typography variant="body2" fontWeight="bold">
              🍛 Here’s your favorite spot — Indian Tadka!
            </Typography>
          </Tooltip>
        </Marker>
      </MapContainer>
    </Box>
  );
}
