import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { JuegoModel } from 'src/app/shared/model/juego';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

//TODO: componente para el listado de mis juegos
@Component({
  selector: 'app-list-game',
  templateUrl: './list-game.component.html',
  styleUrls: ['./list-game.component.scss'],
})
export class ListGameComponent implements OnInit {
  misJuegos?: JuegoModel[];
  uid: string = JSON.parse(localStorage.getItem('user')!).uid;

  constructor(
    private api: ApiService,
    private router: Router,
    private socket: WebsocketService
  ) {
    this.api.getMisJuegos(this.uid).subscribe((juegos: any) => {
      this.misJuegos = juegos;
    });
  }

  ngOnInit(): void {}

  iniciarJuego(juegoId: string) {
    this.socket.open(juegoId);
    this.socket.subscribe((event) => {
      console.log(event);
      if (event.type == 'cardgame.tablerocreado') {
        this.router.navigate(['board']);
      }
    });

    this.api.iniciarJuego({juegoId}).subscribe()
  }
}
