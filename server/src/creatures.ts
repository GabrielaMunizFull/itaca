/**
 * Criaturas mitológicas — Ítaca App (backend)
 *
 * Espelha 1:1 o array `CREATURES` de `mobile/src/screens/CyclopsScreen.tsx`.
 * Mantido em sincronia manualmente — qualquer alteração lá deve ser
 * replicada aqui (e vice-versa).
 */

export interface Creature {
  id: string;
  name: string;
  type: string;
  threat: string;
  note: string;
}

export const CREATURES: Creature[] = [
  {
    id: 'polifemo',
    name: 'Polifemo',
    type: 'Ciclope',
    threat: 'ALTA',
    note: 'Recomenda-se apresentar-se como "Ninguém". Funciona surpreendentemente bem.',
  },
  {
    id: 'cila',
    name: 'Cila',
    type: 'Fera Hexacéfala',
    threat: 'CRÍTICA',
    note: 'Perder 6 tripulantes é o preço de tabela. Não negocie.',
  },
  {
    id: 'caribdis',
    name: 'Caríbdis',
    type: 'Redemoinho Vivo',
    threat: 'CRÍTICA',
    note: 'Mantenha distância de 1 légua marítima. Não tente nadar "só um pouco mais perto".',
  },
  {
    id: 'lestrigoes',
    name: 'Lestrigões',
    type: 'Gigante Canibal',
    threat: 'ALTA',
    note: 'Eles atiram rochedos em navios. Considere um porto de entrada menos... convidativo.',
  },
  {
    id: 'circe',
    name: 'Circe',
    type: 'Feiticeira',
    threat: 'MÉDIA',
    note: 'Risco de transformação suína. Traga moly (vende-se separadamente).',
  },
];
