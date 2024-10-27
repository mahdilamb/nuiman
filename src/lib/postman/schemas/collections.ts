import {
  Schema as collection_v2_0_0,
  Folder as Folder_v2_0_0,
  Item as Item_v2_0_0,
} from "@/lib/postman/schemas/collection-v2_0_0";
import {
  Schema as collection_v2_1_0,
  Folder as Folder_v2_1_0,
  Item as Item_v2_1_0,
} from "@/lib/postman/schemas/collection-v2_1_0";

export type Collection = collection_v2_0_0 | collection_v2_1_0;
export type Folder = Folder_v2_0_0 | Folder_v2_1_0;
export type Item = Item_v2_0_0 | Item_v2_1_0;

export const isFolder = (entity: Item | Folder): entity is Folder => {
  return Array.isArray(entity.item);
};
