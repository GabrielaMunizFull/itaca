import { useAppStore } from '../useAppStore';

const initialState = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState(initialState, true);
});

describe('useAppStore', () => {
  it('toggleMast alterna corretamente', () => {
    const before = useAppStore.getState().mastTied;
    useAppStore.getState().toggleMast();
    expect(useAppStore.getState().mastTied).toBe(!before);
    useAppStore.getState().toggleMast();
    expect(useAppStore.getState().mastTied).toBe(before);
  });

  it('toggleEarplugs alterna corretamente', () => {
    const before = useAppStore.getState().earplugs;
    useAppStore.getState().toggleEarplugs();
    expect(useAppStore.getState().earplugs).toBe(!before);
    useAppStore.getState().toggleEarplugs();
    expect(useAppStore.getState().earplugs).toBe(before);
  });

  describe('registerSiren', () => {
    it('incrementa sirenCount', () => {
      const before = useAppStore.getState().sirenCount;
      useAppStore.getState().registerSiren();
      expect(useAppStore.getState().sirenCount).toBe(before + 1);
    });

    it('sirenLog nunca passa de 5 itens', () => {
      for (let i = 0; i < 8; i += 1) {
        useAppStore.getState().registerSiren();
      }
      expect(useAppStore.getState().sirenLog.length).toBe(5);
    });

    it('cada item do sirenLog tem id único', () => {
      for (let i = 0; i < 5; i += 1) {
        useAppStore.getState().registerSiren();
      }
      const ids = useAppStore.getState().sirenLog.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('completeOnboarding', () => {
    it('marca onboarded e salva nome/navio/arquétipo', () => {
      useAppStore.getState().completeOnboarding('Aquiles', 'Pequod', 'arqueiro');
      const state = useAppStore.getState();
      expect(state.onboarded).toBe(true);
      expect(state.heroName).toBe('Aquiles');
      expect(state.shipName).toBe('Pequod');
      expect(state.archetype).toBe('arqueiro');
    });

    it('nome/navio com só espaços cai no fallback padrão', () => {
      useAppStore.getState().completeOnboarding('   ', '   ', 'guerreiro');
      const state = useAppStore.getState();
      expect(state.heroName).toBe('Odisseu');
      expect(state.shipName).toBe('Argo II');
    });
  });

  describe('saveSettings', () => {
    it('atualiza nome/navio', () => {
      useAppStore.getState().saveSettings('Penélope', 'Ítaca I');
      const state = useAppStore.getState();
      expect(state.heroName).toBe('Penélope');
      expect(state.shipName).toBe('Ítaca I');
    });

    it('nome/navio com só espaços cai no fallback padrão ("Odisseu"/"Argo II")', () => {
      useAppStore.getState().saveSettings('   ', '   ');
      const state = useAppStore.getState();
      expect(state.heroName).toBe('Odisseu');
      expect(state.shipName).toBe('Argo II');
    });
  });

  describe('hasHydrated', () => {
    it('fica true mesmo se onRehydrateStorage receber um erro simulado', () => {
      useAppStore.setState({ hasHydrated: false });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      const options = useAppStore.persist.getOptions();
      const rehydrateCallback = options.onRehydrateStorage?.(useAppStore.getState());
      rehydrateCallback?.(useAppStore.getState(), new Error('falha simulada de AsyncStorage'));

      expect(useAppStore.getState().hasHydrated).toBe(true);
      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});
