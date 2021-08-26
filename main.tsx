import * as React from "react";
import * as ReactDom from "react-dom";
// import * as top from "./top.png";
import { css } from "@emotion/css";

const App = (): React.ReactElement => {
  return (
    <div
      className={css({
        display: "grid",
        gap: 8,
        gridTemplateColumns: "1fr 1fr 1fr",
      })}
    >
      {Array.from({ length: 20 }, (_, i) => i).map((item) => (
        <Card key={item} text={"記事" + item.toString()} />
      ))}
    </div>
  );
};

const Card = (props: { text: string }): React.ReactElement => {
  return (
    <div
      className={css({
        backgroundColor: "red",
        padding: 8,
        ":hover": {
          backgroundColor: "pink",
        },
        width: 256,
        height: 128,
      })}
    >
      {/* <img
        className={css({
          width: 256,
          height: 100,
          objectFit: "contain",
          display: "block",
        })}
        src={top}
        alt="かまうさぎ"
      /> */}
      {props.text}
    </div>
  );
};

const entryElement = document.createElement("div");
document.body.append(entryElement);

ReactDom.render(<App />, entryElement);
