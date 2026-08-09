import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CyclopsScreen } from '../CyclopsScreen';
import { useAppStore } from '../../store/useAppStore';
import { scanCreatureFromPhoto } from '../../utils/api';

// Sobrescreve, só neste arquivo, o mock global de `expo-camera` (definido em
// `jest.setup.ts`) para simular uma câmera com `takePictureAsync`
// disponível via ref — necessário para exercitar o fluxo de detecção real
// (e seu fallback) no `handleScan`.
jest.mock('expo-camera', () => {
  const { forwardRef, useImperativeHandle } = require('react');
  const { View } = require('react-native');
  const CameraView = forwardRef((props: Record<string, unknown>, ref: unknown) => {
    useImperativeHandle(ref, () => ({
      takePictureAsync: jest.fn(async () => ({ base64: 'fake-base64' })),
    }));
    return <View {...props} />;
  });
  return {
    useCameraPermissions: () => [{ granted: true, canAskAgain: true }, jest.fn()],
    CameraView,
  };
});

// A detecção real (via backend) é sempre rejeitada nesta suíte — cobre o
// fallback para o fluxo mock quando `scanCreatureFromPhoto` falha (rede
// indisponível, backend fora do ar, etc).
jest.mock('../../utils/api', () => ({
  scanCreatureFromPhoto: jest.fn(),
}));

const mockedScanCreatureFromPhoto = scanCreatureFromPhoto as jest.MockedFunction<typeof scanCreatureFromPhoto>;

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
  mockedScanCreatureFromPhoto.mockReset();
  mockedScanCreatureFromPhoto.mockRejectedValue(new Error('Detecção real indisponível nos testes.'));
});

function renderScreen() {
  return render(
    <NavigationContainer>
      <CyclopsScreen />
    </NavigationContainer>
  );
}

describe('CyclopsScreen', () => {
  it('renderiza sem lançar erro', () => {
    expect(() => renderScreen()).not.toThrow();
  });

  it('troca de chip e atualiza a criatura exibida no badge de confiança', async () => {
    const { getByLabelText, getByText } = await renderScreen();

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

    const { getByLabelText, getByText } = await renderScreen();

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

    const { getByLabelText } = await renderScreen();

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

  it('cai no fluxo mock quando a detecção real falha (scanCreatureFromPhoto rejeita)', async () => {
    jest.useFakeTimers();

    const { getByLabelText, getByText } = await renderScreen();

    await act(async () => {
      fireEvent.press(getByLabelText('Escanear criatura'));
    });

    // A chamada real foi tentada e rejeitou — o app não trava nem lança erro
    // não tratado; ele apenas continua para o fluxo mock (com seu timer).
    expect(mockedScanCreatureFromPhoto).toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1300);
    });

    expect(getByText('AMEAÇA ALTA')).toBeTruthy();
    expect(useAppStore.getState().scanHistory[0].name).toBe('Polifemo');

    jest.useRealTimers();
  });

  it('usa o resultado da detecção real quando scanCreatureFromPhoto resolve com sucesso', async () => {
    mockedScanCreatureFromPhoto.mockReset();
    mockedScanCreatureFromPhoto.mockResolvedValue({
      creatureId: 'circe',
      reason: 'Detectamos vibrações de feitiçaria suína na sua selfie.',
    });

    const { getByLabelText, getByText } = await renderScreen();

    // Chip inicial selecionado é Polifemo — a API deve sobrepor essa escolha.
    await act(async () => {
      fireEvent.press(getByLabelText('Escanear criatura'));
    });

    expect(mockedScanCreatureFromPhoto).toHaveBeenCalled();
    expect(getByText('Detectamos vibrações de feitiçaria suína na sua selfie.')).toBeTruthy();
    expect(getByText('AMEAÇA MÉDIA')).toBeTruthy();
    expect(useAppStore.getState().selectedCreature).toBe('circe');
    expect(useAppStore.getState().scanHistory[0].name).toBe('Circe');
  });

  it('protege contra creatureId desconhecido vindo da API mantendo a criatura selecionada como fallback', async () => {
    mockedScanCreatureFromPhoto.mockReset();
    mockedScanCreatureFromPhoto.mockResolvedValue({
      creatureId: 'inexistente',
      reason: 'Algo bizarro foi detectado.',
    });

    const { getByLabelText, getByText } = await renderScreen();

    await act(async () => {
      fireEvent.press(getByLabelText('Escanear criatura'));
    });

    expect(mockedScanCreatureFromPhoto).toHaveBeenCalled();
    // `CREATURES.find(...) ?? creature` cai de volta pra criatura selecionada (Polifemo).
    expect(getByText('Algo bizarro foi detectado.')).toBeTruthy();
    expect(getByText('AMEAÇA ALTA')).toBeTruthy();
    expect(useAppStore.getState().selectedCreature).toBe('polifemo');
    expect(useAppStore.getState().scanHistory[0].name).toBe('Polifemo');
  });
});
