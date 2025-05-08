export interface NFTMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;         
    attributes: {
      mood: string;
      date: string;
      streak?: number;
    }[];
}
  