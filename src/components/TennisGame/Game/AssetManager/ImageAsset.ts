import { Asset } from "./AssetManager";

export class ImageAsset implements Asset {
  private _isloaded = false;
  private src: string;
  private image = document.createElement("img");

  constructor(src: string) {
    this.src = src;
  }
  public getImage() {
    return this.image;
  }
  public isLoaded() {
    return this._isloaded;
  }
  public load(): Promise<Asset> {
    // start loading
    return new Promise((resolve, reject) => {
      // if we have to pull from the server
      this.image.onload = () => {
        //image loaded
        resolve(this);
        this._isloaded = true;
      };
      this.image.src = this.src;

      // if the browser cached of the image already
      if (this.image.complete) {
        console.log(
          `Image ${this.src} is loaded already, using the browser cached version`
        );
        this._isloaded = true;
        resolve(this);
        return;
      }
    });
  }
}
