import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import { JuegoModel } from 'src/app/shared/model/juego';
import { WebsocketService } from 'src/app/shared/services/websocket.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/componets/dialog/dialog.component';

@Component({
  selector: 'app-list-game',
  templateUrl: './list-game.component.html',
  styleUrls: ['./list-game.component.scss'],
})
export class ListGameComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'cantidad', 'iniciado', 'accion', 'eliminar'];
  dataSource: JuegoModel[] = [];

  constructor(
    public api: ApiService,
    public authService: AuthService,
    public ws: WebsocketService,
    public router: Router,
    public dialog: MatDialog) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, id: string): void {
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        titulo: "Eliminar juego",
        contenido: `¿Está seguro de que desea eliminar el juego?`,
        contexto: "Eliminar",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "eliminar")
        this.eliminarJuego(id)
    });
  }

  ngOnDestroy(): void {
    this.ws.close();
  }

  ngOnInit(): void {
    this.api.getMisJuegos(this.authService.user.uid).subscribe((elements) => {
      this.dataSource = elements.filter(el => !el.finalizado)
    });
  }

  entrar(id: string) {
    this.router.navigate(['board', id]);
  }

  iniciar(id: string) {
    this.ws.connect(id);
    this.ws.subscribe((event) => {
      console.log(event);
      if (event.type == 'cardgame.tablerocreado') {
        this.api.crearRonda({
          juegoId: id,
          tiempo: 10,
          jugadores: event.jugadorIds.map((it: any) => it.uuid)
        }).subscribe();
      }
      if (event.type == 'cardgame.rondacreada') {
         this.router.navigate(['board', id]);
        }
      });
      this.api.iniciarJuego({ juegoId: id }).subscribe();
    }

    eliminarJuego(id: string){
      this.ws.connect(id);
      this.ws.subscribe((event) => {
        console.log(event);
        if (event.type == 'cardgame.juegoeliminado') {
            this.dataSource = this.dataSource.filter((juego) => juego.id !== event.aggregateRootId);
        }

      });
      this.api.eliminar({ juegoId: id }).subscribe();
    }

}
