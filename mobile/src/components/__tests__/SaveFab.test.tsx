import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { SaveFab } from '../SaveFab';

const TOAST_MESSAGE = 'Progresso salvo. Pena que sua vida não vem com esse recurso.';

describe('SaveFab', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('mostra o toast ao tocar no FAB e some depois de ~2800ms', async () => {
    const { getByLabelText, queryByText, queryByLabelText } = await render(<SaveFab bottomOffset={0} />);

    await act(async () => {
      fireEvent.press(getByLabelText('Salvar progresso'));
    });

    expect(queryByText(TOAST_MESSAGE)).toBeTruthy();
    expect(queryByLabelText(TOAST_MESSAGE)).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(2800);
    });

    expect(queryByLabelText(TOAST_MESSAGE)).toBeNull();
  });
});
