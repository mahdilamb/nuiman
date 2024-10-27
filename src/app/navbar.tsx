import { IconFolder, IconFolderOpen, IconFile, IconCopyPlus, IconCopyMinus, IconProps, IconHttpGet, IconHttpDelete, IconHttpHead, IconHttpOptions, IconHttpPatch, IconHttpPost, IconHttpPut, IconQuestionMark, IconMailbox } from '@tabler/icons-react';
import { ActionIcon, AppShell, Group, RenderTreeNodePayload, ScrollArea, Tree, TreeNodeData, useTree, UseTreeReturnType } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { getCollectionJson } from '@/lib/postman/files';
import { Method } from '@/lib/postman/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { Collection, Item, Folder, isFolder } from '@/lib/postman/schemas/collections';
import { LocationType } from './page';
const iconProps: IconProps = { size: 15 }

interface ItemIconProps {
    name: string;
    isFolder: boolean;
    isCollection?: boolean
    expanded: boolean;
    method?: Method

}
type SetSelectedAction = React.Dispatch<React.SetStateAction<LocationType | null>>
function ItemIcon(props: ItemIconProps) {
    const { isFolder, expanded, method, isCollection } = props
    if (isCollection) {
        return <IconMailbox {...iconProps} />
    }
    if (isFolder) {
        return expanded ? (
            <IconFolderOpen {...iconProps} />
        ) : (
            <IconFolder {...iconProps} />
        );
    }
    switch (method) {
        case 'GET':
            return <IconHttpGet {...iconProps} />
        case 'DELETE':
            return <IconHttpDelete {...iconProps} />
        case 'HEAD':
            return <IconHttpHead {...iconProps} />
        case 'OPTIONS':
            return <IconHttpOptions  {...iconProps} />
        case 'PATCH':
            return <IconHttpPatch  {...iconProps} />
        case 'POST':
            return <IconHttpPost  {...iconProps} />
        case 'PUT':
            return <IconHttpPut  {...iconProps} />
        default:
            return <IconQuestionMark {...iconProps} />;
    }

}

function Leaf({ node, expanded, hasChildren, elementProps, tree, setSelected }: RenderTreeNodePayload & { setSelected: SetSelectedAction }) {
    return (
        <Group gap={5} {...elementProps} onClick={() => {
            tree.select(node.value)
            if (node.value !== '/') {
                tree.toggleExpanded(node.value)
            }

            setSelected({
                location: node.value,
                type: node.value === '/' ? 'collection' : hasChildren ? 'folder' : 'item',
                item: node.nodeProps?.item as never
            })
        }}>
            <ItemIcon name={node.value} isFolder={hasChildren} expanded={expanded} {...node.nodeProps} />
            <span title={node.nodeProps?.description}>{node.label}</span>
        </Group >
    );
}
function convertCollectionToTree(node: Collection | Folder, path = ''): TreeNodeData[] | undefined {
    const { item } = node

    if (!item) {
        return
    }
    const nodes = (item as Item[]).map((it: Item | Folder) => {
        const value = `${path}/${it.name}`
        if (isFolder(it)) {
            return {
                value,
                label: it.name,
                nodeProps: { description: it.description, item: it },
                children: convertCollectionToTree(it, value)
            }
        }

        return {
            value,
            label: it.name,
            nodeProps: { method: (it.request as Exclude<Item['request'], string>)?.method, description: it.description, item: it },
        }
    })
    if (path === '') {
        return [{
            value: '/',
            label: (node as Collection).info.name,
            nodeProps: { isCollection: true, item: node as never, },
            children: nodes
        }]
    }
    return nodes

}

const CollectionTree = (props: { tree: UseTreeReturnType, collection: Collection, setSelected: SetSelectedAction }) => {
    const { tree, collection } = props
    const data = useMemo(() => collection && convertCollectionToTree(collection), [collection]) ?? null

    return data && <Tree
        tree={tree}
        selectOnClick={false}
        expandOnClick={true}
        clearSelectionOnOutsideClick
        data={data}
        renderNode={(payload) => <Leaf {...payload} {...props} />}
        allowRangeSelection={false}
    />
}

export const NavBar = (props: {
    collection: Collection
    setSelected: SetSelectedAction
}) => {
    const tree = useTree({
        initialExpandedState: { '/': true },
        multiple: false
    });
    return (
        <AppShell.Navbar p="xs">
            <AppShell.Section style={{ display: 'flex' }} >
                <Group
                    gap={1}
                    justify='flex-end'
                    style={{
                        position: 'absolute',
                        right: 6,
                        zIndex: 90,

                    }}>
                    <ActionIcon onClick={() => tree.expandAllNodes()}><IconCopyPlus {...iconProps} /></ActionIcon>
                    <ActionIcon onClick={() => tree.collapseAllNodes()}><IconCopyMinus {...iconProps} style={{ width: '70%', height: '70%' }} /></ActionIcon>
                </Group>
            </AppShell.Section>
            <AppShell.Section grow component={ScrollArea}>
                <CollectionTree tree={tree} {...props} />
            </AppShell.Section>
        </AppShell.Navbar>
    );
}
