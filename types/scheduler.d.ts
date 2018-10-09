declare module "scheduler" {
  export const unstable_ImmediatePriority: Unstable_Priority.unstable_ImmediatePriority;
  export const unstable_InteractivePriority: Unstable_Priority.unstable_InteractivePriority;
  export const unstable_NormalPriority: Unstable_Priority.unstable_NormalPriority;
  export const unstable_WheneverPriority: Unstable_Priority.unstable_WheneverPriority;

  export enum Unstable_Priority {
    unstable_ImmediatePriority = 1,
    unstable_InteractivePriority = 2,
    unstable_NormalPriority = 3,
    unstable_WheneverPriority = 4
  }

  export type Callback = () => any;

  export interface CallbackNode<T extends Callback> {
    callback: T;
    priorityLevel: Unstable_Priority;
    expirationTime: number;
    next: CallbackNode<any> | null;
    previous: CallbackNode<any> | null;
  }

  export function unstable_runWithPriority<T extends Callback>(
    priorityLevel: Unstable_Priority,
    eventHandler: T
  ): ReturnType<T>;

  export function unstable_scheduleCallback<T extends Callback>(
    callback: T
  ): CallbackNode<T>;

  export function unstable_cancelCallback(
    callbackNode: CallbackNode<any>
  ): void;

  export function unstable_wrapCallback<T extends Callback>(callback: T): T;

  export function unstable_getCurrentPriorityLevel(): Unstable_Priority;

  export function unstable_now(): number;
}
