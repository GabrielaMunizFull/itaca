import React from 'react';
import { render } from '@testing-library/react-native';
import { SirenScreen } from '../SirenScreen';
import { useAppStore } from '../../store/useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('SirenScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<SirenScreen />)).not.toThrow();
  });
});
