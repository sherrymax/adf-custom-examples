export class SearchKendraResponse {
    'searchKendra': searchKendraModel;
}

export class searchKendraModel {
    id: string;
    type: string;
    name: string;
    format: string;
    documentURI: string;
    documentTitle: string;
    documentExcerpt: string;
    feedbackToken: string;
    scoreConfidence: string;
    pageCount: string;
    excerptPageNumber: string;
    documentExcerptHTMLString: string;
    sourceRepo: string;
    sourceLogoURL: string;
    highlightList: any[];
}