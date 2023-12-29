import { EventEmitter, Injectable, OnInit } from "node_modules_backup/@angular/core";


@Injectable({ providedIn: 'root' })
export class ClaimSearchService implements OnInit{

    search = false;

    searchCreated = new EventEmitter<any>();
    constructor(){};


   // constructor(private claimSearch: ClaimSearchService){};

    ngOnInit(): void {

    }

    public submittedSearch()
    {
 //       this.claimSearch.search = true;
 //       this.claimSearch.searchCreated.emit();
        console.log("Service Function")
        this.search = true;
        console.log("search: " + this.search)
        this.searchCreated.emit();

    }

}
