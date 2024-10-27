import { useRef } from "react"
import { Editor, EditorProps, Monaco } from "@monaco-editor/react";

export const JsonEditor = (props: { json: never }) => {
    const editorRef = useRef<Monaco | null>(null)
    return <Editor beforeMount={monaco => {
        editorRef.current = monaco
    }}

        defaultLanguage="json" />
}
