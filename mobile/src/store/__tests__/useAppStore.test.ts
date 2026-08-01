import { DEITY_REPLIES, useAppStore } from '../useAppStore';

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

  describe('pickCreature', () => {
    it('seta a criatura selecionada', () => {
      useAppStore.getState().pickCreature('cila');
      expect(useAppStore.getState().selectedCreature).toBe('cila');
      useAppStore.getState().pickCreature('polifemo');
      expect(useAppStore.getState().selectedCreature).toBe('polifemo');
    });
  });

  describe('addScanToHistory', () => {
    it('insere no início do histórico', () => {
      useAppStore.getState().addScanToHistory({ name: 'Polifemo', threat: 'ALTA', time: '12:00' });
      useAppStore.getState().addScanToHistory({ name: 'Cila', threat: 'CRÍTICA', time: '12:01' });
      const history = useAppStore.getState().scanHistory;
      expect(history[0].name).toBe('Cila');
      expect(history[1].name).toBe('Polifemo');
    });

    it('scanHistory nunca passa de 3 itens', () => {
      for (let i = 0; i < 5; i += 1) {
        useAppStore.getState().addScanToHistory({ name: 'Polifemo', threat: 'ALTA', time: '12:00' });
      }
      expect(useAppStore.getState().scanHistory.length).toBe(3);
    });

    it('cada item do scanHistory tem id único', () => {
      for (let i = 0; i < 3; i += 1) {
        useAppStore.getState().addScanToHistory({ name: 'Polifemo', threat: 'ALTA', time: '12:00' });
      }
      const ids = useAppStore.getState().scanHistory.map((entry) => entry.id);
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

  describe('sendSignal', () => {
    it('insere um novo post no topo com texto/reactions esperados', () => {
      const before = useAppStore.getState().posts;
      const lastDay = before[0].day;

      useAppStore.getState().sendSignal();

      const posts = useAppStore.getState().posts;
      expect(posts.length).toBe(before.length + 1);
      expect(posts[0].text).toBe(
        'Sinal manual: ainda vivo, ainda voltando. (enviado por vontade própria, raro)'
      );
      expect(posts[0].reactions).toEqual({ anchor: 0, shield: 0, question: 0 });
      expect(posts[0].day).toBeGreaterThan(lastDay);
      expect(posts[0].day).toBeLessThanOrEqual(lastDay + 5);
      expect(posts[0].likes).toBeGreaterThanOrEqual(40);
      expect(posts[0].likes).toBeLessThan(130);
    });

    it('cada post enviado tem id único', () => {
      useAppStore.getState().sendSignal();
      useAppStore.getState().sendSignal();
      const ids = useAppStore.getState().posts.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('addReaction', () => {
    it('incrementa a reação do post correto sem afetar os demais', () => {
      const target = useAppStore.getState().posts[1];
      const other = useAppStore.getState().posts[0];

      useAppStore.getState().addReaction(target.id, 'shield');

      const posts = useAppStore.getState().posts;
      const updatedTarget = posts.find((p) => p.id === target.id)!;
      const updatedOther = posts.find((p) => p.id === other.id)!;

      expect(updatedTarget.reactions.shield).toBe(target.reactions.shield + 1);
      expect(updatedOther.reactions).toEqual(other.reactions);
    });

    it('incrementa tipos diferentes de reação de forma independente', () => {
      const target = useAppStore.getState().posts[0];

      useAppStore.getState().addReaction(target.id, 'anchor');
      useAppStore.getState().addReaction(target.id, 'question');
      useAppStore.getState().addReaction(target.id, 'question');

      const updated = useAppStore.getState().posts.find((p) => p.id === target.id)!;
      expect(updated.reactions.anchor).toBe(target.reactions.anchor + 1);
      expect(updated.reactions.question).toBe(target.reactions.question + 2);
      expect(updated.reactions.shield).toBe(target.reactions.shield);
    });
  });

  describe('togglePoseidon', () => {
    it('alterna poseidonMuted', () => {
      const before = useAppStore.getState().poseidonMuted;
      useAppStore.getState().togglePoseidon();
      expect(useAppStore.getState().poseidonMuted).toBe(!before);
      useAppStore.getState().togglePoseidon();
      expect(useAppStore.getState().poseidonMuted).toBe(before);
    });
  });

  describe('openSOS', () => {
    it('retorna uma resposta dentro de DEITY_REPLIES e grava no sosLog', () => {
      const reply = useAppStore.getState().openSOS();

      expect(DEITY_REPLIES).toContain(reply);

      const log = useAppStore.getState().sosLog;
      expect(log.length).toBe(1);
      expect(log[0].reply).toBe(reply);
    });

    it('insere no início do sosLog', () => {
      useAppStore.getState().openSOS();
      useAppStore.getState().openSOS();
      expect(useAppStore.getState().sosLog.length).toBe(2);
    });

    it('sosLog nunca passa de 5 itens', () => {
      for (let i = 0; i < 8; i += 1) {
        useAppStore.getState().openSOS();
      }
      expect(useAppStore.getState().sosLog.length).toBe(5);
    });

    it('cada item do sosLog tem id único', () => {
      for (let i = 0; i < 5; i += 1) {
        useAppStore.getState().openSOS();
      }
      const ids = useAppStore.getState().sosLog.map((entry) => entry.id);
      expect(new Set(ids).size).toBe(ids.length);
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
