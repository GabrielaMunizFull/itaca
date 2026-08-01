import React from 'react';
import { act, render } from '@testing-library/react-native';
import { SplashScreen } from '../SplashScreen';

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renderiza sem lançar erro', () => {
    expect(() => render(<SplashScreen onFinish={() => {}} />)).not.toThrow();
  });

  it('chama onFinish automaticamente após 3000ms', async () => {
    const onFinish = jest.fn();
    render(<SplashScreen onFinish={onFinish} />);

    expect(onFinish).not.toHaveBeenCalled();

    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
