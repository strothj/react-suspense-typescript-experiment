import { ComponentType, ReactNode } from "react";

declare module "react" {
  export interface PlaceholderProps {
    delayMs?: number;
    fallback?: ReactNode;
  }

  export const Placeholder: ComponentType<PlaceholderProps>;

  // Technically this should be returning a PromiseLike but React consumes it as
  // if it was resolved. Looks like some changes to the React declarations are
  // in order to support this.
  export function lazy<T>(ctor: () => PromiseLike<T>): T;
}
