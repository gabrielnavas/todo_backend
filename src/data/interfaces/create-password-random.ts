export interface CreatePasswordRandom {
  createPasswordRandomWithLength (maxLength: number): Promise<string>
}
