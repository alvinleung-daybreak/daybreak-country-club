import { AssetManager } from "@/components/TennisGame/Game/AssetManager/AssetManager";
import { AudioAsset } from "@/components/TennisGame/Game/AssetManager/AudioAsset";
import { SoundEffect } from "@/components/TennisGame/Game/SoundEffect";
import { useEffect, useRef } from "react";

export function useTennisHitSound() {
  const hitSoundEffect = useRef<SoundEffect>();
  useEffect(() => {
    const loadAssets = async () => {
      const assets = AssetManager.getInstance();

      assets.add(
        "tennis-hit-1",
        new AudioAsset("./audio-assets/tennis-hit-1.mp3")
      );
      assets.add(
        "tennis-hit-2",
        new AudioAsset("./audio-assets/tennis-hit-2.mp3")
      );
      assets.add(
        "tennis-hit-3",
        new AudioAsset("./audio-assets/tennis-hit-4.mp3")
      );
      await assets.loadAll();
      hitSoundEffect.current = new SoundEffect([
        assets.get("tennis-hit-1"),
        assets.get("tennis-hit-2"),
        assets.get("tennis-hit-3"),
      ]);
    };
    loadAssets();
  }, []);

  return hitSoundEffect;
}
