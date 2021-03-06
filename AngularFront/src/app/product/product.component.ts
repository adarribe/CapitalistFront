import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { Product } from '../world';
import { Pallier } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
  
})

export class ProductComponent implements OnInit {
  //private service: RestserviceService;
  service: RestserviceService;
  lastupdate: number;
  prodInProgress: boolean;
  progressbar: any;
  product: Product;
  server: String="http://localhost:8080/";
  progress:any;
  newPrice: number;
  creation: boolean;

  

  @ViewChild('bar') progressBarItem: ElementRef;
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyMoney = new EventEmitter();
  @Output() notifyProduct: EventEmitter<Product> = new EventEmitter<Product>();

 

  

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
        strokeWidth: 4,
        easing: 'easeOut',
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#750000' },
        to: { color: '#02d60d' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
        }
      });
    }, 100)
  }


  @Input()
  set prod(value: Product){
    this.product = value;
    this.newPrice = this.product.cout;
    if (this.product.managerUnlocked && this.product.timeleft > 0) {
      this.lastupdate = Date.now();
      this.progressbar = this.product.vitesse;
    }
  }
  
  startFabrication() {
    if (this.product.quantite >= 1) {
      this.progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.prodInProgress = true;
      if (this.creation){
        this.notifyProduct.emit(this.product);
        this.creation=false;
      } 
    }
    
  }

  put(){
    this.creation =true ;
    this.startFabrication()

  }


  calcScore() {
    if (this.product.managerUnlocked && this.product.timeleft === 0) {
      this.startFabrication();
    }
    else if (this.product.timeleft >0 ) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
        this.lastupdate = Date.now();
    if(this.product.timeleft <= 0){
        this.product.timeleft = 0;
        this.lastupdate = 0;
        this.prodInProgress  = false;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
        if (this.product.managerUnlocked){
          this.prod;
        }
      }
    }
  }
  

  _qtmulti: number;
  @Input()
  set qtmulti(value: number) {
    if (value >= 999) {
      this._qtmulti = this.calcMaxCanBuy();
    }
    else {
      this._qtmulti = value;
    }
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  calcMaxCanBuy(): number {
    let qMax = 0;
    let maxCost = 0;
    let priceOne = 0;
    priceOne = this.product.cout;
    while ((maxCost+priceOne) <= this._money) {
      maxCost += priceOne;
      qMax ++;
      priceOne = priceOne*this.product.croissance;
    }
    return qMax;
  }

  buyProduct() {
    if (this._qtmulti <= this.calcMaxCanBuy()) {
      var price = 0;
      var p = 0;
      for(let i=0; i<this._qtmulti; i++){
        this.newPrice = this.newPrice*this.product.croissance;
        p= this.product.cout
        price = price + this.newPrice;
        this.product.cout= price;
      }
      this.product.quantite = this.product.quantite + this._qtmulti;
      this.notifyMoney.emit({prix :p, product: this.product});
      //this.product.quantite = this.product.quantite + this._qtmulti;
      this.product.palliers.pallier.forEach(value => {
        if (!value.unlocked && this.product.quantite > value.seuil) {
          this.product.palliers.pallier[this.product.palliers.pallier.indexOf(value)].unlocked = true;
          this.calcUpgrade(value);
        }
      })
      this.service.putProduct(this.product);

    }
  }

  calcUpgrade(pallier: Pallier) {
    switch (pallier.typeratio) {
      case 'vitesse':
        this.product.vitesse = this.product.vitesse / pallier.ratio;
        break;
      case 'gain':
        this.product.revenu = this.product.revenu * pallier.ratio;
        break;
    }
  }

}
