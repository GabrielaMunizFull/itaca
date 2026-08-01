import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { useAppStore } from '../../store/useAppStore';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('HomeScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<HomeScreen />)).not.toThrow();
  });

  it('abre o dropdown de notificações ao tocar no sino', async () => {
    const { getByLabelText, getByText } = await render(<HomeScreen />);

    await act(async () => {
      fireEvent.press(getByLabelText('Notificações, 3 novas'));
    });

    expect(getByText('Nova zona de perigo detectada a 40m da rota.')).toBeTruthy();
  });

  it('esconde o badge de contagem depois da primeira abertura do dropdown', async () => {
    const { getByLabelText, queryByText } = await render(<HomeScreen />);

    expect(queryByText('3', { includeHiddenElements: true })).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByLabelText('Notificações, 3 novas'));
    });

    expect(queryByText('3', { includeHiddenElements: true })).toBeNull();
  });
});
