import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Globe,
  Navigation,
  Search,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { CLINIC_DIRECTORY } from '../data/clinicsData';

export default function ClinicFinderPage() {
  const [cityFilter, setCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(CLINIC_DIRECTORY[0]);

  const cities = ['All', ...Array.from(new Set(CLINIC_DIRECTORY.map((c) => c.city)))];

  const filteredClinics = CLINIC_DIRECTORY.filter((c) => {
    const matchesCity = cityFilter === 'All' || c.city === cityFilter;
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800">
          <MapPin className="w-3.5 h-3.5" />
          <span>Screening Facilities & Oncology Networks</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Find Nearby Cancer Screening Centers
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Locate certified cancer institutes, comprehensive oncology centers, and preventive screening facilities with direct contact phone lines and interactive OpenStreetMap navigation.
        </p>
      </div>

      {/* Search & City Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hospital or specialty..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setCityFilter(city)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                cityFilter === city
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid: Clinic List on Left + Interactive Map View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Clinics List */}
        <div className="lg:col-span-7 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          {filteredClinics.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm bg-white dark:bg-slate-900 rounded-2xl border">
              No screening centers found matching your query.
            </div>
          ) : (
            filteredClinics.map((clinic) => {
              const isSelected = selectedClinic?.id === clinic.id;
              return (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-900/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        {clinic.city}, {clinic.country}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {clinic.name}
                      </h3>
                    </div>
                    <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      <Building2 className="w-5 h-5 text-teal-600" />
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {clinic.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <a
                      href={`tel:${clinic.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{clinic.phone}</span>
                    </a>

                    <a
                      href={clinic.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get Directions (OpenStreetMap)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Map / Selected Center Detail Panel */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Medical Center
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Verified Oncology Wing
              </span>
            </div>

            {selectedClinic ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedClinic.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedClinic.address}
                  </p>
                </div>

                {/* OpenStreetMap Interactive Embed */}
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100">
                  <iframe
                    title="OpenStreetMap Center Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedClinic.lng - 0.03}%2C${selectedClinic.lat - 0.02}%2C${selectedClinic.lng + 0.03}%2C${selectedClinic.lat + 0.02}&layer=mapnik&marker=${selectedClinic.lat}%2C${selectedClinic.lng}`}
                  />
                </div>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <span className="text-slate-500">Telephone Appointment Line:</span>
                    <a href={`tel:${selectedClinic.phone}`} className="font-bold text-teal-600">
                      {selectedClinic.phone}
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                    <span className="text-slate-500">Official Portal:</span>
                    <a
                      href={selectedClinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-teal-600 hover:underline flex items-center gap-1"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <a
                  href={selectedClinic.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition hover:scale-[1.02]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Full Directions in OpenStreetMap</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select any hospital card to load direct map coordinates.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
