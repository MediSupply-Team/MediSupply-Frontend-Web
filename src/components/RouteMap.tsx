'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteStop {
  lat: number;
  lon: number;
  cliente: string;
  direccion: string;
  hora_estimada: string;
  cajas: number;
  orden: number;
  id_pedido: string;
}

interface RouteGeometry {
  coordinates: [number, number][];
  type: string;
}

interface RouteMapProps {
  stops: RouteStop[];
  geometry: RouteGeometry;
  warehouseAddress: string;
}

export default function RouteMap({ stops, geometry, warehouseAddress }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || stops.length === 0) return;

    // Limpiar mapa existente
    if (mapRef.current) {
      mapRef.current.remove();
    }

    // Inicializar mapa
    const map = L.map(mapContainerRef.current, {
      center: [stops[0]?.lat || 4.7110, stops[0]?.lon || -74.0721],
      zoom: 11,
      zoomControl: true,
    });

    mapRef.current = map;

    // Agregar tiles (tema oscuro si es necesario)
    const isDarkMode = document.documentElement.classList.contains('dark');
    const tileLayer = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayer, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    // Crear iconos personalizados
    const warehouseIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:#22c55e;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">W</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const createClientIcon = (order: number) => {
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:#14b8a6;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">${order}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    const markers: L.Marker[] = [];

    // Agregar marcador de bodega (punto de origen)
    if (geometry.coordinates.length > 0) {
      const [lon, lat] = geometry.coordinates[0];
      const warehouseMarker = L.marker([lat, lon], { icon: warehouseIcon }).addTo(map);
      warehouseMarker.bindPopup(
        `<strong>Bodega Principal</strong><br>${warehouseAddress}`
      );
      markers.push(warehouseMarker);
    }

    // Agregar marcadores de clientes
    stops.forEach((stop) => {
      const marker = L.marker([stop.lat, stop.lon], {
        icon: createClientIcon(stop.orden),
      }).addTo(map);

      const popupContent = `
        <div style="min-width:200px;">
          <strong>${stop.cliente}</strong><br>
          <span style="font-size:12px;color:#666;">${stop.direccion}</span><br>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #eee;">
            <span style="font-size:12px;"><strong>Hora:</strong> ${stop.hora_estimada}</span><br>
            <span style="font-size:12px;"><strong>Cajas:</strong> ${stop.cajas}</span><br>
            <span style="font-size:12px;"><strong>Pedido:</strong> ${stop.id_pedido}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markers.push(marker);
    });

    // Dibujar la ruta
    if (geometry.coordinates.length > 0) {
      // Convertir coordenadas de [lon, lat] a [lat, lon]
      const routeCoords: [number, number][] = geometry.coordinates.map(
        ([lon, lat]) => [lat, lon]
      );

      L.polyline(routeCoords, {
        color: '#14b8a6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(map);
    }

    // Ajustar vista para mostrar todos los marcadores
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stops, geometry, warehouseAddress]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
