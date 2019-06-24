import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PuppipayDashService } from '../providers/puppipay.dash.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

public transactions = [];

constructor(
        private puppipayservice: PuppipayDashService

  ) {
}

ngOnInit() {

this.gettransactions();

}

ionViewWillEnter() {
  this.gettransactions();
}



gettransactions() {

   this.puppipayservice.gettransactions().then((data: any) => {
      if(data != null)
      {
        this.transactions = data;
      }
      else {
        alert("No transactions ");
    }
    });

}
 

}
