export type SearchDoc = {
  type: string;
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
};

export type SearchResult = Omit<SearchDoc, "keywords">;
