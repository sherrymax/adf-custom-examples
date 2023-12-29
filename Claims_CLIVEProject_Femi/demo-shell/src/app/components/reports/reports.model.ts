
export class ReportsResponse {
    'claimObject': ClaimObjectModel;
}

export class ClaimObjectModel {
    claimNumber: string;
    nodeId: string;
    claimStatus: string;
    claimAmount: string;
    agency: string;
    filingDate: string;
    submitter: string;
    isClaimAlreadyFiled: boolean;
}
