export interface Decrypter {
  decrypt <P>(ciphertext: string): Promise<Decrypter.ReturnType>
}

export namespace Decrypter {
  export type ReturnType = {
    issuedAt?: number
    payload: any
  }
}
