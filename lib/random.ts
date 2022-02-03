export default class Random {
  public data: string[] = [];

  constructor(data?: string[]) {
    this.data = data || [];
  }

  getRandom(): string {
    const randomValue = Math.random().toString(36).substr(2, 11);
    if (!this.data.includes(randomValue)) {
      this.data.push(randomValue);
      return randomValue;
    } else {
      return this.getRandom();
    }
  }
}
