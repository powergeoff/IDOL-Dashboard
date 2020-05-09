export interface IdolField{
    name: string;
    value: string;
}

export interface Hit{
    Reference: string;
    Id: string;
    Title: string;
    Summary: string;
    Description: string;
    Fields: IdolField[];
}

export interface IdolResponse{
    NumberOfHits: number;
    DataBases: string[];
    Hits: Hit[];
}