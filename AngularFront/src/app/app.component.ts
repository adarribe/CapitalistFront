import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'IsisAdventureCapitalist';
  world: World = new World();
  server: string;
  username: string = 'testUsername';
  qtmulti=1;
  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(

    world => {
      this.world = world;
    });
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.world.score = this.world.score + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
  }

  onBuy(m: number) {
    this.world.money = this.world.money - m;
  }
}
