package org.example.cardgame.domain.events;

import co.com.sofka.domain.generic.DomainEvent;

public class JuegoIniciado extends DomainEvent {

    public JuegoIniciado() {
        super("cardgame.juegoiniciado");
    }
}
