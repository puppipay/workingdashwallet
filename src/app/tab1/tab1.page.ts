import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PuppipayDashService } from '../providers/puppipay.dash.service';


declare var dashcore;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{

public walletbalance: any;
public walletaddress: any;
public walletwif: any;
public toaddress: string;
public toamount: number;
public txid: string;

constructor( private storage: Storage,
         private puppipayservice: PuppipayDashService ) {

}


ngOnInit() {

  this.loadwalletwif() ;
}

ionViewWillEnter() {
  this.loadwalletwif() ;
}

wiftoaddress() {

  this.walletaddress = dashcore.PrivateKey.fromWIF(this.walletwif ).toAddress(dashcore.Networks.testnet).toString();

}


sendpayment() {

 this.puppipayservice.getUtxo(this.walletaddress, 'testnet').then((data: any) => {
 var fees = 15000;
 var utxo = data;
 var privatekey = dashcore.PrivateKey.fromWIF(this.walletwif);
 var changeaddress = this.walletaddress;

    var tx = this.puppipayservice.createtransaction(utxo, privatekey,changeaddress, this.toaddress, Number(this.toamount),fees ) ;

    this.puppipayservice.broadcast(tx.toString('hex')).then((res: any) => {
      if(res) {
        this.txid = res.txid;
        var trandata = {
	    txid: this.txid,
	    fromaddress: this.walletaddress,
	    toaddress: this.toaddress,
	    amount: Number(this.toamount),
	    fees: fees
        };

       this.puppipayservice.savetransaction(trandata);

      }
    });

  });
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
 alert("Address empty");
 return;
}

 this.puppipayservice.getBalance(this.walletaddress, "testnet").then((data: any) => {
      if(data != null)
      {
        this.walletbalance = data;
      }
      else {
        alert("Query failed");
      }
   }, (err)=> {
     alert (err)
   });
}







}
