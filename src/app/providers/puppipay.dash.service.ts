import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import {of as observableOf} from 'rxjs';
import {map, tap} from 'rxjs/operators';

declare var dashcore;


@Injectable({
  providedIn: 'root'
})

export class PuppipayDashService {
  url: string ;

  transactions= [];

  constructor(public http: Http, public storage: Storage) {
     this.loadtransactions() ;
  }


  savetransaction (details: any) {
    if(details != null) {
      this.transactions.push(details);
      this.storage.set('transactions',this.transactions);
    }
  }


  loadtransactions() {
      this.storage.get('transactions').then((data)=> {
	if(data) {
        this.transactions = data;
        }
      });
  }


  gettransactions() {
    return this.storage.get('transactions');
  }


  


  getBalance(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address).subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

   getUtxo(address: string, network: string): any {

     var url ;

     if(network == 'testnet') {
        url = 'https://testnet-insight.dashevo.org/insight-api/addr/';
     }
     else {
        url = 'https://insight.dashevo.org/insight-api/addr/';
     }

     return new Promise((resolve, reject) => {


     this.http.get(url+address+"/utxo").subscribe(res => {
                let data = res.json();
                resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }

  createtransaction(utxo, privatekey,changeaddress, toaddress, toamount,fees) {

  var tx = new dashcore.Transaction()
      .from(utxo)
      .to([{address: toaddress, satoshis: toamount}])
      .fee(fees)
      .change(changeaddress)
      .sign(privatekey);

  var txobject = tx.toBuffer();

   return txobject;
 }

 broadcast( tx) {

   var pushtx = {
    rawtx: tx
   };


   var lurl = 'https://testnet-insight.dashevo.org/insight-api/tx/send';

   return new Promise((resolve, reject) => {


             let headers = new Headers();

             headers.append('Content-Type', 'application/json');

            this.http.post(lurl, JSON.stringify(pushtx), {headers: headers})
              .subscribe(res => {

                let data = res.json();
                resolve(data);

              }, (err) => {
                reject(err);
              });

        });

  }




}
