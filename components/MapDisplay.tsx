import dynamic from 'next/dynamic';

const ClientMap = dynamic(() => import('./ClientMap'), { ssr: false });

export default function MapDisplay({
  lat, lng, zoom, heightClass,
}: { lat: number; lng: number; zoom?: number; heightClass?: string }) {
  if (!lat && !lng) return null;

  return (
    <ClientMap
      lat={lat}
      lng={lng}
      zoom={zoom ?? 12}
      className={heightClass ?? 'h-56'} // default ~224px; override from parent
    />
  );
}
