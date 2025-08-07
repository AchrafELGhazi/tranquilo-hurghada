import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
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

        // North Hurghada coordinates (approximate location)
        const latitude = 27.2579; // North Hurghada latitude
        const longitude = 33.8116; // North Hurghada longitude

        // Initialize the map
        const map = L.map(mapRef.current).setView([latitude, longitude], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Add marker
        const marker = L.marker([latitude, longitude]).addTo(map);

        // Add popup with location info
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

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className='w-full h-64 rounded-lg overflow-hidden border border-gray-200'>
            <div ref={mapRef} className='w-full h-full' />
        </div>
    );
};

export default Map;
