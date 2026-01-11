export interface HookResponse<T> {
  ok: boolean,
  message?: string,
  data?: T
}

export function errorHookResponse<T>(error: any): HookResponse<T> {
  return {
    ok: false,
    message: error.response?.data.message || error.message,
  }
}

export function successHookResponse<T>(props?: Omit<HookResponse<T>, "ok">): HookResponse<T> {
  return {
    ok: true,
    ...props
  }
}