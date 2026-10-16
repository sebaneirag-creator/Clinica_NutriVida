import type { Rol } from "../../types/Usuario";
import { CLASE_ROL, ETIQUETA_ROL } from "../../utils/roles";

export const BadgeRol = ({ rol, className = "" }: { rol: Rol; className?: string }) => (
  <span className={`badge ${CLASE_ROL[rol]} rounded-pill ${className}`}>{ETIQUETA_ROL[rol]}</span>
);
