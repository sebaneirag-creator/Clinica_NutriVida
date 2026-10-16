export function cargar<T>(clave: string, porDefecto: T): T {
  try {
    const datos = localStorage.getItem(clave);
    return datos === null ? porDefecto : (JSON.parse(datos) as T);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave: string, valor: unknown): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function borrar(clave: string): void {
  localStorage.removeItem(clave);
}
