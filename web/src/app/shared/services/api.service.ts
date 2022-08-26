import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CrearJuegoCommand } from '../commands/crearJuegoCommand';
import { IniciarJuegoCommand } from '../commands/iniciarJuegoCommand';
import { Jugador } from '../model/juego';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private http: HttpClient, private afs: AngularFirestore,
  ) { }

  crearJuego(command: CrearJuegoCommand) {
    return this.http.post(environment.apiBase + '/juego/crear', command);
  }

  iniciarJuego(command: IniciarJuegoCommand){
    return this.http.post(environment.apiBase + '/juego/iniciar', command);
  }

  getJugadores(): Observable<Jugador[]> {
    return this.afs.collection<User>(`users`).snapshotChanges().pipe(map((actions) => {
      const jugadores = actions.map(item => {
        const data = item.payload.doc.data();
        return {uid: data.uid, alias: data.displayName};
      });
      return jugadores;
    }));
  }

  //TODO: consulta de mis juegos
  getMisJuegos(uid:string) {
    return this.http.get(environment.apiBase + '/juego/listar/' + uid)
  }

  //TODO: consulta de mi mazo
  getMiMazo(uid:string, juegoId:string){
    return this.http.get(environment.apiBase + '/juego/' + juegoId + '/getMazo/' + uid);
  }

  //TODO: consulta tablero del juego
  getTablero(juegoId:string){
    return this.http.get(environment.apiBase + '/juego/getTablero/' + juegoId)
  }
}
