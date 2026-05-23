import { SceneGame } from "@/components/SceneGame";
import { SCENES_BY_ID } from "@/data/scenes";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ sceneId: string }>;
};

export default async function PlayScenePage({ params }: Props) {
  const { sceneId } = await params;
  if (!SCENES_BY_ID[sceneId]) notFound();

  return (
    <main>
      <SceneGame sceneId={sceneId} />
    </main>
  );
}
