package org.example.cardgame.domain.values;

import co.com.sofka.domain.generic.ValueObject;

import java.util.HashSet;
import java.util.Set;

/**
 * The type Mazo.
 */
public class Mazo implements ValueObject<Mazo.Props> {

    private final Set<Carta> catas;
    private final Integer cantidad;

    /**
     * Instantiates a new Mazo.
     *
     * @param catas the catas
     */
    public Mazo(Set<Carta> catas) {
        this.catas = catas;
        this.cantidad = catas.size();
    }

    @Override
    public Props value() {
        return new Props() {
            @Override
            public Set<Carta> cartas() {
                return catas;
            }

            @Override
            public Integer cantidad() {
                return cantidad;
            }
        };
    }

    /**
     * Nueva carta mazo.
     *
     * @param carta the carta
     * @return the mazo
     */
    public Mazo nuevaCarta(Carta carta) {
        var catas = new HashSet<>(this.catas);
        catas.add(carta);
        return new Mazo(catas);
    }

    /**
     * Retirar carta mazo.
     *
     * @param cartaRetirada the carta retirada
     * @return the mazo
     */
    public Mazo retirarCarta(Carta cartaRetirada) {
        Set<Carta> cartaSet = new HashSet<>(catas);
        var cartaId = cartaRetirada.value().cartaId().value();
        cartaSet.removeIf(
                carta -> cartaId.equals(carta.value().cartaId().value())
        );
        return new Mazo(cartaSet);
    }

    /**
     * The interface Props.
     */
    public interface Props {
        /**
         * Cartas set.
         *
         * @return the set
         */
        Set<Carta> cartas();

        /**
         * Cantidad integer.
         *
         * @return the integer
         */
        Integer cantidad();
    }
}
