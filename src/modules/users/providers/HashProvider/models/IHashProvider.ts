export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(oayload: string, hashed: string): Promise<boolean>;
}
