# Clinica_NutriVida

* Tres roles de usuario, cliente, vendedor, y administrador
* El panel de administrador solo accesible para administradores y vendedores (acceso restringido si otro usuario intenta ingresar)
* Este panel tiene distintos permisos para administradores o vendedores
* El perfil del usuario se puede editar por el mismo usuario
* Al intentar ingresar con un correo no registrado, ya no lo bloqueará como pasaba anteriormente
* Los intentos fallidos a cuentas de administrador bloquean el acceso por 5 minutos
* La lista de categorías en los filtros se actualiza dinámicamente, al crear o actualizar el nombre de una categoria
* Validaciones como los codigos de los servicios deben ser únicos o que cambiar el nombre de una categoria la actualiza de todos los servicios

Cuentas para testnpm
Rol	            Correo	                Contraseña
Administrador	admin@duocuc.cl	        Admin123
Vendedor	    vendedor@duocuc.cl	    Vendedor123
Cliente	        cliente@duocuc.cl	    Cliente123