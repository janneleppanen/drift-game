class Controls {
  public keysDown: string[] = [];

  constructor() {
    document.onkeydown = (e: KeyboardEvent) => {
      if (!this.keysDown.includes(e.key)) {
        this.keysDown.push(e.key);
      }
    };

    document.onkeyup = (e: KeyboardEvent) => {
      if (this.keysDown.includes(e.key)) {
        const index = this.keysDown.indexOf(e.key);
        this.keysDown.splice(index, 1);
      }
    };
  }

  isPressing(key: string) {
    return this.keysDown.includes(key);
  }
}

export default Controls;
