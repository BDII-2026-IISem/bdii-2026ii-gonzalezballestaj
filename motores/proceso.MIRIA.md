# Semana 1: Diseño e implementación de DB — Wayuu Travel

**Base: MySQL (Docker) → replicación posterior en PostgreSQL, SQL Server y Oracle**

## Objetivo

Diseñar e implementar progresivamente una base de datos relacional para **WayuuTravel**, una plataforma orientada a la comercialización de experiencias culturales y naturales con cupos limitados, salidas programadas y servicios proporcionados por aliados.

La implementación inicial se realizará en **MySQL**, ejecutado mediante **Docker** y administrado mediante **DBeaver**.

Posteriormente, el modelo será adaptado y replicado en:

- PostgreSQL

- Microsoft SQL Server

- Oracle

------------------------------------------------------------------------

## SPEC

| Código | Descripción | Aplicación |
|----|----|----|
| SPEC-01 | Construir una base de datos denominada wayuutravel. | Base de datos destinada a gestionar experiencias turísticas, paquetes, salidas programadas, proveedores, servicios incluidos, reservas, viajeros, pagos, vouchers y cancelaciones. |

------------------------------------------------------------------------

## Requerimientos

| Requerimiento | Requisitos | Estado para ActivaFit |
|----|----|----|
| REQ-SPEC1-01 | Identificar las entidades de Business. | `clients`, `packages`, `departures`, `suppliers`, `included_services`, `bookings`, `travelers`, `payments`, `vouchers`, `cancellations`. |
| REQ-SPEC1-02 | obligatoriedad y valores predeterminados. | Definidos en el diccionario de datos. |
| REQ-SPEC1-03 | Definir las llaves primarias y restricciones | id como PK en todas las tablas; UNIQUE en client.document_number; status/created_at/updated_at obligatorios en todas las tablas |
| REQ-SPEC1-04 | Definir relaciones y llaves foráneas entre entidades | Relaciones entre paquetes, salidas, proveedores, reservas, viajeros, pagos, vouchers y cancelaciones. |
| REQ-SPEC1-05 | Crear físicamente las tablas en MySQL y los otros motores | Implementación mediante Docker y administración mediante DBeaver. |

### REQ-SPEC1-03 — Llaves primarias y restricciones

| Tabla | Restricción |
|----|----|
| Todas las tablas | `id` como PK (auto_increment) |
| client | UNIQUE en `document_number` |
| Todas las tablas | `status`, `created_at` y `updated_at` obligatorios |
| suppliers | `nit` debe ser único mediante `UNIQUE`. |
| Entidades aplicables | `is_active`, `created_at` y `updated_at` obligatorios. |
| bookings | `status` obligatorio para controlar el estado de la reserva. |
| payments | `status` obligatorio para controlar el estado del pago. |
| departures | `available_capacity` no debe superar `capacity`. |

### REQ-SPEC1-04 — Relaciones y llaves foráneas

|                  |                   |                   |                  |
|------------------|-------------------|-------------------|------------------|
| **Tabla origen** | **Llave foránea** | **Tabla destino** | **Cardinalidad** |
| `departures`     | `package_id`      | `packages.id`     | **1**            |

|                     |                |               |         |
|---------------------|----------------|---------------|---------|
| `included_services` | `principal_id` | `packages.id` | **N:1** |

|                     |              |                |         |
|---------------------|--------------|----------------|---------|
| `included_services` | `related_id` | `suppliers.id` | **N:1** |

|            |             |              |         |
|------------|-------------|--------------|---------|
| `bookings` | `client_id` | `clients.id` | **N:1** |

|            |                |                 |         |
|------------|----------------|-----------------|---------|
| `bookings` | `departure_id` | `departures.id` | **N:1** |

|            |               |                |         |
|------------|---------------|----------------|---------|
| `bookings` | `traveler_id` | `travelers.id` | **N:1** |

|            |                |               |         |
|------------|----------------|---------------|---------|
| `payments` | `reference_id` | `bookings.id` | **N:1** |

|            |              |               |            |
|------------|--------------|---------------|------------|
| `vouchers` | `booking_id` | `bookings.id` | **1:0..1** |

|                 |              |               |            |
|-----------------|--------------|---------------|------------|
| `cancellations` | `booking_id` | `bookings.id` | **1:0..1** |

**Nota:** la relación entre `packages` y `suppliers` es de tipo **N** y se resuelve mediante la tabla `included_services`.

## Diccionario de datos

### 🟢 clients

