import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface MapProps {
    address?: string;
    city?: string;
    country?: string;
}

const Map: React.FC<MapProps> = ({ address, city, country }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const latitude = 27.2579;
        const longitude = 33.8116;

        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '',
        }).addTo(map);

        const customIcon = L.divIcon({
            html: `
        <div style="
          background-color: #F8B259;
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid #fff;
          transform: rotate(-45deg);
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 8px;
            height: 8px;
            background-color: #fff;
            border-radius: 50%;
          "></div>
        </div>
      `,
            className: 'custom-marker',
            iconSize: [25, 25],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

        marker
            .bindPopup(
                `
        <div style="font-family: system-ui; line-height: 1.4;">
          <strong>Villa Location</strong><br/>
          North Hurghada, Red Sea<br/>
          Villa No. 276, Mubarak Housing 7<br/>
          Red Sea Governorate, Egypt
        </div>
        `
            )
            .openPopup();

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className='w-full h-64 border-2 border-[#F8B259]/80 rounded-2xl overflow-hidden relative z-10'>
            <div ref={mapRef} className='w-full h-full' />
        </div>
    );
};

export default Map;
