export const CUSTOM_FONTS = [
  "Bebas Neue",
  "Inter",
  "Anton",
  "Bangers",
  "Monoton",
  "Orbitron",
  "Bungee",
  "Permanent Marker",
  "Pacifico",
  "Press Start 2P",
  "Russo One",
  "Black Ops One",
  "Audiowide",
  "Righteous",
  "Major Mono Display",
  "Special Elite",
  "VT323",
  "Creepster",
  "Lobster",
  "Rubik Mono One",
  "Bowlby One",
  "Faster One",
  "Staatliches",
  "Archivo Black",
] as const;

export type FontKey = (typeof CUSTOM_FONTS)[number];

// Google Fonts URL bundling all of the above
export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Bebas+Neue",
    "family=Inter:wght@400;500;600;700;800",
    "family=Anton",
    "family=Bangers",
    "family=Monoton",
    "family=Orbitron:wght@400;700;900",
    "family=Bungee",
    "family=Permanent+Marker",
    "family=Pacifico",
    "family=Press+Start+2P",
    "family=Russo+One",
    "family=Black+Ops+One",
    "family=Audiowide",
    "family=Righteous",
    "family=Major+Mono+Display",
    "family=Special+Elite",
    "family=VT323",
    "family=Creepster",
    "family=Lobster",
    "family=Rubik+Mono+One",
    "family=Bowlby+One",
    "family=Faster+One",
    "family=Staatliches",
    "family=Archivo+Black",
  ].join("&") +
  "&display=swap";
