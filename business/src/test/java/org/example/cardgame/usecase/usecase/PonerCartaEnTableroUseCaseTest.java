package org.example.cardgame.usecase.usecase;

import co.com.sofka.domain.generic.DomainEvent;
import org.example.cardgame.domain.command.PonerCartaEnTablero;
import org.example.cardgame.domain.events.CartaPuestaEnTablero;
import org.example.cardgame.domain.events.CartaQuitadaDelMazo;
import org.example.cardgame.domain.events.RondaIniciada;
import org.example.cardgame.domain.events.TableroCreado;
import org.example.cardgame.domain.values.JugadorId;
import org.example.cardgame.domain.values.TableroId;
import org.example.cardgame.usecase.gateway.JuegoDomainEventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.Set;

import static org.mockito.Mockito.when;

//TODO: hacer prueba
@ExtendWith(MockitoExtension.class)
class PonerCartaEnTableroUseCaseTest {
    @InjectMocks
    private PonerCartaEnTableroUseCase useCase;

    @Mock
    private JuegoDomainEventRepository repository;

    @Test
    void ponerCartaEnTablero(){
        //ARRANGE
        var command = new PonerCartaEnTablero();
        command.setJuegoId("XXXX");
        command.setJugadorId("MESSI");
        command.setCartaId("CARTAÑERY");

        when(repository.obtenerEventosPor("XXXX")).thenReturn(matenmeporfavor());

        //ACT & ASSERT
        StepVerifier
                .create(useCase.apply(Mono.just(command)))
                .expectNextMatches(domainEvent -> {
                    var event = (CartaPuestaEnTablero) domainEvent;
                    return event.aggregateRootId().equals("XXXX")
                            && event.getJugadorId().value().equals("MESSI")
                            && event.getCarta().value().cartaId().value().equals("CARTAÑERY")
                            && event.getTableroId().value().equals("TABLEROOO");
                }).expectNextMatches(domainEvent -> {
                    var event = (CartaQuitadaDelMazo) domainEvent;
                    return event.aggregateRootId().equals("XXXX")
                            && event.getJugadorId().value().equals("MESSI")
                            && event.getCarta().value().cartaId().value().equals("CARTAÑERY");
                })
                .expectComplete()
                .verify();
    }

    private Flux<DomainEvent> matenmeporfavor() {
        var event = new TableroCreado(TableroId.of("TABLEROOO"),
                Set.of(JugadorId.of("MESSI"),
                        JugadorId.of("GGGG"),
                        JugadorId.of("HHHH")
                ));
        event.setAggregateRootId("XXXX");
        return Flux.just(event);
    }
}