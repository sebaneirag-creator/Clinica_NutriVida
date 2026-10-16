export const regiones: { valor: string; nombre: string }[] = [
  { valor: "Arica", nombre: "Arica y Parinacota" },
  { valor: "Tarapaca", nombre: "Tarapacá" },
  { valor: "Antofagasta", nombre: "Antofagasta" },
  { valor: "Atacama", nombre: "Atacama" },
  { valor: "Coquimbo", nombre: "Coquimbo" },
  { valor: "Valparaiso", nombre: "Valparaíso" },
  { valor: "Metropolitana", nombre: "Metropolitana de Santiago" },
  { valor: "O'Higgins", nombre: "Libertador General Bernardo O'Higgins" },
  { valor: "Maule", nombre: "Maule" },
  { valor: "Nuble", nombre: "Ñuble" },
  { valor: "Biobio", nombre: "Biobío" },
  { valor: "Araucania", nombre: "La Araucanía" },
  { valor: "Rios", nombre: "Los Ríos" },
  { valor: "Lagos", nombre: "Los Lagos" },
  { valor: "Aysen", nombre: "Aysén del General Carlos Ibáñez del Campo" },
  { valor: "Magallanes", nombre: "Magallanes y de la Antártica Chilena" },
];

export const nombreRegion = (valor: string): string =>
  regiones.find((r) => r.valor === valor)?.nombre ?? valor;
