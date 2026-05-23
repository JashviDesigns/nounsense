import type { SceneObject } from "@/lib/types";

/** Living room — 12 objects; hotspot % tuned for scene image */
export const LIVING_ROOM_OBJECTS: SceneObject[] = [
  {
    id: "door",
    number: 1,
    article: "die",
    noun: "Tür",
    english: "door",
    category: "architecture",
    hotspot: { top: "42%", left: "8%" },
  },
  {
    id: "picture",
    number: 2,
    article: "das",
    noun: "Bild",
    english: "picture",
    category: "decoration",
    hotspot: { top: "22%", left: "22%" },
  },
  {
    id: "window",
    number: 3,
    article: "das",
    noun: "Fenster",
    english: "window",
    category: "architecture",
    hotspot: { top: "18%", left: "48%" },
  },
  {
    id: "curtain",
    number: 4,
    article: "der",
    noun: "Vorhang",
    english: "curtain",
    category: "decoration",
    hotspot: { top: "28%", left: "62%" },
  },
  {
    id: "shelf",
    number: 5,
    article: "das",
    noun: "Regal",
    english: "shelf",
    category: "furniture",
    hotspot: { top: "32%", left: "78%" },
  },
  {
    id: "lamp",
    number: 6,
    article: "die",
    noun: "Lampe",
    english: "lamp",
    category: "furniture",
    hotspot: { top: "48%", left: "72%" },
  },
  {
    id: "television",
    number: 7,
    article: "der",
    noun: "Fernseher",
    english: "television",
    category: "electronics",
    hotspot: { top: "38%", left: "38%" },
  },
  {
    id: "sofa",
    number: 8,
    article: "das",
    noun: "Sofa",
    english: "sofa",
    category: "furniture",
    hotspot: { top: "58%", left: "18%" },
  },
  {
    id: "armchair",
    number: 9,
    article: "der",
    noun: "Sessel",
    english: "armchair",
    category: "furniture",
    hotspot: { top: "62%", left: "52%" },
  },
  {
    id: "table",
    number: 10,
    article: "der",
    noun: "Tisch",
    english: "table",
    category: "furniture",
    hotspot: { top: "72%", left: "34%" },
  },
  {
    id: "telephone",
    number: 11,
    article: "das",
    noun: "Telefon",
    english: "telephone",
    category: "electronics",
    hotspot: { top: "68%", left: "42%" },
  },
  {
    id: "remote",
    number: 12,
    article: "die",
    noun: "Fernbedienung",
    english: "remote control",
    category: "electronics",
    hotspot: { top: "74%", left: "48%" },
  },
];

/** Drop your scene art at public/scenes/living-room.jpg */
export const LIVING_ROOM_IMAGE = "/scenes/living-room.jpg";

export const ARTICLE_HINTS: Record<string, string> = {
  furniture:
    "Many furniture words are masculine (der) — but watch for exceptions like das Sofa.",
  architecture: "Buildings parts often use das (das Fenster) or die (die Tür).",
  electronics: "Mixed gender — das Telefon, der Fernseher, die Fernbedienung.",
  decoration: "Often der or das — der Vorhang, das Bild.",
};
