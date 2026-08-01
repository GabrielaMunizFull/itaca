import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { CyclopsScreen } from '../CyclopsScreen';
import { useAppStore } from '../../store/useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('CyclopsScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<CyclopsScreen />)).not.toThrow();
  });

  it('troca de chip e atualiza a criatura exibida no badge de confiança', async () => {
    const { getByLabelText, getByText } = await render(<CyclopsScreen />);

    // Polifemo é o alvo inicial (98% confiança).
    expect(getByText('98% confiança')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByLabelText('Cila'));
    });

    expect(getByText('87% confiança')).toBeTruthy();
    expect(useAppStore.getState().selectedCreature).toBe('cila');
  });

  it('escaneia, exibe o resultado da criatura selecionada e grava no histórico', async () => {
    jest.useFakeTimers();

    const { getByLabelText, getByText } = await render(<CyclopsScreen />);

    await act(async () => {
      fireEvent.press(getByLabelText('Caríbdis'));
    });
    await act(async () => {
      fireEvent.press(getByLabelText('Escanear criatura'));
    });

    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    expect(getByText('AMEAÇA CRÍTICA')).toBeTruthy();
    expect(useAppStore.getState().scanHistory[0].name).toBe('Caríbdis');

    jest.useRealTimers();
  });

  it('ignora troca de chip durante um scan em andamento', async () => {
    jest.useFakeTimers();

    const { getByLabelText } = await render(<CyclopsScreen />);

    await act(async () => {
      fireEvent.press(getByLabelText('Escanear criatura'));
    });

    // Tenta trocar de alvo enquanto ainda está escaneando Polifemo.
    await act(async () => {
      fireEvent.press(getByLabelText('Cila'));
    });

    expect(useAppStore.getState().selectedCreature).toBe('polifemo');

    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    expect(useAppStore.getState().scanHistory[0].name).toBe('Polifemo');

    jest.useRealTimers();
  });
});
