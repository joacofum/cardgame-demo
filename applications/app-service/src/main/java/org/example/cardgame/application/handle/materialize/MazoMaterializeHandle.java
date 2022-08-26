package org.example.cardgame.application.handle.materialize;

import co.com.sofka.domain.generic.DomainEvent;
import org.bson.Document;
import org.example.cardgame.domain.events.CartaQuitadaDelMazo;
import org.example.cardgame.domain.events.CartasAsignadasAJugador;
import org.example.cardgame.domain.events.JugadorAgregado;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@EnableAsync
@Configuration
public class MazoMaterializeHandle {
    private static final String COLLECTION_VIEW = "mazoview";

    private final ReactiveMongoTemplate template;

    public MazoMaterializeHandle(ReactiveMongoTemplate template) {
        this.template = template;
    }

    //TODO: handle Jugador Agregado
    /*@EventListener
    public void handleJugadorAgregado(JugadorAgregado event) {
        var data = new HashMap<>();
        data.put("fecha", Instant.now());
        data.put("jugadores."+event.getJugadorId().value()+".alias", event.getAlias());
        data.put("jugadores."+event.getJugadorId().value()+".jugadorId", event.getJugadorId().value());
        template.save(data, COLLECTION_VIEW).block();
    }*/

    //TODO: handle Carta Quitada Del Mazo
    @EventListener
    public void handleCartaQuitadaDelMazo(CartaQuitadaDelMazo event){
        var data = new HashMap<>();
        data.put("uid", event.getJugadorId());
        data.put("carta", event.getCarta());
        template.save(data, COLLECTION_VIEW).block();
    }

    //TODO: handle Cartas Asignadas A Jugador
    @EventListener
    public void handleCartasAsignadasAJugador(CartasAsignadasAJugador event){
        var data = new HashMap<>();
        data.put("uid", event.getGanadorId());
        data.put("puntos", event.getPuntos());
        data.put("cartas", event.getCartasApuesta());
        template.save(data, COLLECTION_VIEW).block();
    }

    private Query getFilterByAggregateId(DomainEvent event) {
        return new Query(
                Criteria.where("_id").is(event.aggregateRootId())
        );
    }

}
