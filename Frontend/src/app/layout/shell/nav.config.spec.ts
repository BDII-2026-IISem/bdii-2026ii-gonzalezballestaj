import { visibleNav } from './nav.config';

describe('menú filtrado', () => {
  it('con todos los permisos muestra las diez entradas', () => {
    expect(visibleNav(() => true).flatMap((group) => group.items)).toHaveLength(10);
  });

  it('sin concesiones solo queda Mi sesión y desaparecen los grupos vacíos', () => {
    const groups = visibleNav(() => false);
    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((item) => item.label)).toEqual(['Mi sesión']);
  });
});
