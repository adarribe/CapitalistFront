import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Product } from '../world';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  lastupdate: number;
  prodInProgress: boolean;
  progressbar: any;
  product: Product;
  server: String="http://localhost:8080/";
  progress:any;

  @ViewChild('bar') progressBarItem: ElementRef;
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyMoney: EventEmitter<number> = new EventEmitter<number>();
  

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
        easing: 'easeInOut',
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
        }
      });
    }, 100)
  }


  @Input()
  set prod(value: Product){
    this.product = value;
  }
  
  startFabrication() {
    if (this.product.quantite >= 1) {
      this.progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.progressbar.animate(1, { duration: this.progress });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.prodInProgress = true;
    }
  }

  calcScore() {
    if (this.prodInProgress) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      } else {
        this.product.timeleft = 0;
        this.lastupdate = 0;
        this.prodInProgress  = false;
        this.progressbar.set(0);
      }
      // on prévient le composant parent que ce produit a généré son revenu.
      this.notifyProduction.emit(this.product);
    }
    if (this.product.managerUnlocked) {
      this.startFabrication();
    }
  }

  _qtmulti: number;
  @Input()
  set qtmulti(value: number) {
  this._qtmulti = value;
  if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  calcMaxCanBuy(): number {
    let qMax = 0;
    let maxMonney = 0;
    let maxBuyable = 1;
    while (maxMonney < this._money) {
      maxBuyable = maxBuyable * this.product.cout;
      maxMonney = maxMonney + maxBuyable;
      qMax = qMax + 1;
      if (this.product.cout > this._money) {
        qMax = 0;
      }
    }
    return qMax;
  }

 buyProduct() {
   if (this._qtmulti <= this.calcMaxCanBuy()) {
      var price = this.product.cout * this._qtmulti;
      this.product.quantite = this.product.quantite + this._qtmulti;
      this.notifyMoney.emit(price);
      this.product.palliers.pallier.forEach(val => {
        if (!val.unlocked && this.product.quantite > val.seuil) {
          this.product.palliers.pallier[this.product.palliers.pallier.indexOf(val)].unlocked = true;
        }
      })
    }
  }

}
