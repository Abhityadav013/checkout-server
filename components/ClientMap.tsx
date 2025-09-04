"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = { lat: number; lng: number; zoom?: number; className?: string };

export default function ClientMap({ lat, lng, className }: Props) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const position = useMemo<[number, number]>(() => [lat, lng], [lat, lng]);

  return (
    <div className={`rounded-lg overflow-hidden ${className ?? "h-64"}`}>
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        dragging={true}
        touchZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Your location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
