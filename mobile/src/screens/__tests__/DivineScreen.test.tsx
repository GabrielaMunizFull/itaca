import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { DivineScreen } from '../DivineScreen';
import { useAppStore, DEITY_REPLIES } from '../../store/useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('DivineScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<DivineScreen />)).not.toThrow();
  });

  it('exibe os 6 contatos divinos', async () => {
    const { getByText } = await render(<DivineScreen />);

    expect(getByText('Atena')).toBeTruthy();
    expect(getByText('Hermes')).toBeTruthy();
    expect(getByText('Zeus')).toBeTruthy();
    expect(getByText('Poseidon')).toBeTruthy();
    expect(getByText('Circe')).toBeTruthy();
    expect(getByText('Calipso')).toBeTruthy();
  });

  it('tocar "Silenciar"/"Reativar" no Poseidon alterna o texto de status exibido', async () => {
    const { getByLabelText, getByText, queryByText } = await render(<DivineScreen />);

    expect(getByText('Ativo · extremamente irritado')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByLabelText('Silenciar Poseidon'));
    });

    expect(useAppStore.getState().poseidonMuted).toBe(true);
    expect(getByText('Silenciado · tempestades por sua conta e risco')).toBeTruthy();
    expect(queryByText('Ativo · extremamente irritado')).toBeNull();

    await act(async () => {
      fireEvent.press(getByLabelText('Reativar Poseidon'));
    });

    expect(useAppStore.getState().poseidonMuted).toBe(false);
    expect(getByText('Ativo · extremamente irritado')).toBeTruthy();
  });

  it('tocar "SOS AOS DEUSES" abre o modal com alguma resposta divina e adiciona ao histórico', async () => {
    const { getByLabelText, getByText, getAllByText } = await render(<DivineScreen />);

    expect(useAppStore.getState().sosLog.length).toBe(0);

    await act(async () => {
      fireEvent.press(getByLabelText('SOS aos deuses'));
    });

    expect(getByText('RESPOSTA DIVINA')).toBeTruthy();

    const log = useAppStore.getState().sosLog;
    expect(log.length).toBe(1);
    expect(DEITY_REPLIES).toContain(log[0].reply);
    // Aparece tanto no modal quanto no histórico de invocações (mesma
    // entrada recém-criada).
    expect(getAllByText(log[0].reply).length).toBeGreaterThanOrEqual(1);
  });
});
