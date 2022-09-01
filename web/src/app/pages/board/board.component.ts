import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/componets/dialog/dialog.component';
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
  tableroHabilitado:boolean = false;

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public ws: WebsocketService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ){}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, alias: string): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titulo: "Juego finalizado",
        contenido: "El ganador es " + alias,
        contexto: "Ganador"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ganador")
        this.router.navigate(['home'])
    });
  }

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

        if(event.type === 'cardgame.rondacreada'){
          this.tiempo = event.tiempo;
          this.jugadoresRonda = event.ronda.jugadores.length;
          this.numeroRonda = event.ronda.numero;
        }

        if(event.type === 'cardgame.rondainiciada'){
          this.tableroHabilitado = true;
          this.roundStarted = true;
        }

        if(event.type === 'cardgame.rondaterminada'){
          this.roundStarted = false;
          //Las cartas a 0.
          this.cartasDelTablero = [];

          //Apostar cartas solo cuando inicie la ronda
          this.tableroHabilitado = false;
        }

        if(event.type === 'cardgame.juegofinalizado'){
          //ALERTA
          this.openDialog('0ms', '0ms', event.alias);
        }

        if(event.type === 'cardgame.cartasasignadasajugador'){
          if(event.ganadorId.uuid === this.uid){
            event.cartasApuesta.forEach((carta: any) => {
              this.cartasDelJugador.push({
                cartaId: carta.cartaId.uuid,
                poder: carta.poder,
                estaOculta: carta.estaOculta,
                estaHabilitada: carta.estaHabilitada
              });
            });
            alert("Ganaste la ronda!")
          }else{
            alert("Perdiste la ronda :(")
          }
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
