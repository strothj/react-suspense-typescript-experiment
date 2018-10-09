import { ReactNode, Component } from "react";
import {} from "react-dom";

declare module "react-dom" {
  export interface Work {
    then(onCommit: () => any): void;
  }

  export interface Batch {
    render(children: ReactNode): Work;

    then(onComplete: () => any): void;

    commit(): void;
  }

  export interface Root {
    render(children: ReactNode, callback?: () => any): Work;

    unmount(callback?: () => any): Work;

    legacy_renderSubtreeIntoContainer(
      parentComponent: Component<any>,
      children: ReactNode,
      callback?: () => any
    ): Work;

    createBatch(): Batch;
  }

  export interface RootOptions {
    hydrate?: boolean;
  }

  export function unstable_createRoot(
    container: Element | null,
    options?: RootOptions
  ): Root;
}
