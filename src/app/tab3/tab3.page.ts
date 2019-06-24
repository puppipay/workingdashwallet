import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, Headers } from '@angular/http';
import { PuppipayDashService  } from '../providers/puppipay.dash.service';

declare var dashcore;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

walletwif : any;
walletaddress : any;
testnetaddressbalance : any;
url: string;

constructor(public http: Http, 
         private puppipayservice: PuppipayDashService,
	public storage: Storage) {

    this.loadwalletwif() ;

}

ionViewWillEnter() {
  this.loadwalletwif() ;
}


createwif() {

  var privateKey = new dashcore.PrivateKey();
  this.walletwif = privateKey.toWIF();
  this.wiftoaddress() ;

}

wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}

savewif() {

   this.wiftoaddress() ;
   this.storage.set('walletwif', this.walletwif);

}


loadwalletwif() {
     this.storage.get('walletwif').then(data=> {
	if(data) {
      this.walletwif = data;
      this.wiftoaddress() ;
      this.gettestnetbalance() ;
        }
     });
}





gettestnetbalance() {

if(!this.walletaddress) {
 alert("Testnet address empty");
 return;
}

 this.puppipayservice.getBalance(this.walletaddress, "testnet").then((data: any) => {
      if(data != null)
      {
        this.testnetaddressbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}


}
