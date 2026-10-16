import type { ReactNode } from "react";

interface Props {
  id: string;
  etiqueta: string;
  obligatorio?: boolean;
  className?: string;
  children: ReactNode;
}

// Etiqueta + control de formulario reutilizable
export const Campo = ({ id, etiqueta, obligatorio = false, className = "col-12", children }: Props) => (
  <div className={className}>
    <label htmlFor={id} className="form-label">
      {etiqueta}
      {obligatorio && <span className="obligatorio">*</span>}
    </label>
    {children}
  </div>
);
