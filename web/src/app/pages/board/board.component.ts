import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

//TODO: componente para el tablero de juego
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  tiles: Tile[] = [
    {text: 'Número de jugadores, Tiempo de ronda, Botón de iniciar', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Mazo con cartas', cols: 1, rows: 10, color: 'lightgreen'},
    {text: 'Partida', cols: 3, rows: 9, color: 'lightpink'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
