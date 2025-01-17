export interface Logoff {
  logoff(params: Logoff.Params): Promise<Logoff.Result>
}

export namespace Logoff {
  export type Params = {
    userId: number
  }
  export type Result = void
}
