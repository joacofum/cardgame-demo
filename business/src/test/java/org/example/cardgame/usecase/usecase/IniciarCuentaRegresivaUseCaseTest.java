package org.example.cardgame.usecase.usecase;

import org.example.cardgame.usecase.gateway.JuegoDomainEventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class IniciarCuentaRegresivaUseCaseTest {
    @InjectMocks
    private IniciarCuentaRegresivaUseCase useCase;

    @Mock
    private JuegoDomainEventRepository repository;

    @Test
    void iniciarCuentaRegresiva(){
        //ASSERT

    }
}