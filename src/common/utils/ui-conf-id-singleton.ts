export class UiConfIdSingleton {
  private static instance: UiConfIdSingleton;
  private uiConfId: string;

  private constructor() {
    this.uiConfId = ''; // Initialize with an empty string
  }

  public static getInstance(): UiConfIdSingleton {
    if (!UiConfIdSingleton.instance) {
      UiConfIdSingleton.instance = new UiConfIdSingleton();
    }
    return UiConfIdSingleton.instance;
  }

  public setUiConfId(id: string): void {
    this.uiConfId = id;
  }

  public getUiConfId(): string {
    return this.uiConfId;
  }
}
