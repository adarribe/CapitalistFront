import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { World, Pallier, Product} from './world';

@Injectable({
  providedIn: 'root'
})

export class RestserviceService {

  server = 'http://localhost:8080/';
  user = '';

  public getServer()
  {
    return this.server;
  }

  public getUser(): string {
    return this.user;
  }
  public setUser(user: string) {
    this.user = user;
  }

  public setServer(server)
  {
    this.server = server;
  }

  constructor(private http: HttpClient) {
  
  }
  
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "demo/generic/world", {
   headers: this.setHeaders(this.user)})
    .toPromise().catch(this.handleError);
   };
   

  private setHeaders(user: string): HttpHeaders {
    var headers = new HttpHeaders();
    headers.append("X-User",user);
    return headers;
   
  };

  public putManager(manager: Pallier): Promise<Response> {
     return this.http
       .put(this.server + "demo/generic/manager", manager, {
         headers: { "X-user": this.getUser() }
       })
       .toPromise()
       .then(response => response)
       .catch(this.handleError);
   };

   public putUpgrade(upgrade: Pallier): Promise<Response> {
    return this.http
      .put(this.server + "demo/generic/upgrade", upgrade, {
        headers: { "X-user": this.getUser() }
      })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  };

  public putProduct(produit: Product): Promise<Response> {
    return this.http
      .put(this.server + "demo/generic/product", produit, {
        headers: { "X-user": this.getUser() }
      })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  };

}
