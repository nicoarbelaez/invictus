export interface Collection {
  id: number;
  title: string;
  path: string;
  tags: string[];
}

export interface CollectionsData {
  categories: Collection[];
  specials: Collection[];
}

export enum CollectionsItems {
  CATEGORIES = "categories",
  SPECIALS = "specials",
}
export interface RouteItem {
  id: number;
  label: string;
  path: string;
  collections?: Array<CollectionsItems>;
}
