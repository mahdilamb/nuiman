
'use client'

import React, { useEffect, useRef, useState } from "react";

import { Main } from "@/app/main";
import { AppShell, Loader } from "@mantine/core";
import { NavBar } from "./navbar";
import { Collection, Folder, Item } from "@/lib/postman/schemas/collections";
import { getCollectionJson } from "@/lib/postman/files";
import { Footer } from "./footer";

export type LocationType = { location: string, type: 'collection' | "folder" | 'item', item: Collection | Item | Folder }
export default function Home() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [selected, setSelected] = useState<LocationType | null>(null)
  useEffect(() => {
    getCollectionJson().then(json => {
      setCollection(json as never)
      setSelected({
        location: '/',
        type: 'collection',
        item: json as Collection
      })
    })
  }, [])
  if (!collection) {
    return <Loader />
  }
  return <AppShell
    navbar={{
      width: 360,
      breakpoint: 'sm',
    }}
    padding="md"

    footer={{ height: 40 }}
  >
    <NavBar collection={collection} setSelected={setSelected} />
    <AppShell.Main style={{ display: 'flex' }}>
      <Main
        collection={selected?.type === 'collection' ? selected.item as Collection : undefined}
        folder={selected?.type === 'folder' ? selected.item as Folder : undefined}
        item={selected?.type === 'item' ? selected.item as Item : undefined}
      />
    </AppShell.Main>
    <AppShell.Footer><Footer collection={collection} /></AppShell.Footer>
  </AppShell>


}
