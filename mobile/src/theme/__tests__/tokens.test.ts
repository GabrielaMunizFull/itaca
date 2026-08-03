import { colors, darkColors } from '../tokens';

describe('darkColors', () => {
  it('background é um hex válido e diferente da paleta clara', () => {
    expect(darkColors.background).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darkColors.background).not.toBe(colors.background);
  });

  it('status.online é um hex válido e diferente da paleta clara', () => {
    expect(darkColors.status.online).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darkColors.status.online).not.toBe(colors.status.online);
  });
});
