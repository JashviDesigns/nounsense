import { CalibrateTool } from "./CalibrateTool";

const LEGACY_SCENE_IDS: Record<string, string> = {
  cafe: "restaurant",
  travel: "nature",
};

type Props = {
  searchParams: Promise<{ scene?: string }>;
};

export default async function CalibratePage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params.scene ?? "living-room";
  const initialSceneId = LEGACY_SCENE_IDS[raw] ?? raw;

  return <CalibrateTool initialSceneId={initialSceneId} />;
}
