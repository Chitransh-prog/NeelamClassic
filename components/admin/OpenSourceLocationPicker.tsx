"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Search,
  ExternalLink,
  Crosshair,
  CheckCircle2,
  Compass,
  Milestone,
} from "lucide-react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

interface LocationPickerProps {
  initialAddress?: string;
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationChange: (loc: {
    address: string;
    lat: number;
    lng: number;
    distanceKm: number;
  }) => void;
}

// Studio Base Coordinates: Central Studio location (Bhopal / Madhya Pradesh baseline)
export const SALON_STUDIO_COORDS = { lat: 23.259933, lng: 77.412615 };

// Haversine formula to compute distance in km
export function computeDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

export default function OpenSourceLocationPicker({
  initialAddress = "",
  initialLat,
  initialLng,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerInstanceRef = useRef<LeafletMarker | null>(null);

  const [address, setAddress] = useState(initialAddress);
  const [lat, setLat] = useState<number>(initialLat || SALON_STUDIO_COORDS.lat);
  const [lng, setLng] = useState<number>(initialLng || SALON_STUDIO_COORDS.lng);
  const [distanceKm, setDistanceKm] = useState<number>(() => {
    return computeDistanceKm(
      SALON_STUDIO_COORDS.lat,
      SALON_STUDIO_COORDS.lng,
      initialLat || SALON_STUDIO_COORDS.lat,
      initialLng || SALON_STUDIO_COORDS.lng
    );
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("Ready");
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    let isCancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      if (isCancelled || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Custom Luxury Marker Icon (Plum circle with champagne gold border and pulse ring)
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="position: relative; width: 34px; height: 34px;">
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(201, 166, 107, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; background: #4A1330; border: 2.5px solid #C9A66B; box-shadow: 0 4px 12px rgba(74,19,48,0.3); display: flex; align-items: center; justify-content: center; color: #FFF9F5;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A66B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });

      const currentLat = initialLat || SALON_STUDIO_COORDS.lat;
      const currentLng = initialLng || SALON_STUDIO_COORDS.lng;

      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([currentLat, currentLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup("<b>Client Pickup / Venue Location</b><br/>Drag to fine-tune exact gate location");

      marker.on("dragend", async () => {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
        const dist = computeDistanceKm(
          SALON_STUDIO_COORDS.lat,
          SALON_STUDIO_COORDS.lng,
          position.lat,
          position.lng
        );
        setDistanceKm(dist);
        setLocationStatus(`Pin placed (${dist} km from Studio)`);
        await reverseGeocode(position.lat, position.lng, dist);
      });

      map.on("click", async (e) => {
        marker.setLatLng(e.latlng);
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        const dist = computeDistanceKm(
          SALON_STUDIO_COORDS.lat,
          SALON_STUDIO_COORDS.lng,
          e.latlng.lat,
          e.latlng.lng
        );
        setDistanceKm(dist);
        setLocationStatus(`Pin placed (${dist} km from Studio)`);
        await reverseGeocode(e.latlng.lat, e.latlng.lng, dist);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (
    latitude: number,
    longitude: number,
    distance: number
  ) => {
    try {
      setLocationStatus("Fetching exact street address...");
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      if (res.ok) {
        const data = await res.json();
        const detectedAddress =
          data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setAddress(detectedAddress);
        setLocationStatus(`Location verified • ${distance} km from Studio`);
        onLocationChange({
          address: detectedAddress,
          lat: latitude,
          lng: longitude,
          distanceKm: distance,
        });
      }
    } catch {
      const fallback = `Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setAddress(fallback);
      onLocationChange({
        address: fallback,
        lat: latitude,
        lng: longitude,
        distanceKm: distance,
      });
    }
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocatingUser(true);
    setLocationStatus("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        const dist = computeDistanceKm(
          SALON_STUDIO_COORDS.lat,
          SALON_STUDIO_COORDS.lng,
          userLat,
          userLng
        );
        setDistanceKm(dist);

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 16);
          markerInstanceRef.current.setLatLng([userLat, userLng]);
          markerInstanceRef.current.openPopup();
        }

        setIsLocatingUser(false);
        setLocationStatus(`GPS accurate within ${Math.round(pos.coords.accuracy)}m • ${dist} km from Studio`);
        await reverseGeocode(userLat, userLng, dist);
      },
      (err) => {
        setIsLocatingUser(false);
        setLocationStatus("GPS permission denied");
        alert("Could not access live GPS: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=5&addressdetails=1`
      );
      const data = await res.json();
      setSearchResults(data || []);
      setShowResultsDropdown(true);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    const itemLat = parseFloat(result.lat);
    const itemLng = parseFloat(result.lon);
    const dist = computeDistanceKm(
      SALON_STUDIO_COORDS.lat,
      SALON_STUDIO_COORDS.lng,
      itemLat,
      itemLng
    );

    setLat(itemLat);
    setLng(itemLng);
    setDistanceKm(dist);
    setAddress(result.display_name);
    setShowResultsDropdown(false);
    setSearchQuery("");
    setLocationStatus(`Venue pinned • ${dist} km from Studio`);

    if (mapInstanceRef.current && markerInstanceRef.current) {
      mapInstanceRef.current.setView([itemLat, itemLng], 16);
      markerInstanceRef.current.setLatLng([itemLat, itemLng]);
      markerInstanceRef.current.openPopup();
    }

    onLocationChange({
      address: result.display_name,
      lat: itemLat,
      lng: itemLng,
      distanceKm: dist,
    });
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="space-y-3">
      {/* 1. Address Search Bar with Live GPS Button (Light Theme) */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder="Search wedding venue, hotel, landmark or doorstep address..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-[#FFF9F5] border border-[#F8E8EC] text-[#2B1B24] placeholder-[#7A6470]/60 focus:border-[#B76E79] focus:bg-white outline-none transition"
            />
            <Search className="w-4 h-4 text-[#7A6470] absolute left-3 top-3 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#F8E8EC] hover:bg-[#F8E8EC] text-xs font-semibold text-[#4A1330] transition flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            onClick={handleUseLiveLocation}
            disabled={isLocatingUser}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700 text-[#FFF9F5] text-xs font-semibold hover:bg-emerald-800 transition flex items-center gap-1.5 shrink-0 shadow-xs"
            title="Use current GPS live location"
          >
            <Crosshair className={`w-4 h-4 ${isLocatingUser ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Live GPS</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showResultsDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white border border-[#C9A66B]/40 rounded-2xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSearchResult(item)}
                className="p-3 text-xs text-[#2B1B24] hover:bg-[#FFF9F5] cursor-pointer transition border-b border-[#F8E8EC] flex items-start gap-2.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#B76E79] shrink-0 mt-0.5" />
                <span className="line-clamp-2 leading-relaxed">{item.display_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Interactive Leaflet Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#F8E8EC] shadow-sm bg-[#f8f5f2]">
        <div ref={mapContainerRef} className="h-56 sm:h-64 w-full z-10" />

        {/* Live Map Overlay Badge */}
        <div className="absolute top-2.5 left-2.5 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#C9A66B]/40 text-[10px] font-semibold text-[#4A1330] flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>OpenStreetMap Live Engine</span>
        </div>

        <div className="absolute bottom-2.5 right-2.5 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#F8E8EC] text-[10px] text-[#7A6470] shadow-sm hidden sm:block">
          Tap map or drag pin to adjust
        </div>
      </div>

      {/* 3. Address Text, Distance, and Live Navigation Card */}
      <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F8E8EC] space-y-2.5 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-[#B76E79] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#7A6470]">
                Selected Venue / Pickup Address
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  onLocationChange({
                    address: e.target.value,
                    lat,
                    lng,
                    distanceKm,
                  });
                }}
                placeholder="Exact door/venue address..."
                className="w-full mt-0.5 text-xs text-[#2B1B24] font-medium bg-transparent border-b border-[#F8E8EC] focus:border-[#B76E79] outline-none pb-0.5"
              />
            </div>
          </div>

          {/* Open Google Maps Directions */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#F8E8EC] text-[11px] font-semibold text-[#4A1330] hover:bg-[#F8E8EC] shrink-0 transition shadow-2xs"
            title="Open in Navigation app"
          >
            <Navigation className="w-3 h-3 text-emerald-600" />
            <span>Directions</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>

        {/* Distance & Status Bar */}
        <div className="pt-2 border-t border-[#F8E8EC] flex flex-wrap items-center justify-between text-[11px] text-[#7A6470] gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-[#4A1330]">
              <Milestone className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>Studio Distance: <strong className="text-[#4A1330] font-mono">{distanceKm} km</strong></span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-[#7A6470]">
              <Compass className="w-3 h-3 text-[#B76E79]" />
              <span>{lat.toFixed(4)}°, {lng.toFixed(4)}°</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{locationStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
