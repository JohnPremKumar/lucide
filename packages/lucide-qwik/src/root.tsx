import { Camera } from "../lib/dist/index.qwik.mjs";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <Camera color="red" size={200}/>
      </body>
    </>
  );
};
