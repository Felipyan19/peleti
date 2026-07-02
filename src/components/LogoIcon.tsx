"use client";

import { useId } from "react";

interface LogoIconProps {
  size?: number;
}

/**
 * Isotipo de Peleti: gota de resina con olas internas (ocean pour)
 * y burbuja dorada. Los ids se generan con useId para poder montar
 * varias instancias (Navbar + Footer) sin colisiones de defs.
 */
export default function LogoIcon({ size = 20 }: LogoIconProps) {
  const uid = useId();
  const gradId = `peleti-grad-${uid}`;
  const clipId = `peleti-clip-${uid}`;
  const drop =
    "M24 3.5 C24 3.5 38 20.5 38 29.5 C38 37.5 31.7 43.5 24 43.5 C16.3 43.5 10 37.5 10 29.5 C10 20.5 24 3.5 24 3.5 Z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="12"
          y1="8"
          x2="38"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2CBDC3" />
          <stop offset="1" stopColor="#0B6E74" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={drop} />
        </clipPath>
      </defs>

      <path d={drop} fill={`url(#${gradId})`} />

      <g clipPath={`url(#${clipId})`}>
        <path
          d="M6 27 C13 21.5, 19 21.5, 24 26.5 C29 31.5, 35 31.5, 42 26.5"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M6 34.5 C13 29.5, 19 29.5, 24 34 C29 38.5, 35 38.5, 42 34"
          stroke="#E9B430"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </g>

      {/* Burbuja de resina */}
      <circle cx="27.5" cy="14" r="1.9" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}
