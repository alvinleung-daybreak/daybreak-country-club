import { AudioAsset } from "./AssetManager/AudioAsset";
import { random } from "./utils";

export class SoundEffect {
  private audioAssets: AudioAsset[];
  constructor(assets: AudioAsset[]) {
    this.audioAssets = assets;
  }

  trigger() {
    const playTrackIndex = Math.round(random(0, this.audioAssets.length - 1));
    const audioAsset = this.audioAssets[playTrackIndex];
    audioAsset.trigger();
  }
}
