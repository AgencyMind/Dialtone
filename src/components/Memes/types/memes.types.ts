
export interface MemeData {
    memeToken: string;
    memeImage: string;
    memeTitle: string;
    memeTags: string;
  }
  
  export interface MemeDetails {
    memeToken: string;
    memeImage: Blob | undefined;
    memeTitle: string;
    memeTags: string;
  }
  
  export interface TokenData {
    token: string;
    image: string;
    price: string;
    tokenPair: string;
  }
  