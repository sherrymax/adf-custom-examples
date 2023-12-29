import { Component } from '@angular/core';
import { ReportsService } from './reports.service';
import { ClaimObjectModel } from './reports.model';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [
    ReportsService
  ]
})
export class ReportsComponent {

  constructor(public reportsService: ReportsService, public claim: ClaimObjectModel, public datepipe: DatePipe) {

  }
  // nodeIdList = [];
  claimList = [];
  // currentNodeId = "";
  // currentClaimId = "";
  // isCurrentClaimAlreadyFiled = false;

  ngOnInit() {
    console.log("*** **** ****");
    this.getChildNodeIds();
    setTimeout(() => {
      this.claimList.forEach(claimObj => {
        // for(var i=0 ; i<this.nodeIdList.length; i++){ var nodeId = this.nodeIdList[i];
        var nodeId = claimObj["nodeId"];
        console.log(">>> NODE ID " + nodeId);
        this.getClaimDetails(nodeId);

        setTimeout(() => {
          this.isClaimAlreadyFiled(claimObj["claimNumber"]);
          setTimeout(() => {
            console.log("Is claim # " + claimObj['claimNumber'] + " already filed ? " + claimObj['isClaimAlreadyFiled']);

            if (!claimObj['isClaimAlreadyFiled']) {
              this.createClaim(claimObj);
            }
          }, 5000);
        }, 5000);
        // } //end of FOR loop
      });
    }, 5000);


  }

  getChildNodeIds() {
    this.reportsService.getChildren().subscribe(res => {
      console.dir(res);
      res.forEach(item => {
        var clm = new ClaimObjectModel();
        clm.nodeId = item["entry"]["id"];
        clm.agency = "-";
        clm.claimAmount = "-";
        clm.claimNumber = "-";
        clm.claimStatus = "-";
        clm.filingDate = "-";
        clm.submitter = "-";

        this.claimList[this.claimList.length] = clm;
        // this.nodeIdList.push(item["entry"]["id"]);
      });
      console.dir(this.claimList);
      console.log("*** **** ****");
    });
  }

  getClaimDetails(nodeId) {
    this.reportsService.getNodeProperties(nodeId).subscribe(res => {
      // this.currentClaimId = res["cca:claimNumber"];

      for (var i = 0; i < this.claimList.length; i++) {
        if (this.claimList[i].nodeId == nodeId) {
          this.claimList[i].agency = res["cca:agencyName"];
          this.claimList[i].claimAmount = res["cca:claimAmt"];
          this.claimList[i].claimNumber = res["cca:claimNumber"];
          this.claimList[i].claimStatus = res["cca:claimStatus"];
          this.claimList[i].filingDate = res["cca:reportDate"];
          this.claimList[i].submitter = res["cca:policyHolderName"];
        }
      }



    });
  }

  isClaimAlreadyFiled(claimNumber) {
    this.reportsService.findClaimInElasticDB(claimNumber).subscribe(res => {
      console.dir(res);

      for (var i = 0; i < this.claimList.length; i++) {
        if (this.claimList[i].claimNumber == claimNumber) {
          // console.log("Is claim # "+claimId+" already filed ? "+(res > 0));
          this.claimList[i].isClaimAlreadyFiled = (res > 0);
        }
      }
    });
  }

  createClaim(claimObj) {
    var claimToInsert = {};
    claimToInsert["Agency"] = claimObj.agency;
    claimToInsert["Amount"] = claimObj.claimAmount;
    claimToInsert["Claim-Number"] = claimObj.claimNumber;
    claimToInsert["Status"] = claimObj.claimStatus;
    var filingDate = new Date(claimObj.filingDate);
    // claimToInsert["Filing-Date"] = filingDate.getDate()+"-"+filingDate.getMonth()+"-"+filingDate.getFullYear();
    claimToInsert["Filing-Date"] = this.datepipe.transform(filingDate, 'dd-MMM-yyyy');
    claimToInsert["Submitter"] = claimObj.submitter;

    this.reportsService.insertClaimToElasticDB(claimToInsert).subscribe(res => {
      console.log("Status of Insertion of Claim # " + claimObj.claimNumber + " is --> " + res)
    });
  }

}
