import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { PenelopeScreen } from '../PenelopeScreen';
import { useAppStore } from '../../store/useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('PenelopeScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<PenelopeScreen />)).not.toThrow();
  });

  it('exibe o post fixado de Penélope e os posts iniciais', async () => {
    const { getByText } = await render(<PenelopeScreen />);

    expect(getByText('PENÉLOPE — FIXADO')).toBeTruthy();
    expect(getByText('Ainda vivo. Ainda voltando. Tudo sob controle.')).toBeTruthy();
  });

  it('tocar "Enviar sinal de vida agora" adiciona um post no topo da lista', async () => {
    const { getByLabelText, getByText } = await render(<PenelopeScreen />);

    const postsBefore = useAppStore.getState().posts.length;

    await act(async () => {
      fireEvent.press(getByLabelText('Enviar sinal de vida agora'));
    });

    const posts = useAppStore.getState().posts;
    expect(posts.length).toBe(postsBefore + 1);
    expect(posts[0].text).toBe(
      'Sinal manual: ainda vivo, ainda voltando. (enviado por vontade própria, raro)'
    );
    expect(
      getByText('Sinal manual: ainda vivo, ainda voltando. (enviado por vontade própria, raro)')
    ).toBeTruthy();
  });

  it('tocar num ícone de reação incrementa o contador exibido', async () => {
    const { getByLabelText } = await render(<PenelopeScreen />);

    // Post do dia 1 começa com anchor: 34.
    expect(getByLabelText('Reagir com âncora, 34')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByLabelText('Reagir com âncora, 34'));
    });

    expect(getByLabelText('Reagir com âncora, 35')).toBeTruthy();
    expect(useAppStore.getState().posts[0].reactions.anchor).toBe(35);
  });
});
