export type Shelf = {
  id: string;
  name: string;
  items: Array<Item>;
};

export type Item = { id: string; name: string };
