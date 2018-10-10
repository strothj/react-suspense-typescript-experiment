// tslint:disable:no-console
import React, { lazy, Placeholder, ReactNode, SFC } from "react";
import { createCache, createResource } from "react-cache";
import { unstable_createRoot } from "react-dom";
import { unstable_scheduleCallback } from "scheduler";

const cache = createCache(() => {
  /* noop invalidator */
});

type ReadTextResourceKey = [string, number];

const readText = createResource<ReadTextResourceKey, string>(
  ([text, ms = 0]) => {
    return new Promise(resolve => {
      console.log(
        new Date().getTime(),
        "Promise created, will resolve in ",
        ms
      );
      setTimeout(() => {
        resolve(text);
      }, ms);
    });
  },
  ([text, _ms]) => text
);

// tslint:disable-next-line:one-variable-per-declaration
const AsyncText: SFC<{ text: string; ms: number }> = props => {
  try {
    const data = readText.read(cache, [props.text, props.ms]);
    console.log(new Date().getTime(), "AsyncText is ready, returning JSX");
    return <span>{data}</span>;
  } catch (promise) {
    console.log(new Date().getTime(), "AsyncText is not ready yet, throwing");
    throw promise;
  }
};

const Loader: SFC<{ fallback: ReactNode; ms: number }> = props => {
  const Status: SFC<{ didTimeout: boolean }> = statusProps => {
    console.log(
      new Date().getTime(),
      "in Loader > Timeout, did timeout: ",
      statusProps.didTimeout
    );
    return statusProps.children as any;
  };

  return (
    <Placeholder
      delayMs={props.ms}
      fallback={<Status didTimeout>{props.fallback}</Status>}
    >
      <Status didTimeout={false}>{props.children}</Status>
    </Placeholder>
  );
};

const Text: SFC<{ text: string }> = props => <span>{props.text}</span>;

const LazyText = lazy<typeof Text>(() => {
  /* tslint:disable-next-line:no-console */
  console.log("Lazy Text: Starting loading");
  return new Promise(resolve => {
    setTimeout(() => resolve(Text), 3000);
  });
});

class App extends React.Component {
  state = { loadData: false, loadingIndicator: false };

  public render() {
    return (
      <div>
        {this.state.loadingIndicator && <p>Requested content:</p>}
        {this.state.loadData && (
          <Loader
            ms={1000}
            fallback={<span>The content is still loading :(</span>}
          >
            <LazyText text="test" />
            <AsyncText text="Hello world" ms={2500} />
          </Loader>
        )}
        <p>
          <button onClick={this.requestData}>load data</button>
        </p>
      </div>
    );
  }

  requestData = () => {
    this.setState({
      loadingIndicator: true
    });
    // We schedule a low priority update so that the state change takes place
    // during React's commit phase rather than render. If we use normal
    // setState, then the fallback component will be rendered by Placeholder
    // before it times out.
    unstable_scheduleCallback(() => {
      this.setState({ loadData: true });
    });
  };
}

// ReactDOM.render(<App />, document.getElementById("root"));
// No real reason to use this here in this example. unstable_createRoot allows
// you to defer rendering.
unstable_createRoot(document.getElementById("root")).render(<App />);
