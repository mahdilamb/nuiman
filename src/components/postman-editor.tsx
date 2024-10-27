

import { Tabs } from "@mantine/core";
import { Editor, EditorProps, Monaco } from "@monaco-editor/react";

import React, { useEffect, useRef, useState } from "react";

import chaiLib from "!!raw-loader!../../node_modules/@types/chai/index.d.ts";
import postmanCollectionLib from "!!raw-loader!../../node_modules/postman-collection/types/index.d.ts";
import postmanTestLib from "!!raw-loader!../../node_modules/postman-sandbox/types/sandbox/test.d.ts";
import postmanPrerequestLib from "!!raw-loader!../../node_modules/postman-sandbox/types/sandbox/prerequest.d.ts";
import { Collection, Folder, Item } from "@/lib/postman/schemas/collections";

type Lib = "test" | "prerequest"
const changeToScript = (monaco: Monaco, options: { lib?: Lib }) => {
    const { javascriptDefaults } = monaco.languages.typescript

    javascriptDefaults.setExtraLibs([
        { content: chaiLib },
        { content: `declare module "postman-collection" {${postmanCollectionLib}}` },
        { content: options.lib ? postmanTestLib : postmanPrerequestLib }
    ])

}
function PostmanScriptEditor(props: EditorProps & { lib?: Lib }) {
    const {
        beforeMount = () => { },
        lib = 'test',
        defaultLanguage = 'javascript',
        ...restProps
    } = props
    return (
        <Editor
            {...restProps}
            beforeMount={monaco => {
                changeToScript(monaco, { lib })
                beforeMount(monaco)
            }
            }
        />
    );
}

export function PostmanEditor(props: EditorProps & { contentFrom?: Collection | Folder | Item }) {
    const editorRef = useRef<Monaco | null>(null)
    const [value, setValue] = useState('')
    console.log(1)
    const Editor = <PostmanScriptEditor
        {...props}
        onChange={(e) => setValue(e || '')}
        value={value}
        lib="test"
        language="javascript"
        beforeMount={monaco => {
            editorRef.current = monaco
        }}
    ></PostmanScriptEditor>
    const [activeTab, setActiveTab] = useState<Lib>('test');

    const script = props.contentFrom?.event?.find(event => event.listen === activeTab)?.script
    useEffect(() => {
        setValue((script?.exec || []).join('\n'))
    }, [script])
    return <Tabs defaultValue="test" orientation="vertical"
        onChange={(e) => {
            editorRef.current && changeToScript(editorRef.current, { lib: e as never })
            setActiveTab(e as Lib)
        }}
    >
        <Tabs.List >
            <Tabs.Tab value="prerequest">Pre-request</Tabs.Tab>
            <Tabs.Tab value="test">Post-response</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="prerequest">
            {Editor}
        </Tabs.Panel>
        <Tabs.Panel value="test">
            {Editor}
        </Tabs.Panel>
    </Tabs>

}
