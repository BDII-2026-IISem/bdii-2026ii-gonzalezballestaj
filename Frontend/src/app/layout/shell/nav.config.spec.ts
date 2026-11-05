import { visibleNav } from './nav.config';

describe('menú filtrado', () => {
  it('con todos los permisos muestra las quince entradas', () => {
    expect(visibleNav(() => true).flatMap((group) => group.items)).toHaveLength(15);
  });

  it('sin concesiones solo queda Mi sesión y desaparecen los grupos vacíos', () => {
    const groups = visibleNav(() => false);
    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((item) => item.label)).toEqual(['Mi sesión']);
  });

  it('sin GET /api/resource-roles no aparece Concesiones', () => {
    const labels = visibleNav((permission) => permission !== 'GET /api/resource-roles')
      .flatMap((group) => group.items)
      .map((item) => item.label);

    expect(labels).not.toContain('Concesiones');
    expect(labels).toContain('Usuarios');
  });
});

