"use client";

import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface LocationValues {
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

interface LocationErrors {
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

interface LocationSelectorProps {
  values: LocationValues;
  onChange: (field: keyof LocationValues, value: string) => void;
  errors?: LocationErrors;
  labelClassName?: string;
}

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-muted-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

function nameToIsoCode(
  list: { name: string; isoCode: string }[],
  name: string
) {
  return list.find((i) => i.name === name)?.isoCode ?? "";
}

export function LocationSelector({
  values,
  onChange,
  errors,
  labelClassName = "text-xs font-bold uppercase tracking-widest",
}: LocationSelectorProps) {
  const allCountries = Country.getAllCountries();

  const countryIso = nameToIsoCode(allCountries, values.country);
  const allStates = countryIso ? State.getStatesOfCountry(countryIso) : [];
  const stateIso = nameToIsoCode(allStates, values.state);
  const allCities = countryIso && stateIso
    ? City.getCitiesOfState(countryIso, stateIso)
    : [];

  const [fetchingPin, setFetchingPin] = useState(false);

  const lookupPinCode = async (city: string, country: string) => {
    if (country !== "India" || !city) return;
    setFetchingPin(true);
    try {
      const res = await fetch(`/api/location/pincode?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.pinCode) onChange("zipCode", String(data.pinCode));
    } finally {
      setFetchingPin(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    onChange("country", name);
    onChange("state", "");
    onChange("city", "");
    onChange("zipCode", "");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    onChange("state", name);
    onChange("city", "");
    onChange("zipCode", "");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    onChange("city", name);
    lookupPinCode(name, values.country);
  };

  return (
    <div className="space-y-4">
      {/* Country */}
      <div className="space-y-2">
        <Label className={labelClassName}>Country</Label>
        <div className="relative">
          <select
            className={SELECT_CLASS}
            value={values.country}
            onChange={handleCountryChange}
          >
            <option value="">Select country</option>
            {allCountries.map((c) => (
              <option key={c.isoCode} value={c.name}>{c.name}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
        </div>
        {errors?.country && <p className="text-xs text-destructive">{errors.country}</p>}
      </div>

      {/* State */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={labelClassName}>State</Label>
          <div className="relative">
            {allStates.length > 0 ? (
              <>
                <select
                  className={SELECT_CLASS}
                  value={values.state}
                  onChange={handleStateChange}
                  disabled={!countryIso}
                >
                  <option value="">Select state</option>
                  {allStates.map((s) => (
                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
              </>
            ) : (
              <Input
                placeholder="Enter state"
                value={values.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="border-muted-foreground/20"
              />
            )}
          </div>
          {errors?.state && <p className="text-xs text-destructive">{errors.state}</p>}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className={labelClassName}>City</Label>
          <div className="relative">
            {allCities.length > 0 ? (
              <>
                <select
                  className={SELECT_CLASS}
                  value={values.city}
                  onChange={handleCityChange}
                  disabled={!stateIso}
                >
                  <option value="">Select city</option>
                  {allCities.map((c, i) => (
                    <option key={`${c.name}-${i}`} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▾</span>
              </>
            ) : (
              <Input
                placeholder="Enter city"
                value={values.city}
                onChange={(e) => {
                  onChange("city", e.target.value);
                  lookupPinCode(e.target.value, values.country);
                }}
                className="border-muted-foreground/20"
              />
            )}
          </div>
          {errors?.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
      </div>

      {/* Pin code */}
      <div className="space-y-2">
        <Label className={labelClassName}>
          Pin Code / Zip Code
          {fetchingPin && <Loader2 className="inline w-3 h-3 ml-1 animate-spin text-muted-foreground" />}
        </Label>
        <Input
          placeholder={values.country === "India" ? "Auto-filled from city" : "Enter zip code"}
          value={values.zipCode}
          onChange={(e) => onChange("zipCode", e.target.value)}
          className="border-muted-foreground/20"
        />
        {errors?.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
      </div>
    </div>
  );
}
