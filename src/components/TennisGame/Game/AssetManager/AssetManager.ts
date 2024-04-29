export class AssetManager {
  private static _instance: AssetManager;

  private assetLookup: { [key: string]: Asset } = {};
  private loadingProgress = 0;
  private loadedAssetCount = 0;

  private constructor() {}
  public static getInstance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }

  add(assetId: string, asset: Asset) {
    this.assetLookup[assetId] = asset;
  }
  get<T extends Asset>(assetId: string): T {
    const result = this.assetLookup[assetId] as T;
    if (!result) {
      throw `Asset "${assetId}" does not exist in the system`;
    }

    if (!result.isLoaded()) {
      console.trace(`Attempt to access unloaded asset: "${assetId}"`);
      // throw `Attempt to access unloaded asset: "${assetId}"`;
    }

    return result;
  }
  async loadAll() {
    console.log("loading all assets...");

    const allLoaders = Object.values(this.assetLookup).map((asset) =>
      asset.load()
    );
    await Promise.all(allLoaders);

    console.log("Completed loading all assets");
    return;
  }
}

export interface Asset {
  load(): Promise<Asset>;
  isLoaded(): boolean;
}
