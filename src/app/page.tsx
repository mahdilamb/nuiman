
'use client'
import "./page.module.css";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";

import { type editor } from 'monaco-editor';
import { postmanType } from "@/postman";

const DEFAULT_VALUE = "pm"
export default function Home() {

  const [value, setValue] = useState(DEFAULT_VALUE)
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  // console.log(value)
  return (
    <Editor
      height="90vh"
      language="typescript"
      defaultValue={DEFAULT_VALUE}
      value={value}
      beforeMount={monaco => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES2016,
          allowNonTsExtensions: true,
          moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monaco.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,

        })
        console.log(postmanType)
        const { typescriptDefaults } = monaco.languages.typescript
        typescriptDefaults.addExtraLib(
          "interface Foo { foo: number; }; declare const o:Foo ");

      }
      }
      onMount={editor => editorRef.current = editor
      }
      onChange={(e) => setValue(e || "")} options={{

      }} />
  );
}
