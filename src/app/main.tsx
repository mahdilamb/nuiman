import { JsonEditor } from "@/components/json-editor";
import { PostmanEditor } from "@/components/postman-editor";
import { VariableEditor } from "@/components/variable-editor";
import { method as HttpMethod } from "@/lib/postman/enums";
import { Collection, Folder, Item } from "@/lib/postman/schemas/collections"
import { Group, Select, Tabs, TextInput } from "@mantine/core";
import { useState } from "react";
import tabStyles from './tabs.module.css'
import urlStyles from './url.module.css'
const CollectionTabs = () => {
    return <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="auth">Authorization</Tabs.Tab>
        <Tabs.Tab value="scripts">Scripts</Tabs.Tab>
        <Tabs.Tab value="variables">Variables</Tabs.Tab>
    </Tabs.List>
}
const FolderTabs = () => {
    return <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="auth">Authorization</Tabs.Tab>
        <Tabs.Tab value="scripts">Scripts</Tabs.Tab>
    </Tabs.List>
}
const SelectMethod = (props: { item: Item }) => {
    const { item } = props

    return <Select
        className={urlStyles.method}
        placeholder="Pick value"
        data={HttpMethod}
        value={item.request.method}
    />
}

const UrlInput = (props: { item: Item }) => {
    const { item } = props
    const [value, setValue] = useState(item.request.url.raw ?? `${item.request.url.host}${item.request.url.path && '/'}${(item.request.url.path || [].join('/'))}`)

    return <TextInput
        className={urlStyles.url}
        value={value} onChange={e => setValue(e.currentTarget.value)} />
}
const ItemTabs = (props: { item: Item }) => {
    const { item } = props
    return <>
        <Group className={urlStyles.group}><SelectMethod {...props} /><UrlInput {...props} /></Group>
        <Tabs.List>
            <Tabs.Tab value="params">Params</Tabs.Tab>
            <Tabs.Tab value="auth">Authorization</Tabs.Tab>
            <Tabs.Tab value="headers">Headers</Tabs.Tab>
            <Tabs.Tab value="body">Body</Tabs.Tab>
            <Tabs.Tab value="scripts">Scripts</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List></>
}
export const Main = (props: {
    collection?: Collection
    folder?: Folder
    item?: Item
}) => {
    const { collection, folder, item } = props
    const [activeTab, setActiveTab] = useState<'params' | 'overview' | 'auth' | 'headers' | 'body' | 'scripts' | 'variables' | 'settings'>(item ? 'scripts' : 'overview');

    if (!collection && !folder && !item) {
        return null
    }
    return (
        <Tabs
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
            value={activeTab}
            onChange={setActiveTab as never}>
            {collection && <CollectionTabs />}{folder && <FolderTabs />}{item && <ItemTabs item={item} />}
            <Tabs.Panel value="params" className={tabStyles.panel}><VariableEditor variables={item?.request?.params} /></Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="overview">Overview</Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="auth">auth</Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="headers" ><VariableEditor variables={item?.request?.header} /></Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="body"><JsonEditor json={item?.request.body} /></Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="scripts"><PostmanEditor contentFrom={collection ?? folder ?? item} /></Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="variables">variables</Tabs.Panel>
            <Tabs.Panel className={tabStyles.panel} value="settings">settings</Tabs.Panel>

        </Tabs>
    );

}
