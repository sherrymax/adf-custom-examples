import { Component, OnInit} from '@angular/core';

import { Router } from '@angular/router';

import { ClaimSearchService } from '../app-search.service';

@Component({
    selector: 'app-claim-search',
    templateUrl: './app-claim-search.component.html',
    styleUrls: [`./app-claim-search.component.scss`],
//    providers:[ClaimSearchService]
})


export class ClaimSearchComponent implements OnInit {

//    @Output() searchCreated: EventEmitter<any> = new EventEmitter();


    constructor(public router: Router, public claimsearch: ClaimSearchService)
    {}


    ngOnInit(){
    }

    onSearchSubmit(claimInput: HTMLInputElement, policyInput: HTMLInputElement,dol: HTMLInputElement,clmnt: HTMLInputElement,xps: HTMLInputElement,lob: HTMLInputElement)
    {
//        console.log("Claim: " + claimInput.value + ", Policy: " + policyInput.value )

//            const value = (event.target as HTMLInputElement).value;
//            const value = claimInput.value + "," + policyInput.value;

            this.claimsearch.submittedSearch();

            this.router.navigate(['/search-page', {
                q: claimInput.value? claimInput.value:null,
                p: policyInput.value? policyInput.value:null,
                dol: dol.value? dol.value:null,
                clmnt : clmnt.value? clmnt.value:null,
                extp: xps.value? xps.value:null,
                lob: lob.value? lob.value:null
            }]);

    }

}
