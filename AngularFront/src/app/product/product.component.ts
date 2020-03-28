import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  

  constructor() { }

  ngOnInit(): void {
  }

  product: Product;

  @Input()
  set prod(value: Product){
    this.product = value;
  }
  

}
