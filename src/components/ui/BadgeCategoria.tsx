import { getBadgeClass, getTipoIcon } from "../../utils/formato";

export const BadgeCategoria = ({ categoria, className = "" }: { categoria: string; className?: string }) => (
  <span className={`badge ${getBadgeClass(categoria)} rounded-pill ${className}`}>
    <i className={`bi ${getTipoIcon(categoria)} me-1`}></i>
    {categoria}
  </span>
);
