export class Seller {
  private static instance: Seller | null = null;

  private contact: string = 'Nan';
  private email: string = 'Nan';
  private name: string = 'Nan';
  private role: string = 'Nan';
  private svgAvatar: string = 'Nan';
  private tag: string = 'Nan';
  private isConnected: boolean = false;

  public static getInstance(): Seller {
    if (!Seller.instance) {
      Seller.instance = new Seller();
    }
    return Seller.instance;
  }

  setContact(_contact: string): void {
    this.contact = _contact;
  }
  getContact(): string {
    return this.contact;
  }

  setEmail(_email: string): void {
    this.email = _email;
  }
  getEmail(): string {
    return this.email;
  }

  setName(_name: string): void {
    this.name = _name;
  }
  getName(): string {
    return this.name;
  }

  setRole(_role: string): void {
    this.role = _role;
  }
  getRole(): string {
    return this.role;
  }

  setSvgAvatar(_svgAvatar: string): void {
    this.svgAvatar = _svgAvatar;
  }
  getSvgAvatar(): string {
    return this.svgAvatar;
  }

  setTag(_tag: string): void {
    this.tag = _tag;
  }
  getTag(): string {
    return this.tag;
  }

  setIsConnected(_isConnected: boolean): void {
    this.isConnected = _isConnected;
  }
  getIsConnected(): boolean {
    return this.isConnected;
  }

  setFromData(data: {
    contact: string;
    email: string;
    name: string;
    role: string;
    svgAvatar: string;
    tag: string;
  }): void {
    this.contact = data.contact;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.svgAvatar = data.svgAvatar;
    this.tag = data.tag;
  }
}
