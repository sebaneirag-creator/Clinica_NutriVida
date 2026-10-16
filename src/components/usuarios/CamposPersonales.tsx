import type { ChangeEvent } from "react";
import { regiones } from "../../data/regiones";
import type { DatosPersonales } from "../../types/Usuario";
import { Campo } from "../ui/Campo";

interface Props {
  datos: DatosPersonales;
  onCambio: (campo: keyof DatosPersonales, valor: string) => void;
  /** Evita ids repetidos si hay varios formularios en pantalla. */
  prefijo?: string;
}

// Campos personales compartidos por registro, perfil y administración de usuarios.
// Devuelve columnas: el formulario que lo use aporta el <div className="row g-3">.
export const CamposPersonales = ({ datos, onCambio, prefijo = "" }: Props) => {
  const cambiar = (campo: keyof DatosPersonales) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onCambio(campo, e.target.value);
  const id = (campo: string) => `${prefijo}${campo}`;
  const hoy = new Date().toISOString().split("T")[0];

  return (
    <>
      <Campo id={id("nombre")} etiqueta="Nombre" obligatorio className="col-md-6">
        <input id={id("nombre")} type="text" className="form-control" value={datos.nombre} onChange={cambiar("nombre")} />
      </Campo>
      <Campo id={id("apellido")} etiqueta="Apellido" obligatorio className="col-md-6">
        <input id={id("apellido")} type="text" className="form-control" value={datos.apellido} onChange={cambiar("apellido")} />
      </Campo>
      <Campo id={id("correo")} etiqueta="Correo electrónico" obligatorio>
        <input id={id("correo")} type="email" className="form-control" placeholder="correo@duocuc.cl" value={datos.correo} onChange={cambiar("correo")} />
      </Campo>
      <Campo id={id("fechaNacimiento")} etiqueta="Fecha de nacimiento" obligatorio className="col-md-6">
        <input id={id("fechaNacimiento")} type="date" className="form-control" max={hoy} value={datos.fechaNacimiento} onChange={cambiar("fechaNacimiento")} />
      </Campo>
      <Campo id={id("genero")} etiqueta="Género" obligatorio className="col-md-6">
        <select id={id("genero")} className="form-select" value={datos.genero} onChange={cambiar("genero")}>
          <option value="" disabled>Seleccione</option>
          <option value="Mujer">Mujer</option>
          <option value="Hombre">Hombre</option>
          <option value="Otro">Otro</option>
          <option value="NoDice">Prefiero no decir</option>
        </select>
      </Campo>
      <Campo id={id("region")} etiqueta="Región" obligatorio className="col-md-6">
        <select id={id("region")} className="form-select" value={datos.region} onChange={cambiar("region")}>
          <option value="" disabled>Seleccione</option>
          {regiones.map((r) => (
            <option key={r.valor} value={r.valor}>{r.nombre}</option>
          ))}
        </select>
      </Campo>
      <Campo id={id("direccion")} etiqueta="Dirección" obligatorio className="col-md-6">
        <input id={id("direccion")} type="text" className="form-control" placeholder="Calle y número" value={datos.direccion} onChange={cambiar("direccion")} />
      </Campo>
    </>
  );
};
