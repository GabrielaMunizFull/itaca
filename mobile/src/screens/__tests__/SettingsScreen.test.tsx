import React from 'react';
import { render } from '@testing-library/react-native';
import { SettingsScreen } from '../SettingsScreen';
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

describe('SettingsScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => render(<SettingsScreen />)).not.toThrow();
  });
});
