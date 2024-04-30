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
    if (this.assetLookup[assetId]) {
      console.log(
        `Asset with id "${assetId}" already exist in system, abort adding.`
      );
      return;
    }
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
    console.log("loading assets...");

    const allAssets = Object.values(this.assetLookup);
    const filteredLoookup = allAssets.filter(
      (asset) => !asset.isLoaded() && !asset.isLoading()
    );

    console.log(
      `Loading ${filteredLoookup.length} assets, ${
        allAssets.length - filteredLoookup.length
      } is already initiated or finished loading`
    );

    const allLoaders = filteredLoookup.map((asset) => asset.load());
    await Promise.all(allLoaders);

    console.log("Completed loading all assets");
    return;
  }
}

export interface Asset {
  load(): Promise<Asset>;
  isLoaded(): boolean;
  isLoading(): boolean;
}
