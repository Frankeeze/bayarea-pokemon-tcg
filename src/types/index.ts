export interface CardBrief {
  id: string;
  localId: string;
  name: string;
  image?: string;
}

export interface CardSet {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: {
    official: number;
    total: number;
  };
}

export interface Card {
  id: string;
  localId: string;
  name: string;
  image?: string;
  category?: string;
  illustrator?: string;
  rarity?: string;
  hp?: number;
  types?: string[];
  stage?: string;
  evolveFrom?: string;
  description?: string;
  attacks?: Array<{
    name: string;
    cost?: string[];
    damage?: number | string;
    effect?: string;
  }>;
  weaknesses?: Array<{ type: string; value: string }>;
  retreat?: number;
  set?: CardSet;
  variants?: {
    normal?: boolean;
    holo?: boolean;
    reverse?: boolean;
    firstEdition?: boolean;
  };
  regulationMark?: string;
  legal?: {
    standard?: boolean;
    expanded?: boolean;
  };
}

export interface CardList {
  id: string;
  name: string;
  cardIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface StoredLists {
  lists: CardList[];
  activeListId: string | null;
}
