import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Carta } from 'src/app/shared/model/mazo';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

//TODO: componente para el tablero de juego
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})


export class BoardComponent implements OnInit, OnDestroy {
  cartasDelJugador: Carta[] = [];
  cartasDelTablero: Carta[] = [];
  tiempo: number = 0;
  jugadoresRonda: number = 0;
  jugadoresTablero: number = 0;
  numeroRonda: number = 0;
  juegoId: string = "";
  uid: string = "";
  roundStarted:boolean = false;

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public ws: WebsocketService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.juegoId = params['id'];
      this.uid = this.authService.user.uid;
      this.api.getMiMazo(this.uid, this.juegoId).subscribe((element:any) => {
        this.cartasDelJugador = element.cartas;
      });

      this.api.getTablero(this.juegoId).subscribe((element) => {
        this.cartasDelTablero = Object.entries(element.tablero.cartas).flatMap((a: any) => {
          return a[1];
        });
        this.tiempo = element.tiempo;
        this.jugadoresRonda = element.ronda.jugadores.length;
        this.jugadoresTablero = element.tablero.jugadores.length;
        this.numeroRonda = element.ronda.numero;
      });

      this.ws.connect(this.juegoId);
      this.ws.subscribe((event) => {
        console.log(event);
        if (event.type === 'cardgame.ponercartaentablero') {
          this.cartasDelTablero.push({
            cartaId: event.carta.cartaId.uuid,
            poder: event.carta.poder,
            estaOculta: event.carta.estaOculta,
            estaHabilitada: event.carta.estaHabilitada,
          });
        }
        if (event.type === 'cardgame.cartaquitadadelmazo') {
          this.cartasDelJugador = this.cartasDelJugador
            .filter((item) => item.cartaId !==  event.carta.cartaId.uuid);
        }
        if (event.type === 'cardgame.tiempocambiadodeltablero') {
          this.tiempo = event.tiempo;
        }

        if(event.type === 'cardgame.rondainiciada'){
          this.roundStarted = true;
          //Se supone que cuando inicia una nueva ronda hay que setear los datos de la nueva ronda.
          this.tiempo = event.tiempo;
          this.jugadoresRonda = event.ronda.jugadores.length;
          this.jugadoresTablero = event.tablero.jugadores.length;
          this.numeroRonda = event.ronda.numero;
        }

        if(event.type === 'cardgame.rondaterminada'){
          this.roundStarted = false;
          //window.location.reload();
        }

        if(event.type === 'cardgame.juegofinalizado'){
          //ALERTA
          if(confirm("El ganador es " + event.alias)){
            this.router.navigate(['list'])
          }
        }

        if(event.type === 'cardgame.cartasasignadasajugador'){
          console.log(event)
          event.ganadorId.uuid === this.uid ? alert("Ganaste la ronda!") : alert("Perdiste la ronda :(");
        }

      })
    });
  }


  ngOnDestroy(): void {
    this.ws.close();
  }

  poner(cartaId: string) {
    this.api.ponerCarta({
      cartaId: cartaId,
      juegoId: this.juegoId,
      jugadorId: this.uid
    }).subscribe();
  }

  iniciarRonda(){
    this.api.iniciarRonda({
      juegoId: this.juegoId,
    }).subscribe();
  }

}
