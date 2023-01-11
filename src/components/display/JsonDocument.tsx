import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";

export default function JsonDocument({jsonObject} : {jsonObject : any}) {
  return (
    <SyntaxHighlighter language="json" showLineNumbers={false}>
      {JSON.stringify(jsonObject, null, "  ")}
    </SyntaxHighlighter>
  );
}