**Descripción:** almacena la información de los clientes que realizan reservas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | INT | sí | PK, auto_increment | Identificador único del cliente. |
| document_type | VARCHAR(30) | sí | — | Tipo de documento de identidad (CC, CE, TI, etc.). |
| document_number | VARCHAR(30) | sí | UNIQUE | Número de documento del cliente, no se repite. |
| name | VARCHAR(150) | sí | — | Nombre completo del cliente. |
| phone | VARCHAR(30) | no | — | Teléfono de contacto. |
| email | VARCHAR(150) | no | UNIQUE | Correo electrónico de contacto. |
| status | ENUM | sí | \_\_\_ | Estado del cliente en el sistema (active/inactive). |
| created_at | DATETIME | sí | DEFAULT CURRENT_TIMESTAMP | Fecha de creación del registro. |
| updated_at | DATETIME | sí | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Fecha de la última modificación. |

### 🟢 packages

**Descripción:** almacena los paquetes o experiencias turísticas ofrecidas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int | sí | PK, auto_increment | Identificador único del entrenador. |
| name | varchar(150) | sí | — | Nombre completo del entrenador. |
| description | varchar(255) | no | — | Especialidad o notas sobre el entrenador. |
| status | enum | sí | \_\_\_ | Estado del entrenador (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### 🟢 departures

**Descripción:** almacena las salidas programadas asociadas a los paquetes turísticos.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int, PK, auto_increment | sí | — | Identificador único del ejercicio. |
| name | varchar(150) | sí | — | Nombre del ejercicio (ej. "Squat"). |
| description | varchar(255) | no | — | Explicación o técnica del ejercicio. |
| package_id | Int | si | FOREIGN KEY → packages.id | Paquete turístico asociado. |
| departure_date | datetime | si | — | Fecha y hora de inicio de la salida. |
| capacity | Int | si | — | Capacidad máxima de la salida. |
| available_capacity | Int | si | — | Cantidad de cupos disponibles. |
| is_active | Enun | si | DEFAULT TRUE | Indica si la salida está activa. |
| status | enum | sí | \_\_\_ | Estado del ejercicio en el catálogo (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### 🟡 suppliers

**Descripción:** almacena la información de los proveedores o aliados turísticos

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int, PK, auto_increment | sí | — | Identificador único de la membresía. |
| nit | varchar(100) | sí | — | Nombre de la membresía otorgada. |
| razon_social | varchar(255) | si | — | Detalle o condiciones de la membresía. |
| phone | VARCHAR(30) | no | \_\_\_ | Nombre o información de contacto |
| email | VARCHAR(150) | no | \_\_\_ | Correo electrónico del proveedor |
| status | enum | sí | \_\_ | Estado de la membresía (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### 🟡 included_services

**Descripción:** representa los servicios incluidos en los paquetes y su relación con los proveedores.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | bigint, PK, auto_increment | sí | `PRIMARY KEY`, `AUTO_INCREMENT` | identificador único del servicio incluido. |
| principal_id | varchar(100) | si | FOREIGN KEY → packages.id | Paquete al que pertenece el servicio. |
| related_id | varchar(255) | si | FOREIGN KEY → suppliers.id | Proveedor relacionado con el servicio. |
| relation_data | VARCHAR(255) | no | \_\_\_ | Información adicional del servicio o relación. |
| status | enum | sí | DEFAULT TRUE | Estado del registro (active/inactive, ej. anulado). |
| created_at | datetime | sí | default current_timestamp | Fecha y hora del check-in. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |
| membership_id | int, FK → membership.id | sí | — | Membresía validada para permitir el ingreso. |

### 🟡 bookings

**Descripción:** almacena las reservas realizadas por los clientes.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int, PK, auto_increment | sí | — | Identificador único de la rutina. |
| client_id | varchar(100) | sí | — | Cliente que realiza la reserva. |
| depurate_id | varchar(255) | si | — | Salida programada reservada. |
| traveler_id | Int | si | FOREIGN KEY → departures.id | Viajero asociado a la reserva. |
| start_date | datetime | si | FOREIGN KEY → travelers.id | Viajero asociado a la reserva. |
| end_date | datetime | si | \_\_\_ | Fecha y hora de finalización. |
| observations | varchar(225) | no | \_\_\_ | Observaciones adicionales. |
| status | enum | sí | \_\_\_ | Estado de la rutina (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### Estados de la reserva

| Valor       | Descripción         |
|-------------|---------------------|
| `pending`   | Reserva pendiente.  |
| `confirmed` | Reserva confirmada. |
| `cancelled` | Reserva cancelada.  |
| `completed` | Reserva completada. |

### 🔵 travelers

**Descripción:** almacena la información de los viajeros asociados a las reservas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int | sí | PK, auto_increment | Identificador único de la relación rutina-ejercicio. |
| name | VARCHAR(150) | sí | — | Nombre completo del viajero. |
| description | VARCHAR(255) | no | — | Información adicional del viajero. |
| status | enum | sí | \_\_\_ | Estado del ejercicio dentro de la rutina (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### 🟡 payments

**Descripción:** almacena los pagos realizados asociados a las reservas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | int, PK, auto_increment | sí | — | Identificador único del pago. |
| reference_type | varchar(100) | si | — | Tipo de entidad relacionada con el pago. |
| reference_id | BIGINT | si | FOREIGN KEY → bookings.id | Identificador de la reserva relacionada. |
| method | VARCHAR(50) | si | \_\_ | Medio de pago utilizado. |
| amount | DECIMAL(12,2) | si | \_\_ | valor pagado |
| payment_date | DATETIME | si | DEFAULT CURRENT_TIMESTAMP | Fecha y hora del pago |
| status | enum | sí | \_\_\_ | Estado del registro (active/inactive). |
| created_at | datetime | sí | default current_timestamp | Fecha de creación. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de última modificación. |

### Estados del pago

| Valor      | Descripción       |
|------------|-------------------|
| `pending`  | Pago pendiente.   |
| `approved` | Pago aprobado.    |
| `rejected` | Pago rechazado.   |
| `refunded` | Pago reembolsado. |

### 🔴 vouchers

**Descripción:** almacena los vouchers generados para las reservas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | Int | sí | PK, auto_increment | Identificador único del voucher. |
| booking_id | bigint | sí | FOREIGN KEY → bookings.id | Reserva asociada al voucher. |
| name | varchar(150) | sí | — | Nombre o código identificador del voucher. |
| descriptions | varchar(250) | no | — | Descripción del voucher. |
| status | enum | sí | DEFAULT TRUE | Indica si el voucher está vigente. |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

### 🔴 cancellations

**Descripción:** almacena los registros de cancelación de las reservas.

| Campo | Tipo | Obligatorio | Default / Restricción | Descripción |
|----|----|----|----|----|
| id | Int | sí | PK, auto_increment | Identificador único de la cancelación. |
| booking_id | bigint | sí | FOREIGN KEY → bookings.id | Reserva que fue cancelada. |
| name | varchar(150) | sí | — | Nombre o motivo de la cancelación. |
| descriptions | varchar(250) | no | — | Detalle de la cancelación y política aplicada. |
| status | enum | sí | DEFAULT TRUE | Indica si el registro está vigente |
| created_at | datetime | sí | default current_timestamp | Fecha de creación del registro. |
| updated_at | datetime | sí | default current_timestamp on update | Fecha de la última modificación. |

Este diseño cumple: - **FN1**: todos los atributos son atómicos, sin grupos repetitivos. - **FN2**: no hay tablas con clave compuesta y dependencias parciales (todas usan `id` como PK simple). - **FN3**: no hay dependencias transitivas — cada atributo no clave depende solo de la PK de su propia tabla.

------------------------------------------------------------------------

## Criterios de aceptación y evidencia esperada

| ID          | Criterio de aceptación                           |
|-------------|--------------------------------------------------|
| AC-SPEC1-01 | Identificar las entidades Business del proyecto. |
| AC-SPEC1-02 | Definir el diccionario de datos completo.        |
| AC-SPEC1-03 | Definir las llaves primarias y restricciones.    |
| AC-SPEC1-04 | Definir relaciones y llaves foráneas.            |
| AC-SPEC1-05 | Crear físicamente las tablas en MySQL.           |
| AC-SPEC1-06 | Validar el funcionamiento de la base de datos.   |

## Issues de la semana

| ID | Descripción | REQ / SPEC |
|----|----|----|
| ISS-S01-01 | Identificar y documentar las entidades Business de Wayuu Travel. | REQ-SPEC1-01 |
| ISS-S01-02 | Definir llaves primarias y restricciones. | REQ-SPEC1-02 |
| ISS-S01-03 | Definir relaciones y llaves foráneas. | REQ-SPEC1-03 |
| ISS-S01-04 | Levantar MySQL mediante Docker y conectar DBeaver. | REQ-SPEC1-04 |
| ISS-S01-05 | Crear físicamente las tablas de Wayuu Travel. | REQ-SPEC1-05 |

**Definition of Ready (DoR):** REQ y AC asociados y observables. **Definition of Done (DoD):** evidencia en repo + Issue en Hecho + bitácora.

## Dependencias entre Issues

| Issue      | Depende de |
|------------|------------|
| ISS-S01-01 | —          |
| ISS-S01-02 | ISS-S01-01 |
| ISS-S01-03 | ISS-S01-02 |
| ISS-S01-04 | ISS-S01-03 |
| ISS-S01-05 | ISS-S01-04 |

## Evidencia esperada

- Captura del contenedor Docker de MySQL corriendo.
- Captura de la conexión remota en DBeaver.
- Captura de las tablas creadas en DBeaver.
