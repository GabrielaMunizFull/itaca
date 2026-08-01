import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingScreen } from '../OnboardingScreen';
import { useAppStore } from '../../store/useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('OnboardingScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<OnboardingScreen />)).not.toThrow();
  });
});
