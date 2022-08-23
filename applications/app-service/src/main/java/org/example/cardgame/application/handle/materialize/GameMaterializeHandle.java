package org.example.cardgame.application.handle.materialize;

import co.com.sofka.domain.generic.DomainEvent;

import org.example.cardgame.domain.events.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.EnableAsync;

import java.time.Instant;
import java.util.HashMap;

@EnableAsync
@Configuration
public class GameMaterializeHandle {
    private static final String COLLECTION_VIEW = "gameview";

    private final ReactiveMongoTemplate template;

    public GameMaterializeHandle(ReactiveMongoTemplate template) {
        this.template = template;
    }


    @EventListener
    public void handleJuegoCreado(JuegoCreado event) {
        var data = new HashMap<>();
        data.put("_id", event.aggregateRootId());
        data.put("fecha", Instant.now());
        data.put("uid", event.getJugadorPrincipal().value());
        data.put("iniciado", false);
        data.put("finalizado", false);
        data.put("cantidadJugadores", 0);
        data.put("jugadores", new HashMap<>());
        template.save(data, COLLECTION_VIEW).block();
    }


    @EventListener
    public void handleJugadorAgregado(JugadorAgregado event) {
        var data = new Update();
        data.set("fecha", Instant.now());
        data.set("jugadores."+event.getJugadorId().value()+".alias", event.getAlias());
        data.set("jugadores."+event.getJugadorId().value()+".jugadorId", event.getJugadorId().value());
        data.inc("cantidadJugadores");
        template.updateFirst(getFilterByAggregateId(event), data, COLLECTION_VIEW).block();
    }

    //TODO: handle tablero creado
    @EventListener
    public void handleTableroCreado(TableroCreado event) {
        var data = new HashMap<>();
        data.put("_id", event.getTableroId());
        data.put("jugadores", event.getJugadorIds());
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle Carta Puesta En Tablero
    @EventListener
    public void handleCartaPuestaEnTablero(CartaPuestaEnTablero event) {
        var data = new HashMap<>();
        data.put("_tablero_id", event.getTableroId());
        data.put("_jugador_id", event.getJugadorId());
        data.put("_carta", event.getCarta());
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle para crear ronda
    @EventListener
    public void handleRondaCreada(RondaCreada event) {
        var data = new HashMap<>();
        data.put("ronda", event.getRonda());
        data.put("tiempo", event.getTiempo());
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle tiempo cambiado del tablero
    @EventListener
    public void handleTiempoCambiadoDelTablero(TiempoCambiadoDelTablero event){
        var data = new Update();
        data.set("_id", event.getTableroId());
        data.set("tiempo", event.getTiempo());
        template.updateFirst(getFilterByAggregateId(event), data, COLLECTION_VIEW).block();
    }

    //TODO: handle para terminar la ronda
    @EventListener
    public void handleRondaTerminada(RondaTerminada event){
        var data = new HashMap<>();
        data.put("_id", event.getTableroId());
        data.put("jugadores", event.getJugadorIds());
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle para iniciar la ronda
    @EventListener
    public void handleRondaIniciada(RondaIniciada event){
        var data = new HashMap<>();
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle para finalizar evento
    @EventListener
    public void handleJuegoFinalizado(JuegoFinalizado event){
        var data = new HashMap<>();
        data.put("_id", event.getJugadorId());
        data.put("alias", event.getAlias());
        template.save(data, COLLECTION_VIEW).block();
    }


    private Query getFilterByAggregateId(DomainEvent event) {
        return new Query(
                Criteria.where("_id").is(event.aggregateRootId())
        );
    }
}
