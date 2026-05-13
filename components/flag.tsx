/* eslint-disable @next/next/no-img-element */
"use client";

const ISO: Record<string, string> = {
  Norway: "no",
  UK: "gb",
  Sweden: "se",
  Denmark: "dk",
  China: "cn",
  "Hong Kong": "hk",
  Taiwan: "tw",
  Singapore: "sg",
  Switzerland: "ch",
  Zambia: "zm",
  Mozambique: "mz",
  Japan: "jp",
  "South Korea": "kr",
  "Saudi Arabia": "sa",
  Iran: "ir",
  Ireland: "ie",
  Estonia: "ee",
  USA: "us",
  Germany: "de",
  France: "fr",
};

const NON_COUNTRY: Record<string, string> = {
  Global: "🌍",
  Remote: "💻",
  Multiple: "🌐",
  Unknown: "❓",
};

export function Flag({
  country,
  size = 16,
  className = "",
}: {
  country: string;
  size?: number;
  className?: string;
}) {
  const iso = ISO[country];
  if (!iso) {
    return (
      <span className={`inline-block leading-none ${className}`} aria-label={country}>
        {NON_COUNTRY[country] ?? "📍"}
      </span>
    );
  }
  // flagcdn only serves discrete 4:3 sizes (16x12, 20x15, 24x18, 32x24, 40x30, ...)
  // Snap to nearest valid pair derived from k where w=4k, h=3k.
  const k = Math.max(4, Math.round(size / 4));
  const w = k * 4;
  const h = k * 3;
  return (
    <img
      src={`https://flagcdn.com/${w * 2}x${h * 2}/${iso}.png`}
      srcSet={`https://flagcdn.com/${w * 3}x${h * 3}/${iso}.png 1.5x, https://flagcdn.com/${w * 4}x${h * 4}/${iso}.png 2x`}
      alt={country}
      width={w}
      height={h}
      loading="lazy"
      className={`inline-block align-middle rounded-[2px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.15)] ${className}`}
    />
  );
}
