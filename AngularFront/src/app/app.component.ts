import { Component, QueryList, ViewChildren } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProductComponent } from './product/product.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'IsisAdventureCapitalist';
  world: World = new World();
  server: String="http://localhost:8080/";
  username: string = '';
  qtmulti=1;
  badgeManagers=0;
  badgeCashUpgrades="";

  constructor(private service: RestserviceService, private snackBar: MatSnackBar) {
    this.server = service.getServer();
    this.createUsername();
    service.getWorld().then( 
    world => {
      this.world = world;
    });
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.world.score = this.world.score + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    if (this.world.money >= 150) {
      this.badgeManagers = 1; 
      this.badgeCashUpgrades =" new!!";
    }
    if (this.world.money >= 500) {
      this.badgeManagers = 2; 
    }
    if (this.world.money >= 1000) {
      this.badgeManagers = 3; 
    }
    if (this.world.money >= 2000) {
      this.badgeManagers = 4; 
    }
    if (this.world.money >= 5000) {
      this.badgeManagers = 5; 
    }
    if (this.world.money >= 10000) {
      this.badgeManagers = 6; 
    }
    this.service.putProduct(p);

  }

  onBuy(recu) {
    this.world.money = this.world.money - recu.prix;
    this.service.putProduct(recu.product);
  }


  buyManager(p: Pallier) {
    if (this.world.money >= p.seuil) {
      this.service.putManager(p);
      this.world.money = this.world.money - p.seuil;
      this.world.managers.pallier[this.world.managers.pallier.indexOf(p)].unlocked = true;
      this.world.products.product.forEach(element => {
        if (p.idcible == element.id) {
          this.world.products.product[this.world.products.product.indexOf(element)].managerUnlocked = true;
        }
      });
    }
    
  }

  popMessage(message : string) : void {
    this.snackBar.open(message, "", { duration : 2000 })
    }

  multFun() {
    switch (this.qtmulti) {
      case 1:
        this.qtmulti = 10
        break;
      case 10:
        this.qtmulti = 100
        break;
      case 100:
        this.qtmulti = 999
        break;
      default:
        this.qtmulti = 1
    }
  }
  
  onUsernameChanged(): void {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }
  
  createUsername(): void {
    this.username = localStorage.getItem("username");
    if (this.username == '') {
      this.username = 'Player' + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);
    }
    this.service.setUser(this.username);
  }

  @ViewChildren(ProductComponent) public productsComponent: QueryList<ProductComponent>;

  buyCashUpgrade(p: Pallier) {
    if (this.world.money > p.seuil) {
      this.service.putUpgrade(p);
      this.world.money = this.world.money - p.seuil;
      this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(p)].unlocked = true;
      if (p.idcible == 0) {
        this.productsComponent.forEach(produit => produit.calcUpgrade(p));
      }
      else {
        this.productsComponent.forEach(produit => {
          if (p.idcible == produit.product.id) {
            produit.calcUpgrade(p);
          }
        })
      } 
      this.service.putUpgrade(p);
    }
  }

  bonusAllunlock() {
    const minQuantite = Math.min(...this.productsComponent.map(p => p.product.quantite));
    this.world.allunlocks.pallier.map(value => {
      if (!value.unlocked && minQuantite >= value.seuil) {
        this.world.allunlocks.pallier[this.world.allunlocks.pallier.indexOf(value)].unlocked = true;
        this.productsComponent.forEach(prod => prod.calcUpgrade(value));
      }
    });
  }

  ngOnInit(): void {
    setInterval(() => {
      this.service.saveWorld(this.world);
      this.bonusAllunlock()
    }, 5000);
  }

}
