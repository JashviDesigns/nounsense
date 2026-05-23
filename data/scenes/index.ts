import type { SceneDefinition } from "@/lib/types";
import { bathroomScene } from "./bathroom";
import { bedroomScene } from "./bedroom";
import { natureScene } from "./nature";
import { restaurantScene } from "./restaurant";
import { kitchenScene } from "./kitchen";
import { livingRoomScene } from "./living-room";
import { officeScene } from "./office";
import { schoolScene } from "./school";
import { streetScene } from "./street";
import { supermarketScene } from "./supermarket";
export const SCENES: SceneDefinition[] = [
  livingRoomScene,
  kitchenScene,
  restaurantScene,
  streetScene,
  officeScene,
  bathroomScene,
  bedroomScene,
  supermarketScene,
  schoolScene,
  natureScene,
];

export const SCENES_BY_ID = Object.fromEntries(
  SCENES.map((s) => [s.id, s]),
) as Record<string, SceneDefinition>;

export function getScene(id: string): SceneDefinition {
  return SCENES_BY_ID[id] ?? livingRoomScene;
}
