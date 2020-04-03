import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'IsisAdventureCapitalist';
  world: World = new World();
  //server: string;
  server: String="http://localhost:8080/";
  username: string = '';
  qtmulti=1;
  badgeManagers=0;

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
  }

  onBuy(m: number) {
    this.world.money = this.world.money - m;
  }

  buyManager(p: Pallier) {
    if (this.world.money >= p.seuil) {
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
}
