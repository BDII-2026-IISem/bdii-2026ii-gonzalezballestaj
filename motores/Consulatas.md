# **Consultas avanzadas en MYSQL**

## Evidencia de los registros de cada tabla

![](images/clipboard-3724062.png)

![![](images/clipboard-1864669434.png)](images/clipboard-439859598.png)

![![](images/clipboard-2730115310.png)](images/clipboard-1883309583.png)

![![](images/clipboard-2302647387.png)](images/clipboard-2832621150.png)

![![](images/clipboard-1777094151.png)](images/clipboard-1839382769.png)

![](images/clipboard-2012684917.png)

# 1. Consultar datos de una tabla (Consultas Básicas)

### 1.1: Todos los campos de una tabla

``` sql
SELECT * FROM clients;
```

Necesitaba consultar la tabla clients completa para revisar qué datos teníamos almacenados. Usé \* para traer todos los atributos IDs, nombres, correos, documentos, etc.

Con `SELECT *` le indico al motor de base de datos que me devuelva absolutamente todas las columnas de la tabla `clients`, sin aplicar ningún filtro ni ordenamiento.

![](images/clipboard-321902976.png)

### Creacion del procedure

![](images/clipboard-2576110678.png)

![](images/clipboard-476493403.png)

### 1.2: Campos específicos

``` sql
SELECT id,name,phone,document_number   FROM clients;
```

Seleccioné únicamente `id`, `name`, `phone` y `document_number` de la tabla `clients`.Diseñé esta consulta con el fin de obtener datos especificos. En lugar de usar el comodín `*`, listo los nombres exactos de los campos que quiero proyectar.

![](images/clipboard-1096190889.png)

### Creacion del procedure

![](images/clipboard-787152696.png)

![](images/clipboard-187111747.png)

### 1.3: Campos específicos usando alias en la tabla

``` sql
SELECT C.name, C.document_number , C.phone  FROM clients AS C;
```

Mantuve la selección de datos clave del cliente pero le asigné un alias `AS C` a la tabla.

Lo redacté así para limpiar el código y dejarlo preparado para cuando necesite unir varias tablas, haciendo más legible el uso de `C.` en lugar de escribir el nombre completo de la tabla, con la cláusula `AS C` defino un sobrenombre temporal para la tabla `clients`. Luego antepongo `C.` a cada columna para indicar explícitamente a qué entidad pertenece cada atributo.

![](images/clipboard-3895929929.png)

### Creacion del procedure

![](images/clipboard-1904976717.png)

![](images/clipboard-2238240670.png)

# 2. Consultar datos de varias tablas (Relaciones / Joins)

### 2.1: Relación mediante la cláusula WHERE (Forma 1)

``` sql
SELECT * FROM clients, packages  WHERE clients.id = packages.id;
```

Relacioné `clients` y `packages` igualando sus llaves primarias en la cláusula `WHERE`, hice un cruce rápido para verificar qué paquete tiene asociado cada cliente, Enlisto ambas tablas separadas por coma en el `FROM`, lo que genera un producto cartesiano que luego filtro con la condición `WHERE` para emparejar únicamente los registros cuyo `id` sea idéntico.

![](images/clipboard-2028166054.png)

### Creacion del procedure

![](images/clipboard-2629970722.png)

![](images/clipboard-72708496.png)

### 2.2: Relación mediante WHERE con alias

``` sql
SELECT * FROM clients AS C, packages AS P WHERE C.id = P.id;
```

Es la misma lógica anterior entre `clients` y `packages`, pero asignando los alias `C` y `P`.

Con esto busco simplificar la escritura de la sentencia relacional para que la condición `C.id = P.id` sea mucho más directa de leer, cumple la misma función relacional, pero simplifico la sintaxis al reemplazar el nombre completo de las tablas por las letras `C` y `P`.

![](images/clipboard-3741076282.png)

### Creacion del procedure

![](images/clipboard-577045124.png)

![](images/clipboard-326811918.png)

### 2.3: Selección de campos específicos y comodín de tabla (`C.*`) usando WHERE

``` sql
SELECT C.name, C.email, P.* FROM clients AS C, packages  AS P WHERE C.id = P.id;
```

Escogí `C.name` y `C.email` para identificar al usuario, junto con `P.*` para traer todo el detalle del paquete, diseñé este cruce para cuando la aplicación solo necesita saber quién es el cliente (nombre y correo), pero requiere la ficha técnica completa del paquete que compró, me permite combinar proyecciones específicas de una tabla (`C.name`, `C.email`) con la totalidad de columnas de otra tabla relacionada usando la sintaxis `P.*`.

![](images/clipboard-2058742056.png)

### Creacion del procedure

![](images/clipboard-1259050996.png)

![](images/clipboard-3866129949.png)

### 2.4: Relación mediante la cláusula JOIN ... ON (Forma 2)

``` sql
SELECT C.name, C.email, B.* FROM clients AS C 
JOIN bookings AS B ON (C.id = B.client_id);
```

Uní `clients` con `bookings` mediante la llave foránea `client_id`, `JOIN ... ON` para separar limpiamente las condiciones de unión de cualquier filtro adicional, asegurando la relación entre el titular y sus reservas. Uso la cláusula explícita `JOIN` para declarar la vinculación entre tablas y la condición `ON` para indicar la coincidencia entre la clave primaria (`C.id`) y la clave foránea (`B.client_id`).

------------------------------------------------------------------------

### 

![](images/clipboard-1566588778.png)

# 3. Condiciones y Filtros en las Consultas

### 3.1: Filtro por fecha en consulta multitabla (Forma 1 - WHERE)

``` sql
SELECT C.name, C.email, B.* FROM clients AS C, bookings  AS B 
WHERE C.id = B.client_id AND B.created_at  = "2026-02-17 11:00:00";
```

`clients` y `bookings` filtrando por la hora exacta en `created_at`, La construí para auditorías puntuales: me permite rastrear exactamente qué cliente hizo una reserva en un segundo específico y comparar contra los logs del sistema. Combino la condición de unión de tablas con un operador lógico `AND` que restringe la búsqueda a un registro cuya columna de fecha y hora `created_at` coincida exactamente con el valor en texto especificado.

![](images/clipboard-309924258.png)

### Creacion del procedure

![](images/clipboard-4107710596.png)

![](images/clipboard-1247011410.png)

### 3.2: Filtro por fecha en consulta multitabla (Forma 2 - JOIN)

``` sql
SELECT C.name, C.email, B.* 
FROM clients AS C JOIN bookings  AS B ON (C.id = B.id) 
WHERE B.updated_at  = "2026-02-20 11:00:00";
```

Vinculé con `JOIN` y filtré por la fecha de modificación `updated_at`. necesitaba este filtro para monitorear actualizaciones operativas o cambios de estado realizados en las reservas durante ese día.`JOIN` para relacionar las entidades y evalúo mediante la cláusula `WHERE` la columna `updated_at` para encontrar modificaciones en instantes específicos.

![](images/clipboard-3476490450.png)

### 3.3: Filtro por patrón con `LIKE` (comienza con 'j' o 'm')

``` sql
SELECT * FROM clients AS C 
WHERE C.name LIKE 'm%' OR C.name LIKE 'j%'
```

Evalué la columna `name` de `clients` usando `LIKE`. La redacté para darle soporte a un buscador alfabético en el sistema, permitiendo filtrar clientes cuyos nombres comiencen por "m" o "j". El operador `LIKE` combinado con el símbolo comodín `%` me permite evaluar cadenas de texto. La condición `LIKE 'm%'` encuentra cualquier valor que inicie con la letra "m", sin importar los caracteres siguientes. El operador `OR` me permite incluir también los que inician por "j".

![](images/clipboard-2724522030.png)

### Creacion del procedure

![](images/clipboard-1857041358.png)

![](images/clipboard-3549582868.png)

### 3.4: Filtro por patrón con `LIKE` y `CONCAT` (contiene 'Diego Silva' o 'diego.silva58\@gmail.com')

``` sql
SELECT * FROM clients AS C 
WHERE C.name LIKE '%Diego Silva%' or C.email LIKE '%diego.silva58@gmail.com%';
```

Filtré en `clients` sobre `name` y `email`.Esta consulta me sirve para hacer búsquedas flexibles en el sistema cuando un usuario intenta buscar a un cliente específico por su nombre o correo electrónico, al colocar el comodín `%` tanto al inicio como al final de la cadena (`'%texto%'`), el motor busca cualquier registro que contenga la subcadena indicada en cualquier posición del texto dentro de las columnas `name` o `email`.

![](images/clipboard-1566591675.png)

### Creacion del procedure

![](images/clipboard-3770454390.png)

![](images/clipboard-3488955492.png)

### 3.5: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 1 - WHERE)

``` sql
SELECT C.*, B.*, D.*, T.*, V.* 
FROM clients AS C, bookings AS B, departures AS D, travelers AS T,  vouchers AS V 
WHERE C.id = B.client_id 
  AND D.id = B.departure_id 
  AND T.id = B.traveler_id 
  AND B.id = V.booking_id 
  AND V.created_at BETWEEN "2026-05-03 08:22:00" AND "2026-07-03 11:04:00" 
ORDER BY V.created_at ASC;
```

Uní `clients`, `bookings`, `departures`, `travelers` y `vouchers`, filtrando por la fecha de emisión del comprobante.Mi objetivo aquí fue identificar quién compró (`clients`), la reserva realizada (`bookings`), el viaje (`departures`), el viajero real (`travelers`) y el comprobante emitido (`vouchers`), ordenado cronológicamente, encadeno múltiples cláusulas `JOIN` conectando las claves primarias y foráneas a lo largo de toda la cadena. Aplico un filtro de fecha y ordeno el resultado mediante `ORDER BY`.

![](images/clipboard-2859133064.png)

### Creacion del procedure

![](images/clipboard-2132768176.png)

![](images/clipboard-4130004554.png)

### 3.6: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 2 - JOIN)

``` sql
SELECT * 
FROM clients AS C 
JOIN bookings AS B ON (C.id = B.client_id) 
JOIN vouchers AS V ON (B.id = V.booking_id) 
WHERE B.created_at BETWEEN "2026-02-17 11:00:00" AND "2026-05-16 12:00:00" 
ORDER BY B.created_at  ASC;
```

Uní `clients`, `bookings` y `vouchers` con un rango `BETWEEN` sobre `B.created_a.`La redacté para extraer el historial de ventas y comprobantes generados a lo largo de un trimestre para las revisiones contables. El operador `BETWEEN 'fecha_inicio' AND 'fecha_fin'` me filtra un rango inclusivo de fechas en la columna de creación de la reserva, permitiéndome acotar los resultados a un periodo de tiempo determinado.

![](images/clipboard-2272254038.png)

### Creacion del procedure

![](images/clipboard-2141060680.png)

![](images/clipboard-4054283703.png)

# 4. Consultas de Agrupamiento (`GROUP BY`)

### 4.1: Suma, conteo y promedio por cliente en rango de fechas (Forma 1 - WHERE)

``` sql
SELECT b.client_id, COUNT(p.id) AS total_pagos, SUM(p.amount) AS suma_total_pagada,
AVG(p.amount) AS promedio_por_pago
FROM payments p
INNER JOIN  bookings b ON p.booking_id = b.id
WHERE  p.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' AND p.status = 'active'AND b.status = 'active'
GROUP BY  b.client_id;
```

Uní `payments` con `bookings` y `clients`, calculando agregados sobre `p.amount` y agrupando por cliente. Sive para medir el comportamiento del cliente (cantidad de abonos, facturación total y promedio pagado) entregando a la administración un reporte claro con el nombre completo y documento.

Utilizo funciones de agregación como `COUNT()` para contar transacciones, `SUM()` para el total acumulado y `AVG()` para el promedio. La cláusula `GROUP BY` colapsa las filas agrupándolas por los atributos únicos del cliente.

![](images/clipboard-1027377177.png)

### Creacion del procedure

![](images/clipboard-3438405878.png)

![](images/clipboard-1254355195.png)

### 4.2: Suma, conteo y promedio por cliente en rango de fechas (Forma 2 - JOIN)

``` sql
SELECT  c.id AS client_id,  c.name AS nombre_cliente,c.document_number,
 COUNT(p.id) AS total_pagos,
 SUM(p.amount) AS suma_total_pagada,
 AVG(p.amount) AS promedio_por_pago
FROM payments p
INNER JOIN bookings b ON p.booking_id = b.id
INNER JOIN clients c ON b.client_id = c.id
WHERE p.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' 
  AND p.status = 'active'
  AND b.status = 'active'
GROUP BY c.id, c.name, c.document_number;
```

![](images/clipboard-1511600026.png)

### Creacion del procedure

![](images/clipboard-522423822.png)

![](images/clipboard-1273047378.png)

# 5. Consultas de Agrupamiento con Filtro Post-Agregación (HAVING)

### 5.1: Agrupamiento con condición de conteo HAVING (Forma 1 - WHERE)

``` sql
SELECT c.id AS client_id, c.name AS nombre_cliente,
SUM(p.amount) AS TotalSuma, 
COUNT(p.id) AS CuentaTotal, 
AVG(p.amount) AS Promedio  
FROM clients c, bookings b, payments p 
WHERE c.id = b.client_id 
  AND b.id = p.booking_id 
  AND p.payment_date BETWEEN '2026-03-01 00:00:00' AND '2026-03-30 23:59:59'
  AND p.status = 'active'
  AND b.status = 'active'
GROUP BY c.id, c.name 
HAVING COUNT(p.id) >= 1 
ORDER BY TotalSuma DESC;
```

Crucé `clients`, `bookings` y `payments`, filtré fechas en marzo y apliqué `HAVING COUNT(p.id) >= 1`. Con este filtro busco mover a los clientes realmente activos, descartando los que no hicieron abonos y ordenando de mayor a menor a los clientes que más ingresos generaron. A diferencia de `WHERE` (que filtra filas antes de agrupar), uso `HAVING` para evaluar condiciones sobre el resultado de las funciones de agregación, descartando los grupos que no cumplan con el criterio fijado (por ejemplo, haber hecho al menos 1 pago).

![](images/clipboard-1007889671.png)

### Creacion del procedure

![](images/clipboard-1843158462.png)

![](images/clipboard-967784551.png)

### 5.2: Agrupamiento con condición de conteo `HAVING` (Forma 2 - JOIN)

``` sql
SELECT c.id AS client_id, c.name AS nombre_cliente,
SUM(p.amount) AS TotalSuma, 
COUNT(p.id) AS CuentaTotal, 
AVG(p.amount) AS Promedio  
FROM clients AS c
JOIN bookings AS b ON c.id = b.client_id
JOIN payments AS p ON b.id = p.booking_id
WHERE p.payment_date BETWEEN "2026-03-01 00:00:00" AND "2026-03-30 23:59:59"
GROUP BY c.id, c.name 
HAVING COUNT(p.id) >= 0
ORDER BY TotalSuma DESC;
```

Crucé `clients`, `bookings` y `payments`, filtré fechas en marzo y apliqué `HAVING COUNT(p.id) >= 1`. Con este filtro busco mover a los clientes realmente activos, descartando los que no hicieron abonos y ordenando de mayor a menor a los clientes que más ingresos generaron. A diferencia de `WHERE` (que filtra filas antes de agrupar), uso `HAVING` para evaluar condiciones sobre el resultado de las funciones de agregación, descartando los grupos que no cumplan con el criterio fijado (por ejemplo, haber hecho al menos 1 pago).

![](images/clipboard-3103990757.png)

# 6. Subconsultas y Teoría de Conjuntos (A-B)

### 6.1: Clientes sin ventas en un rango usando subconsulta `NOT IN` (Forma 1)

``` sql
SELECT * FROM clients AS c 
WHERE c.id NOT IN (
SELECT b.client_id 
FROM bookings AS b 
JOIN payments AS p ON b.id = p.booking_id 
WHERE p.payment_date BETWEEN "2026-03-01 00:00:00" AND "2026-03-2 23:59:59"
);
```

Evalué clientes sin ventas usando `NOT IN` y `LEFT JOIN` con `IS NULL`. Apliqué la teoría de conjuntos para extraer a los Clientes Inactivos, es decir, aquellos registrados que no tuvieron compras en esas fechas para pasarle la lista al equipo de mercadeo.En la opción `NOT IN`, la subconsulta me retorna la lista de IDs que compraron y la consulta externa selecciona los que no están en esa lista. En la opción `LEFT JOIN`, uno todas las tablas y filtro con `IS NULL` las filas donde no hubo coincidencia en la tabla secundaria.

![](images/clipboard-1213767510.png)

### Creacion del procedure

![](images/clipboard-3382423504.png)

![](images/clipboard-2772603405.png)

### 6.2: Clientes sin ventas en un rango usando `LEFT JOIN` y `IS NULL` (Forma 2)

``` sql
SELECT c.* FROM clients AS c 
LEFT JOIN (SELECT b.client_id 
FROM bookings AS b 
JOIN payments AS p ON b.id = p.booking_id 
WHERE p.payment_date BETWEEN "2026-03-01 00:00:00" AND "2026-03-30 23:59:59"
) AS v ON c.id = v.client_id 
WHERE v.client_id IS NULL;
```

Evalué clientes sin ventas usando `NOT IN` y `LEFT JOIN` con `IS NULL`. Apliqué la teoría de conjuntos para extraer a los Clientes Inactivos, es decir, aquellos registrados que no tuvieron compras en esas fechas para pasarle la lista al equipo de mercadeo.En la opción `NOT IN`, la subconsulta me retorna la lista de IDs que compraron y la consulta externa selecciona los que no están en esa lista. En la opción `LEFT JOIN`, uno todas las tablas y filtro con `IS NULL` las filas donde no hubo coincidencia en la tabla secundaria.

![](images/clipboard-1490188045.png)

### Creacion del procedure

![](images/clipboard-2509639690.png)

![](images/clipboard-2560001563.png)

# CREACION DE TRIGGERS

- Para el sistema WayuuTravel creó la tabla `clients` para almacenar la información de los clientes, La tabla utiliza `id` como clave primaria para identificar cada cliente,Los campos `document_type` y `document_number` almacenan la información del documento,\
  El campo `name` registra el nombre completo del cliente,\
  Los campos `phone` y `email` almacenan sus datos de contacto,\
  El campo `status` permite controlar si el cliente está `active` o `inactive,`\
  El campo `created_at` registra la fecha de creación del registro,\
  El campo `updated_at` registra la fecha de actualización del registro,\
  La tabla permite mantener organizada y centralizada la información de los clientes,\
  Además, `clients` se relaciona con otras tablas, como `bookings`, para gestionar sus reservas. Creo este triggers con el fin de consultar la insersion, actualizacion o eliminacion de usuarios registrados en la base de datos.

### 1.creo una tabla de auditoría `clients_audit` y tres triggers: `INSERT`, `UPDATE` y `DELETE`.Voy a usar **JSON** para guardar el estado anterior y posterior del cliente.

``` sql
CREATE TABLE clients_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

![](images/clipboard-2777596669.png)

### 2.Creo el trigger de paar insertar nuevos registros de clientes

``` sql
CREATE DEFINER=`root`@`%` TRIGGER `insert_clients` AFTER INSERT ON `clients` FOR EACH ROW INSERT INTO clients_audit (
        client_id,
        action,
        old_data,
        new_data
    )
    VALUES (
        NEW.id,
        'INSERT',
        NULL,
        JSON_OBJECT(
            'id', NEW.id,
            'document_type', NEW.document_type,
            'document_number', NEW.document_number,
            'name', NEW.name,
            'phone', NEW.phone,
            'email', NEW.email,
            'status', NEW.status,
            'created_at', NEW.created_at,
            'updated_at', NEW.updated_at
        )
    )
```

![](images/clipboard-1496452488.png)

### 3.Luego ceo el trigger pa actualizar y modificar los registros de usuarios

``` sql
CREATE TRIGGER update_clients
AFTER UPDATE ON clients
FOR EACH ROW
INSERT INTO clients_audit (
    client_id,
    action,
    old_data,
    new_data
)
VALUES (
    NEW.id,
    'UPDATE',
    JSON_OBJECT(
        'id', OLD.id,
        'document_type', OLD.document_type,
        'document_number', OLD.document_number,
        'name', OLD.name,
        'phone', OLD.phone,
        'email', OLD.email,
        'status', OLD.status,
        'created_at', OLD.created_at,
        'updated_at', OLD.updated_at
    ),
    JSON_OBJECT(
        'id', NEW.id,
        'document_type', NEW.document_type,
        'document_number', NEW.document_number,
        'name', NEW.name,
        'phone', NEW.phone,
        'email', NEW.email,
        'status', NEW.status,
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
    )
);
```

![](images/clipboard-1942009660.png)

### 4.Ahora creo el trigger para eliminar registros de usuarios

``` sql
CREATE TRIGGER delete_clients
AFTER DELETE ON clients
FOR EACH ROW
INSERT INTO clients_audit (
    client_id,
    action,
    old_data,
    new_data
)
VALUES (
    OLD.id,
    'DELETE',
    JSON_OBJECT(
        'id', OLD.id,
        'document_type', OLD.document_type,
        'document_number', OLD.document_number,
        'name', OLD.name,
        'phone', OLD.phone,
        'email', OLD.email,
        'status', OLD.status,
        'created_at', OLD.created_at,
        'updated_at', OLD.updated_at
    ),
    NULL
);
```

![](images/clipboard-1138025710.png)

### 5.Inserto los nuevos datos

![](images/clipboard-3783175291.png)

### 6.reviso nuevamente la tabal clients_audit y miramos cuales son los campos que fueron alterados

![](images/clipboard-354520306.png)

- Para el sistema WayuuTravel creó la tabla `cancellations` para almacenar la información de las cancelaciones de reservas. La tabla utiliza `id` como clave primaria para identificar cada registro de cancelación, y se relaciona mediante `booking_id` como clave foránea con la tabla `bookings` para asociar cada evento a su respectiva reserva. Los campos `name` y `descriptions` permiten almacenar el nombre o motivo de la cancelación y una descripción detallada sobre la misma. El campo `status` permite controlar si la cancelación se encuentra en estado `active` o `inactive`. Los campos `created_at` y `updated_at` registran automáticamente las fechas de creación y actualización del registro. Además, se crearon triggers junto a una tabla de auditoría (`cancellations_log`) con el fin de consultar e inspeccionar la inserción, actualización o eliminación de cancelaciones registradas en la base de datos.

### 1. Creo la tabla de auditoría `cancellations_audit` y tres triggers: INSERT, UPDATE y DELETE

``` sql
CREATE TABLE cancellations_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cancellation_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

![](images/clipboard-3993008448.png)

### 2. Creo el trigger para insertar nuevos registros de cancelaciones

``` {.sql .sq}

CREATE DEFINER=`root`@`%` TRIGGER `insert_cancellations` 
AFTER INSERT ON `cancellations` 
FOR EACH ROW 
INSERT INTO cancellations_audit (
    cancellation_id,
    action,
    old_data,
    new_data
)
VALUES (
    NEW.id,
    'INSERT',
    NULL,
    JSON_OBJECT(
        'id', NEW.id,
        'booking_id', NEW.booking_id,
        'name', NEW.name,
        'descriptions', NEW.descriptions,
        'status', NEW.status,
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
    )
);
```

![](images/clipboard-1728511384.png)

### 3. Luego creo el trigger para actualizar y modificar los registros de cancelaciones

``` sql
CREATE DEFINER=`root`@`%` TRIGGER `update_cancellations` AFTER UPDATE ON `cancellations` FOR EACH ROW INSERT INTO cancellations_audit (
    cancellation_id,
    action,
    old_data,
    new_data
)
VALUES (
    NEW.id,
    'UPDATE',
    JSON_OBJECT(
        'id', OLD.id,
        'booking_id', OLD.booking_id,
        'name', OLD.name,
        'descriptions', OLD.descriptions,
        'status', OLD.status,
        'created_at', OLD.created_at,
        'updated_at', OLD.updated_at
    ),
    JSON_OBJECT(
        'id', NEW.id,
        'booking_id', NEW.booking_id,
        'name', NEW.name,
        'descriptions', NEW.descriptions,
        'status', NEW.status,
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
    )
)
```

![](images/clipboard-2769741742.png)

### 4. Ahora creo el trigger para eliminar registros de cancelaciones

``` sql
CREATE DEFINER=`root`@`%` TRIGGER `delete_cancellations` AFTER DELETE ON `cancellations` FOR EACH ROW INSERT INTO cancellations_audit (
    cancellation_id,
    action,
    old_data,
    new_data
)
VALUES (
    OLD.id,
    'DELETE',
    JSON_OBJECT(
        'id', OLD.id,
        'booking_id', OLD.booking_id,
        'name', OLD.name,
        'descriptions', OLD.descriptions,
        'status', OLD.status,
        'created_at', OLD.created_at,
        'updated_at', OLD.updated_at
    ),
    NULL
)
```

![](images/clipboard-2290128682.png)

### 5. Inserto los nuevos datos (modifico valores y registros de la tabla cancellations para comprobar si los trigger estan funcionndo correctamente)

![](images/clipboard-2891374407.png)

### 6. Reviso nuevamente la tabla `cancellations_audit` y miramos cuáles son los campos que fueron alterados

![](images/clipboard-991804782.png)

y aca podemos observar las respectivas modificaciones que se hicieron a la tabla cancellations.

- Para el sistema WayuuTravel creo la tabla `packages` para almacenar la información de los paquetes turísticos disponibles. La tabla utiliza `id` como clave primaria para identificar cada paquete de manera única. Los campos `name` y `descriptions` permiten almacenar el nombre del paquete y una descripción detallada de la experiencia turística. El campo `status` permite controlar si el paquete se encuentra en estado `active` o `inactive`. Los campos `created_at` y `updated_at` registran las fechas de creación y actualización del registro. Además, se crearon triggers junto a una tabla de auditoría (`ad_packages_audit`) con el fin de consultar e inspeccionar la inserción, actualización o eliminación de paquetes registrados en la base de datos.

### 1. Creo la tabla de auditoría packages`_audit` y tres triggers: INSERT, UPDATE y DELETE

``` sql
CREATE TABLE packages_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

![](images/clipboard-1842336412.png)

### 2. Creo el trigger para insertar nuevos registros de packages

``` {.sql .sq}
CREATE DEFINER=`admin`@`%` TRIGGER `ai_packages_audit`
AFTER INSERT ON `packages`
FOR EACH ROW
BEGIN
  SET @from_packages_trigger = 1;

  INSERT INTO packages_audit (
    package_id,
    action,
    old_data,
    new_data
  )
  VALUES (
    NEW.id,
    'INSERT',
    NULL,
    JSON_OBJECT(
      'id', NEW.id,
      'name', NEW.name,
      'descriptions', NEW.description,
      'status', NEW.status,
      'created_at', NEW.created_at,
      'updated_at', NEW.updated_at
    )
  );

  SET @from_packages_trigger = NULL;
END
```

![](images/clipboard-1285467410.png)

### 3. Luego creo el trigger para actualizar y modificar los registros de packages

``` sql
CREATE DEFINER=`admin`@`%` TRIGGER `au_packages_audit`
AFTER UPDATE ON `packages`
FOR EACH ROW
BEGIN
  SET @from_packages_trigger = 1;

  INSERT INTO packages_audit (
    package_id,
    action,
    old_data,
    new_data
  )
  VALUES (
    NEW.id,
    'UPDATE',
    JSON_OBJECT(
      'id', OLD.id,
      'name', OLD.name,
      'descriptions', OLD.description,
      'status', OLD.status,
      'created_at', OLD.created_at,
      'updated_at', OLD.updated_at
    ),
    JSON_OBJECT(
      'id', NEW.id,
      'name', NEW.name,
      'descriptions', NEW.description,
      'status', NEW.status,
      'created_at', NEW.created_at,
      'updated_at', NEW.updated_at
    )
  );

  SET @from_packages_trigger = NULL;
END
```

![](images/clipboard-384635276.png)

### 4. Ahora creo el trigger para eliminar registros de packages

``` sql
CREATE DEFINER=`admin`@`%` TRIGGER `ad_packages_audit`
AFTER DELETE ON `packages`
FOR EACH ROW
BEGIN
  SET @from_packages_trigger = 1;

  INSERT INTO packages_audit (
    package_id,
    action,
    old_data,
    new_data
  )
  VALUES (
    OLD.id,
    'DELETE',
    JSON_OBJECT(
      'id', OLD.id,
      'name', OLD.name,
      'descriptions', OLD.description,
      'status', OLD.status,
      'created_at', OLD.created_at,
      'updated_at', OLD.updated_at
    ),
    NULL
  );

  SET @from_packages_trigger = NULL;
END
```

![](images/clipboard-2586431928.png)

### 5. Inserto los nuevos datos (modifico valores y registros de la tabla packages para comprobar si los trigger estan funcionndo correctamente)

![](images/clipboard-3043178215.png)

### 6. Reviso nuevamente la tabla `package_audit` y miramos cuáles son los campos que fueron alterados o modificados

![](images/clipboard-2554966810.png)

y aca en la tabla podemos ver la modificacion que se realizo y de que tipo fue (insert,update o delete).

# **Consultas avanzadas en postgres**

## Evidencia de los registros de cada tabla

![](images/clipboard-3756967492.png)

![![](images/clipboard-2509880491.png)](images/clipboard-3145780045.png)

![![](images/clipboard-2762919528.png)](images/clipboard-1351705269.png)

![![](images/clipboard-2016793502.png)](images/clipboard-3570937543.png)

![![](images/clipboard-1960159514.png)](images/clipboard-1638466390.png)

![](images/clipboard-3693015620.png)

# 1. Consultar datos de una tabla (Consultas Básicas)

### 1.1: Todos los campos de una tabla

Invoqué el esquema explícito `public.clients` y manejé alias en minúsculas. En PostgreSQL me aseguré de invocar `public.clients` para mantener buenas prácticas y evitar problemas con la resolución de tablas.Al anteponer el nombre del esquema (`public.`) evito ambigüedades cuando existen múltiples esquemas dentro de la misma base de datos, garantizando que PostgreSQL apunte a la tabla correcta.

``` sql
SELECT * FROM public.clients;
```

![](images/clipboard-2465519490.png)

### Creacion del procedure

![](images/clipboard-1261470345.png)

![](images/clipboard-680206344.png)

### 1.2: Campos específicos

Invoqué el esquema explícito `public.clients` y manejé alias en minúsculas. En PostgreSQL me aseguré de invocar `public.clients` para mantener buenas prácticas y evitar problemas con la resolución de tablas.Al anteponer el nombre del esquema (`public.`) evito ambigüedades cuando existen múltiples esquemas dentro de la misma base de datos, garantizando que PostgreSQL apunte a la tabla correcta ademas hice referencia a los datos que me interesaban conocer de l atabla clients.

``` sql
SELECT id, name, phone,  document_number 
FROM public.clients;
```

![](images/clipboard-2770732586.png)

### Creacion del procedure

![](images/clipboard-1261470345.png)

![](images/clipboard-680206344.png)

### 

### 1.3: Campos especificos usando alias en la tabla

Invoqué el esquema explícito `public.clients` y manejé alias en minúsculas. En PostgreSQL me aseguré de invocar `public.clients` para mantener buenas prácticas y evitar problemas con la resolución de tablas.Al anteponer el nombre del esquema (`public.`) evito ambigüedades cuando existen múltiples esquemas dentro de la misma base de datos, garantizando que PostgreSQL apunte a la tabla correcta ademas hice referencia a los datos que me interesaban conocer de l atabla clients pero usando alias.

``` sql
SELECT c.name, c.document_number, c.phone  
FROM public.clients AS c;
```

![](images/clipboard-2670321724.png)

# 2. Consultar datos de varias tablas (Relaciones / Joins)

### 2.1: Relación mediante la cláusula WHERE (Forma 1)

Esta sentencia combina dos o más tablas enumerándolas directamente en la cláusula `FROM` . Genera un producto cartesiano que luego es filtrado en la cláusula `WHERE` igualando sus claves primarias y foráneas. Permite vincular registros relacionados, como asociar cada cliente con sus correspondientes paquetes o reservas. Es una sintaxis clásica y directa para realizar cruces de información básicos entre tablas.

``` sql
SELECT * FROM public.clients, public.bookings 
WHERE clients.id = bookings.id;
```

![](images/clipboard-2587002953.png)

### Creacion del procedure

![](images/clipboard-3803630708.png)

![](images/clipboard-179913137.png)

### 2.2: Relación mediante WHERE con alias

Esta consulta implementa la misma lógica de unión en el `WHERE` pero incorporando alias cortos para cada tabla relacionada. Simplifica la escritura de las condiciones de cruce haciendo que las comparaciones entre llaves sean más breves. Mejora la interpretación visual de la consulta cuando se trabaja con múltiples entidades en la base de datos. Reduce la probabilidad de cometer errores de sintaxis al referenciar campos de tablas distintas.

``` sql
SELECT * FROM public.clients AS c, public.bookings AS b 
WHERE c.id = b.id;
```

![](images/clipboard-4083686690.png)

### Creacion del procedure

![](images/clipboard-3803630708.png)

![](images/clipboard-179913137.png)

### 

### 2.3: Selección de campos específicos y comodín de tabla (V.\*) usando WHERE

Esta sentencia combina la proyección de atributos seleccionados de una tabla con la totalidad de columnas de otra usando `ALIAS.*`. Resulta ideal cuando se necesita identificar al titular (nombre y correo) y a la vez obtener la ficha completa del detalle. Mantiene la unión relacional mediante la cláusula `WHERE` vinculando las claves correspondientes de ambas entidades. Optimiza la consulta al evitar traer columnas repetidas o innecesarias de la primera tabla.

``` sql
SELECT c.name, c.email, b.* FROM public.clients AS c, public.bookings AS b 
WHERE c.id = b.id;
```

![](images/clipboard-4167549657.png)

### Creacion del procedure

![](images/clipboard-1179681411.png)

![](images/clipboard-1526542988.png)

### 2.4: Relación mediante la cláusula JOIN ... ON (Forma 2)

Esta consulta utiliza la sintaxis moderna ANSI-99 declarando la vinculación de tablas mediante la cláusula explicita `JOIN`. Separa con claridad la condición de unión dentro del bloque `ON` de las condiciones de filtrado habituales. Mejora el rendimiento del motor de base de datos al construir planes de ejecución más estructurados y legibles. Es el estándar recomendado en el desarrollo profesional para conectar tablas relacionales de forma limpia.

``` sql
SELECT  c.name, c.email, b.* FROM public.clients AS c 
JOIN public.bookings AS b ON c.id = b.id;
```

![](images/clipboard-2026868771.png)

### Creacion del procedure

![](images/clipboard-3931712032.png)

![](images/clipboard-1925419385.png)

# 3. Condiciones y Filtros en las Consultas

### 3.1: Filtro por fecha en consulta multitabla (Forma 1 - WHERE)

Esta consulta une múltiples tablas en la cláusula `FROM` y evalúa una coincidencia de fecha exacta dentro del `WHERE`. Permite realizar auditorías puntuales para localizar registros creados o modificados en un segundo específico en la base de datos. Combina la condición de relación de las entidades mediante el operador lógico `AND` junto con el filtro temporal. Es útil para rastrear transacciones específicas o validar logs de eventos en el sistema.

``` sql
SELECT  c.name, c.email, b.* FROM public.clients AS c, public.bookings AS b 
WHERE c.id = b.id 
AND b.created_at = '2026-02-17 11:00:00';
```

![](images/clipboard-1226621554.png)

### Creacion del procedure

![](images/clipboard-1640001297.png)

![](images/clipboard-235776206.png)

### 3.2: Filtro por fecha en consulta multitabla (Forma 2 - JOIN)

Esta sentencia conecta las tablas utilizando la sintaxis `JOIN ... ON` y aplica el filtro temporal mediante la cláusula `WHERE`. Facilita el monitoreo operativo de registros modificados o creados en fechas y horas específicas dentro del sistema. Al mantener separada la lógica de unión en el `ON`, el filtro por fecha en el `WHERE` resulta mucho más claro de analizar. Garantiza que la búsqueda sea precisa al evaluar columnas de tipo fecha o fecha/hora.

``` sql
 SELECT c.name,  c.email,  b.* FROM public.clients AS c 
JOIN public.bookings AS b ON c.id = b.id 
WHERE b.updated_at = '2026-02-20 11:00:00';
```

![](images/clipboard-3160335241.png)

### 3.3: Filtro por patrón con LIKE (comienza con 'j' o 'm')

Esta consulta evalúa columnas de texto utilizando el operador `LIKE` acompañado del comodín `%` al final de la cadena. Permite buscar y filtrar registros cuyo nombre o valor comience por letras específicas, como la 'j' o la 'm'. La condición lógica `OR` permite combinar múltiples patrones dentro de la misma sentencia de manera flexible. Es la base para implementar filtros alfabéticos y buscadores por iniciales dentro de la aplicación.

``` sql
SELECT * FROM public.clients AS c 
WHERE c.name ILIKE 'm%'  OR c.name ILIKE 'j%';
```

![](images/clipboard-81936110.png)

### Creacion del procedure

![](images/clipboard-2792059915.png)

![](images/clipboard-229180439.png)

### 3.4: Filtro por patrón con LIKE y CONCAT (contiene 'Diego Silva' o '[diego.silva58\@gmail.com](mailto:diego.silva58@gmail.com){.email}')

Esta sentencia realiza búsquedas flexibles en columnas de texto buscando coincidencias en cualquier posición con `'%Diego%'`. Permite localizar registros específicos comparando simultáneamente sobre campos como el nombre o el correo electrónico. Al utilizar la condición `OR`, la consulta devuelve los datos si coincide con cualquiera de los patrones evaluados. Es ampliamente utilizada para dar soporte a las barras de búsqueda globales en los sistemas web.

``` sql
SELECT * FROM public.clients AS c 
WHERE c.name ILIKE '%Diego Silva%'  OR c.email ILIKE '%diego.silva58@gmail.com%';
```

![](images/clipboard-3344763516.png)

### Creacion del procedure

![](images/clipboard-3614494286.png)

![](images/clipboard-3361529306.png)

### 3.5: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 1 - WHERE)

Esta consulta enlaza cuatro tablas simultáneamente listándolas en el `FROM` e igualando sus claves en la cláusula `WHERE`. Utiliza el operador `BETWEEN` para acotar la búsqueda a un rango inclusivo de fechas de creación o emisión. Permite reconstruir la trazabilidad completa de una operación (cliente, reserva, viaje y comprobante) en un período. Ordena los resultados cronológicamente mediante `ORDER BY` para facilitar la lectura de los reportes.

``` sql
SELECT c.*,  b.*,  d.*, t.*, v.* FROM public.clients AS c, 
  public.bookings AS b, 
  public.departures AS d, 
  public.travelers AS t,  
  public.vouchers AS v 
WHERE c.id = b.id 
  AND d.id = b.id 
  AND t.id = b.id 
  AND b.id = v.booking_id 
  AND v.created_at BETWEEN '2026-05-03 08:22:00' AND '2026-07-03 11:04:00' 
ORDER BY v.created_at ASC;
```

![](images/clipboard-2676951075.png)

### 3.6: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 2 - JOIN)

Esta sentencia encadena cuatro tablas mediante múltiples cláusulas `JOIN ... ON` conectando sus claves primarias y foráneas. Aplica el filtro de rango de fechas en la cláusula `WHERE` para acotar los resultados a un intervalo de tiempo exacto. Garantiza una trazabilidad operacional limpia al estructurar las uniones de forma modular y altamente legible. Finalmente, organiza la información de manera ascendente o descendente mediante la cláusula `ORDER BY`.

``` sql
SELECT * FROM public.clients AS c 
JOIN public.bookings AS b ON c.id = b.id 
JOIN public.vouchers AS v ON b.id = v.booking_id 
WHERE b.created_at BETWEEN '2026-02-17 11:00:00' AND '2026-05-16 12:00:00' 
ORDER BY b.created_at ASC;
```

![](images/clipboard-362667778.png)

### Creacion de el procedure

![](images/clipboard-2333040674.png)

![](images/clipboard-2412326858.png)

# 4. Consultas de Agrupamiento (GROUP BY)

### 4.1: Suma, conteo y promedio por cliente en rango de fechas (Forma 1 - WHERE)

Esta consulta combina las tablas mediante la cláusula `WHERE` y agrupa la información por cliente usando `GROUP BY`. Aplica funciones de agregación como `COUNT()` para transacciones, `SUM()` para ingresos totales y `AVG()` para promedios. Acota la información analizada a un intervalo de tiempo específico mediante el filtro `BETWEEN` en la condición `WHERE`. Permite generar reportes financieros consolidados evaluando el comportamiento comercial de cada usuario.

``` sql
SELECT c.id AS client_id,  c.name AS nombre_cliente,c.document_number,
 COUNT(b.id) AS total_reservas,
 SUM(d.id  ) AS suma_total_paquetes,
 ROUND(AVG(d.id ), 2) AS promedio_por_reserva
FROM public.bookings AS b
JOIN public.departures AS d ON b.id = d.id
JOIN public.clients AS c ON b.id = c.id
WHERE b.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' 
  AND b.status = 'active'
GROUP BY c.id, c.name, c.document_number;
```

![](images/clipboard-1120918786.png)

### Creacion de el procedure

![](images/clipboard-3174038369.png)

![](images/clipboard-1009899315.png)

### 4.2: Suma, conteo y promedio por cliente en rango de fechas (Forma 2 - JOIN)

Esta sentencia vincula las tablas de ventas y clientes mediante la sintaxis explicita `JOIN ... ON` agrupando por identificador. Utiliza funciones matemáticas agregadas para calcular la facturación, volumen de pagos y promedios por cada cliente. Filtra el rango de fechas requerido dentro de la cláusula `WHERE` antes de realizar el proceso de agrupamiento. Entrega a la administración un resumen financiero limpio, optimizando el rendimiento en bases de datos grandes.

``` sql
SELECT  c.id AS client_id,  c.name AS nombre_cliente, c.document_number,
 COUNT(p.id) AS total_paquetes_reservados,
 SUM(p.id) AS suma_total_paquetes,
 ROUND(AVG(p.id), 2) AS promedio_precio_paquete
FROM public.bookings AS b
JOIN public.departures AS d ON b.id = d.id
JOIN public.packages AS p ON d.package_id = p.id
JOIN public.clients AS c ON b.id = c.id
WHERE b.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' 
AND b.status = 'active'
GROUP BY c.id, c.name, c.document_number;
```

![](images/clipboard-1133030761.png)

### Creacion de el procedure

![](images/clipboard-3838401058.png)

![](images/clipboard-3453444981.png)

# 5. Consultas de Agrupamiento con Filtro Post-Agregación (HAVING)

### 5.1: Agrupamiento con condición de conteo HAVING (Forma 1 - WHERE)

Esta consulta realiza el cruce de tablas en la cláusula `FROM` y agrupa los registros consolidados por cada cliente. Utiliza la cláusula `HAVING` para filtrar los resultados **después** de haber calculado las funciones de agregación. Permite aislar únicamente a los clientes que cumplan una condición, como tener un número de pagos mayor o igual a 1. Descarta automáticamente a los usuarios que no alcanzaron el umbral fijado dentro del reporte financiero.

``` sql
SELECT c.id AS client_id,  c.name AS nombre_cliente,
 SUM(d.id) AS totalsuma, 
 COUNT(b.id) AS cuentatotal, 
 ROUND(AVG(d.id), 2) AS promedio  
FROM public.clients AS c, public.bookings AS b, public.departures AS d 
WHERE c.id = b.id 
  AND b.id = d.id 
  AND b.created_at BETWEEN '2026-03-01 00:00:00' AND '2026-03-30 23:59:59'
  AND b.status = 'active'
GROUP BY c.id, c.name 
HAVING COUNT(b.id) >= 1 
ORDER BY totalsuma DESC;
```

![](images/clipboard-3152601263.png)

### Creacion de elprocedure

![](images/clipboard-610027358.png)

![](images/clipboard-1111087581.png)

### 5.2: Agrupamiento con condición de conteo HAVING (Forma 2 - JOIN)

Esta sentencia une las tablas con la cláusula `JOIN ... ON`, filtra el rango de fechas en `WHERE` y agrupa mediante `GROUP BY`. Aplica la condición post-agregación `HAVING` para evaluar el resultado de funciones como `COUNT()` o `SUM()`. Es ideal para identificar clientes recurrentes o de alto valor que superen determinado volumen de compras en el mes. Muestra los resultados ordenados con `ORDER BY` de mayor a menor para destacar a los mejores clientes.

``` sql
SELECT c.id AS client_id, c.name AS nombre_cliente,
 SUM(d.id) AS totalsuma, 
 COUNT(b.id) AS cuentatotal, 
 ROUND(AVG(d.id), 2) AS promedio  
FROM public.clients AS c
JOIN public.bookings AS b ON c.id = b.id
JOIN public.departures AS d ON b.id = d.id
WHERE b.created_at BETWEEN '2026-03-01 00:00:00' AND '2026-03-30 23:59:59'
  AND b.status = 'active'
GROUP BY c.id, c.name 
HAVING COUNT(b.id) >= 1
ORDER BY totalsuma DESC;
```

![](images/clipboard-2223579043.png)

# 6. Subconsultas y Teoría de Conjuntos (A-B)

### 6.1: Clientes sin ventas en un rango usando subconsulta NOT IN (Forma 1)

Esta consulta aplica la teoría de conjuntos para extraer a los clientes registrados que no realizaron compras ($A - B$). Utiliza una subconsulta dentro de la cláusula `WHERE` con el operador `NOT IN` sobre la tabla de ventas o reservas. La subconsulta genera una lista con los IDs de clientes activos en el rango de fechas especificado para excluirlos. Es una técnica muy utilizada por el área de mercadeo para identificar e impactar a la cartera de clientes inactivos.

``` sql
SELECT * FROM public.clients AS c 
WHERE c.id NOT IN (
    SELECT b.id 
    FROM public.bookings AS b 
    JOIN public.payments AS p ON b.id = p.id 
    WHERE p.payment_date BETWEEN '2026-03-01 00:00:00' AND '2026-03-30 23:59:59'
);
```

![](images/clipboard-3374582082.png)

### Creacion de el procedure

![](images/clipboard-3336774259.png)

![](images/clipboard-4174276522.png)

### 6.2: Clientes sin ventas en un rango usando LEFT JOIN y IS NULL (Forma 2)

Esta sentencia realiza la resta de conjuntos ($A - B$) vinculando las tablas mediante un `LEFT JOIN` con filtro en las fechas. Mantiene a todos los clientes de la tabla izquierda y busca coincidencias en la tabla secundaria de reservas. Al aplicar la condición `WHERE B.id IS NULL`, conserva únicamente a los clientes que no tuvieron ningún cruce. Resulta ser una alternativa mucho más eficiente que `NOT IN` en términos de rendimiento para grandes volúmenes de datos.

``` sql
SELECT c.* FROM public.clients AS c 
LEFT JOIN (
    SELECT DISTINCT b.id 
    FROM public.bookings AS b 
    JOIN public.payments AS p ON b.id = p.id 
    WHERE p.payment_date BETWEEN '2026-03-01 00:00:00' AND '2026-03-30 23:59:59'
) AS v ON c.id = v.id 
WHERE v.id IS NULL;
```

![](images/clipboard-400852466.png)

# CREACION DE TRIGGERS

- Vamos a crear el triggers para la tabla travelers la cual me guarda informacion de los viajes y registro de los clientes.

### 1. Creamos la tabla travelers_audit

``` sql
CREATE TABLE public.travelers_audit (
    id SERIAL PRIMARY KEY,
    traveler_id INT,
    operation VARCHAR(10),
    name VARCHAR,
    description TEXT,
    status VARCHAR,
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

![](images/clipboard-198799917.png)

### 2. Creamos la funcion para el triggers

``` sql
CREATE OR REPLACE FUNCTION public.auditar_travelers()
RETURNS TRIGGER
AS $$
BEGIN

    IF TG_OP = 'INSERT' THEN

        INSERT INTO public.travelers_audit (
            traveler_id,
            operation,
            name,
            description,
            status
        )
        VALUES (
            NEW.id,
            'INSERT',
            NEW.name,
            NEW.description,
            NEW.status
        );

        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN

        INSERT INTO public.travelers_audit (
            traveler_id,
            operation,
            name,
            description,
            status
        )
        VALUES (
            NEW.id,
            'UPDATE',
            NEW.name,
            NEW.description,
            NEW.status
        );

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

        INSERT INTO public.travelers_audit (
            traveler_id,
            operation,
            name,
            description,
            status
        )
        VALUES (
            OLD.id,
            'DELETE',
            OLD.name,
            OLD.description,
            OLD.status
        );

        RETURN OLD;

    END IF;

END;
$$ LANGUAGE plpgsql;
```

![](images/clipboard-4085509621.png)

### 3.Creo el triggers

``` sql
CREATE TRIGGER trigger_auditar_travelers
AFTER INSERT OR UPDATE OR DELETE
ON public.travelers
FOR EACH ROW
EXECUTE FUNCTION public.auditar_travelers();
```

![](images/clipboard-1305219804.png)

### 4.Inserto nuevos valores a la tabla de travelers

![](images/clipboard-47803527.png)

### 5.Consulto en la nueva tabla de travelers_audit paar ver los cambios que se realizaron

![](images/clipboard-1913177972.png)

- Vamos a crear el triggers para la tabla vouchers la cual me guarda informacion de la tabla bookings y registro de los clientes.

### 1. Creamos la tabla vouchers_audit

``` sql
CREATE TABLE public.vouchers_audit (
    id SERIAL PRIMARY KEY,
    voucher_id INT,
    booking_id INT,
    operation VARCHAR(10),
    name VARCHAR,
    descriptions TEXT,
    status VARCHAR,
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

![](images/clipboard-2898739231.png)

### 2. Creamos la funcion para el triggers

``` sql
CREATE OR REPLACE FUNCTION public.auditar_vouchers()
RETURNS TRIGGER
AS $$
BEGIN

    IF TG_OP = 'INSERT' THEN

        INSERT INTO public.vouchers_audit (
            voucher_id,
            booking_id,
            operation,
            name,
            descriptions,
            status
        )
        VALUES (
            NEW.id,
            NEW.booking_id,
            'INSERT',
            NEW.name,
            NEW.descriptions,
            NEW.status
        );

        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN

        INSERT INTO public.vouchers_audit (
            voucher_id,
            booking_id,
            operation,
            name,
            descriptions,
            status
        )
        VALUES (
            NEW.id,
            NEW.booking_id,
            'UPDATE',
            NEW.name,
            NEW.descriptions,
            NEW.status
        );

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

        INSERT INTO public.vouchers_audit (
            voucher_id,
            booking_id,
            operation,
            name,
            descriptions,
            status
        )
        VALUES (
            OLD.id,
            OLD.booking_id,
            'DELETE',
            OLD.name,
            OLD.descriptions,
            OLD.status
        );

        RETURN OLD;

    END IF;

END;
$$ LANGUAGE plpgsql;
```

![](images/clipboard-1020707500.png)

### 3.Creo el triggers

``` sql
CREATE TRIGGER trigger_auditar_vouchers
AFTER INSERT OR UPDATE OR DELETE
ON public.vouchers
FOR EACH ROW
EXECUTE FUNCTION public.auditar_vouchers();
```

![](images/clipboard-2793406971.png)

### 4.Inserto nuevos valores a la tabla de vouchers

![](images/clipboard-561628825.png)

### 5.Consulto en la nueva tabla de vouchers_audit paar ver los cambios que se realizaron

![](images/clipboard-492846934.png)

- Vamos a crear el triggers para la tabla payments la cual me guarda informacion de la tabla bookings y registro de los clientes.

### 1. Creamos la tabla payments_audit

``` sql
CREATE TABLE public.payments_audit (
    id SERIAL PRIMARY KEY,
    payment_id INT,
    reference_type VARCHAR,
    booking_id INT,
    operation VARCHAR(10),
    method VARCHAR,
    amount NUMERIC,
    payment_date TIMESTAMP,
    status VARCHAR,
    reference_id INT,
    operation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

![](images/clipboard-12286280.png)

### 2. Creamos la funcion para el triggers

``` sql
CREATE OR REPLACE FUNCTION public.auditar_payments()
RETURNS TRIGGER
AS $$
BEGIN

    IF TG_OP = 'INSERT' THEN

        INSERT INTO public.payments_audit (
            payment_id,
            reference_type,
            booking_id,
            operation,
            method,
            amount,
            payment_date,
            status,
            reference_id
        )
        VALUES (
            NEW.id,
            NEW.reference_type,
            NEW.booking_id,
            'INSERT',
            NEW.method,
            NEW.amount,
            NEW.payment_date,
            NEW.status,
            NEW.reference_id
        );

        RETURN NEW;

    ELSIF TG_OP = 'UPDATE' THEN

        INSERT INTO public.payments_audit (
            payment_id,
            reference_type,
            booking_id,
            operation,
            method,
            amount,
            payment_date,
            status,
            reference_id
        )
        VALUES (
            NEW.id,
            NEW.reference_type,
            NEW.booking_id,
            'UPDATE',
            NEW.method,
            NEW.amount,
            NEW.payment_date,
            NEW.status,
            NEW.reference_id
        );

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN

        INSERT INTO public.payments_audit (
            payment_id,
            reference_type,
            booking_id,
            operation,
            method,
            amount,
            payment_date,
            status,
            reference_id
        )
        VALUES (
            OLD.id,
            OLD.reference_type,
            OLD.booking_id,
            'DELETE',
            OLD.method,
            OLD.amount,
            OLD.payment_date,
            OLD.status,
            OLD.reference_id
        );

        RETURN OLD;

    END IF;

END;
$$ LANGUAGE plpgsql;
```

![](images/clipboard-927965722.png)

### 3.Creo el triggers

``` sql
CREATE TRIGGER trigger_auditar_payments
AFTER INSERT OR UPDATE OR DELETE
ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.auditar_payments();
```

![](images/clipboard-998911783.png)

### 4.Inserto nuevos valores a la tabla de payments

![](images/clipboard-1919460696.png)

### 5.Consulto en la nueva tabla de payments_audit paar ver los cambios que se realizaron

# ![](images/clipboard-2984771441.png)

Conclusion: los **triggers** sirven para ejecutar automáticamente una acción en la base de datos cuando ocurre un evento como **INSERT, UPDATE o DELETE**. En este proyecto lo utilice para **auditar los cambios** en las tablas `travelers`, `vouchers` y `payments`, almacenando información sobre la operación realizada y los datos afectados. Esto permite llevar un mejor control de los registros, mantener un historial de cambios y facilitar la supervisión de la información sin que el usuario tenga que realizar estas acciones manualmente.

# Consultas en MySQL-Server

## Evidencia de los registros de cada tabla

![](images/clipboard-2654637116.png)

![![](images/clipboard-2255537884.png)](images/clipboard-487159671.png)

![![](images/clipboard-768630067.png)](images/clipboard-2464897793.png)

![![](images/clipboard-3805527615.png)](images/clipboard-3283409493.png)

![![](images/clipboard-303462504.png)](images/clipboard-1197245840.png)

# 1.Consultar datos de una tabla (Consultas Básicas)

### 1.1: Todos los campos de una tabla

``` sql
SELECT * FROM dbo.suppliers;
```

![](images/clipboard-1847128631.png)

### 1.2: Campos específicos

``` sql
SELECT   id, name,  created_atFROM dbo.vouchers ;
```

![](images/clipboard-1531791340.png)

### 1.3: Campos específicos usando alias en la tabla

``` sql
SELECT    v.name, v.name,  v.created_at,  v.descriptions 
FROM dbo.vouchers  AS v;
```

![](images/clipboard-882133987.png)

# 2. Consultar datos de varias tablas (Relaciones / Joins)

### 2.1: Relación mediante la cláusula WHERE (Forma 1)

``` sql
 SELECT * FROM dbo.clients, dbo.bookings, dbo.vouchers 
WHERE clients.id = bookings.client_id 
  AND bookings.id = vouchers.booking_id;
```

![](images/clipboard-1734300638.png)

### 2.2: Relación mediante WHERE con alias

``` sql
SELECT * FROM dbo.clients AS c, dbo.bookings AS b, dbo.vouchers AS v 
WHERE c.id = b.client_id 
  AND b.id = v.booking_id;
```

![](images/clipboard-3528385663.png)

### 2.3: Selección de campos específicos y comodín de tabla (V.\*) usando WHERE

``` sql
SELECT c.name,  c.email,  v.* FROM dbo.clients AS c, dbo.bookings AS b, dbo.vouchers AS v 
WHERE c.id = b.client_id 
AND b.id = v.booking_id;
```

![](images/clipboard-2562225168.png)

### 2.4: Relación mediante la cláusula JOIN ... ON (Forma 2)

``` sql
SELECT  c.name,  c.email, v.* FROM dbo.clients AS c 
INNER JOIN dbo.bookings AS b ON c.id = b.client_id 
INNER JOIN dbo.vouchers AS v ON b.id = v.booking_id;
```

![](images/clipboard-3238702931.png)

# 3. Condiciones y Filtros en las Consultas

### 3.1: Filtro por fecha en consulta multitabla (Forma 1 - WHERE)

``` sql
SELECT  c.name,  c.email, v.* FROM dbo.clients AS c, dbo.bookings AS b, dbo.vouchers AS v 
WHERE c.id = b.client_id 
AND b.id = v.booking_id 
AND v.created_at = '2026-05-28 11:45:00.000';
```

![](images/clipboard-3813404552.png)

### 3.2: Filtro por fecha en consulta multitabla (Forma 2 - JOIN)

``` sql
SELECT  c.name AS nombre_cliente,  c.email AS email_cliente, t.name,  t.name,  b.updated_at AS fecha_actualizacion 
FROM dbo.clients AS c 
INNER JOIN dbo.bookings AS b ON c.id = b.client_id 
INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
WHERE b.updated_at = '2026-02-20 11:00:00';
```

![](images/clipboard-2312908270.png)

### 3.3: Filtro por patrón con LIKE (comienza con 'j' o 'm')

``` sql
SELECT * FROM dbo.travelers AS t 
WHERE t.name LIKE 'm%' 
   OR t.name LIKE 'j%';
```

![](images/clipboard-1403433871.png)

### 3.4: Filtro por patrón con LIKE y CONCAT (contiene 'Diego ' o 'Silva')

``` sql
SELECT * FROM dbo.travelers AS t 
WHERE t.name LIKE '%Diego%' 
 OR t.name LIKE '%Silva%';
```

![](images/clipboard-3198453224.png)

### 3.5: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 1 - WHERE)

``` sql
SELECT c.name AS cliente, b.id AS reserva_id, d.id AS salida_id, t.name AS viajero_nombre,  v.id AS voucher_id 
FROM dbo.clients AS c, dbo.bookings AS b, dbo.departures AS d, dbo.travelers AS t, dbo.vouchers AS v 
WHERE c.id = b.client_id 
  AND d.id = b.departure_id 
  AND t.id = b.traveler_id 
  AND b.id = v.booking_id 
  AND b.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' 
ORDER BY b.created_at ASC;
```

![](images/clipboard-790228527.png)

### 3.6: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 2 - JOIN)

``` sql
SELECT c.name AS cliente, t.name AS viajero_nombre,  t.name AS viajero_apellido,  b.created_at AS fecha_reserva 
FROM dbo.clients AS c 
INNER JOIN dbo.bookings AS b ON c.id = b.client_id 
INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
WHERE b.created_at BETWEEN '2026-01-01 00:00:00' AND '2026-03-31 23:59:59' 
ORDER BY b.created_at ASC;
```

![](images/clipboard-2849449600.png)

# 4. Consultas de Agrupamiento (GROUP BY)

### 4.1: Suma, conteo y promedio por cliente en rango de fechas (Forma 1 - WHERE)

``` sql
SELECT b.client_id, 
COUNT(t.id) AS total_pasajeros_registrados 
FROM dbo.bookings AS b 
INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
GROUP BY b.client_id;
```

![](images/clipboard-1641510001.png)

### 4.2: Suma, conteo y promedio por cliente en rango de fechas (Forma 2 - JOIN)

``` sql
SELECT b.client_id, 
COUNT(t.id) AS total_pasajeros_registrados 
FROM dbo.bookings AS b 
INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
GROUP BY b.client_id;
```

![](images/clipboard-2984507267.png)

# 5 .Consultas de Agrupamiento con Filtro Post-Agregación (HAVING)

### 5.1: Agrupamiento con condición de conteo HAVING (Forma 1 - WHERE)

``` sql
SELECT c.id AS client_id, c.name AS nombre_cliente, 
COUNT(t.id) AS total_pasajeros 
FROM dbo.clients AS c, dbo.bookings AS b, dbo.travelers AS t 
WHERE c.id = b.client_id 
AND t.id = b.traveler_id 
GROUP BY c.id, c.name 
HAVING COUNT(t.id) >= 1 
ORDER BY total_pasajeros DESC;
```

![](images/clipboard-2158419463.png)

### 5.2: Agrupamiento con condición de conteo HAVING (Forma 2 - JOIN)

``` {.sql .sq}
SELECT   c.id AS client_id,  c.name AS nombre_cliente, 
COUNT(t.id) AS total_pasajeros 
FROM dbo.clients AS c 
INNER JOIN dbo.bookings AS b ON c.id = b.client_id 
INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
GROUP BY c.id, c.name 
HAVING COUNT(t.id) >= 1 
ORDER BY total_pasajeros DESC;
```

![](images/clipboard-951404611.png)

# 6. Subconsultas y Teoría de Conjuntos (A-B)

### 6.1: Clientes sin ventas en un rango usando subconsulta NOT IN (Forma 1)

``` sql
SELECT * FROM dbo.clients AS c 
WHERE c.id NOT IN (
    SELECT DISTINCT b.client_id 
    FROM dbo.bookings AS b 
    INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
    WHERE b.traveler_id IS NOT NULL
);
```

![](images/clipboard-368262423.png)

### 6.2: Clientes sin ventas en un rango usando LEFT JOIN y IS NULL (Forma 2)

``` sql
SELECT c.* FROM dbo.clients AS c 
LEFT JOIN (
    SELECT DISTINCT b.client_id 
    FROM dbo.bookings AS b 
    INNER JOIN dbo.travelers AS t ON t.id = b.traveler_id 
) AS t_sub ON c.id = t_sub.client_id 
WHERE t_sub.client_id IS NULL;
```

![](images/clipboard-1646379604.png)

# Consultas avanzadas en Oracle

## Evidencia de los registros de cada tabla

![](images/clipboard-1849090421.png)

![![](images/clipboard-1645507781.png)](images/clipboard-2104359377.png)

![![](images/clipboard-3000253599.png)](images/clipboard-3690301211.png)

![![](images/clipboard-3459086509.png)](images/clipboard-3623632094.png)

![![](images/clipboard-2172979299.png)](images/clipboard-2898357617.png)

# 1. Consultar datos de una tabla (Consultas Básicas)

### 1.1: Todos los campos de una tabla

``` sql
SELECT * FROM suppliers;
```

![](images/clipboard-3826630184.png)

### 1.2: Campos específicos

``` sql
SELECT  id, nit,  razon_social, phone, email 
FROM suppliers;
```

![](images/clipboard-1048353233.png)

### 1.3: Campos específicos usando alias en la tabla

``` sql
SELECT   s.id,  s.nit,  s.razon_social,  s.status 
FROM suppliers s;
```

![](images/clipboard-3815789114.png)

# 2. Consultar datos de varias tablas (Relaciones / Joins)

### 2.1: Relación mediante la cláusula WHERE (Forma 1)

``` sql
SELECT * FROM suppliers s, included_services ins, packages p 
WHERE s.id = ins.supplier_id 
 AND p.id = ins.package_id;
```

![](images/clipboard-614642835.png)

### 2.2: Relación mediante WHERE con alias

``` sql
SELECT * FROM packages p, departures d 
WHERE p.id = d.package_id;
```

![](images/clipboard-1607921149.png)

### 2.3: Selección de campos específicos y comodín de tabla (V.\*) usando WHERE

``` sql
SELECT p.name AS nombre_paquete,  p.description AS descripcion_paquete,  d.* FROM packages p, departures d 
WHERE p.id = d.package_id;
```

![](images/clipboard-3366465703.png)

### 2.4: Relación mediante la cláusula JOIN ... ON (Forma 2)

``` {.sql .sq}
SELECT  s.razon_social AS proveedor,  p.name AS paquete, ins.relation_data AS detalle_servicio 
FROM suppliers s 
JOIN included_services ins ON s.id = ins.supplier_id 
JOIN packages p ON p.id = ins.package_id;
```

![](images/clipboard-4004254774.png)

# 3. Condiciones y Filtros en las Consultas

### 3.1: Filtro por fecha en consulta multitabla (Forma 1 - WHERE)

``` sql
SELECT  p.name AS paquete,   d.name AS salida,   d.departure_date 
FROM packages p, departures d 
WHERE p.id = d.package_id 
  AND d.departure_date = TIMESTAMP '2026-11-21 22:45:00.000';
```

![](images/clipboard-3471898761.png)

### 3.2: Filtro por fecha en consulta multitabla (Forma 2 - JOIN)

``` sql
SELECT   s.razon_social,  p.name AS paquete,   ins.created_at 
FROM suppliers s 
JOIN included_services ins ON s.id = ins.supplier_id 
JOIN packages p ON p.id = ins.package_id 
WHERE ins.created_at = TIMESTAMP '2025-05-06 11:08:00.000';
```

![](images/clipboard-774844825.png)

### 3.3: Filtro por patrón con LIKE (comienza con 'a' o 't')

``` sql
SELECT * FROM suppliers s WHERE LOWER(s.razon_social) LIKE 'a%' 
   OR LOWER(s.razon_social) LIKE 't%';
```

![](images/clipboard-3389684813.png)

### 3.4: Filtro por patrón con LIKE y CONCAT (contiene 'Diego ' o 'negocios')

``` sql
SELECT * 
FROM packages p 
WHERE LOWER(p.name) LIKE '%diego%' 
   OR LOWER(p.description) LIKE '%negocios%';
```

![](images/clipboard-1771410062.png)

### 3.5: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 1 - WHERE)

``` {.sql .sq}
SELECT  p.name AS paquete,  d.name AS salida,   c.name AS motivo_cancelacion,   s.razon_social AS proveedor,   c.created_at AS fecha_cancelacion 
FROM packages p,   departures d, bookings b,  cancellations c, included_services ins, suppliers s 
WHERE p.id = d.package_id 
  AND d.id = b.departure_id 
  AND b.id = c.booking_id 
  AND p.id = ins.package_id 
  AND s.id = ins.supplier_id 
  AND c.created_at BETWEEN TIMESTAMP '2026-01-01 00:00:00' AND TIMESTAMP '2026-03-31 23:59:59' 
ORDER BY c.created_at ASC;
```

![](images/clipboard-2364949727.png)

### 3.6: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 2 - JOIN)

``` sql
SELECT  p.name AS paquete,  d.name AS salida,  d.departure_date,  d.capacity 
FROM packages p 
JOIN departures d ON p.id = d.package_id 
WHERE d.departure_date BETWEEN TIMESTAMP '2026-06-01 00:00:00' AND TIMESTAMP '2026-12-31 23:59:59' 
ORDER BY d.departure_date ASC;
```

![](images/clipboard-1578070925.png)

# 4. Consultas de Agrupamiento (GROUP BY)

### 4.1: Suma, conteo y promedio por cliente en rango de fechas (Forma 1 - WHERE)

``` sql
SELECT  p.id AS paquete_id, 
COUNT(ins.id) AS total_servicios_incluidos, 
AVG(d.capacity) AS capacidad_promedio_salidas 
FROM packages p 
JOIN included_services ins ON p.id = ins.package_id 
JOIN departures d ON p.id = d.package_id 
WHERE p.status = 'active' 
GROUP BY p.id;
```

![](images/clipboard-3311406578.png)

### 4.2: Suma, conteo y promedio por cliente en rango de fechas (Forma 2 - JOIN)

``` sql
SELECT s.id AS supplier_id,  s.razon_social,  s.nit, 
COUNT(ins.id) AS total_servicios_ofrecidos, 
COUNT(DISTINCT ins.package_id) AS total_paquetes_atendidos 
FROM suppliers s 
JOIN included_services ins ON s.id = ins.supplier_id 
WHERE s.status = 'active' 
GROUP BY s.id, s.razon_social, s.nit;
```

![](images/clipboard-2499697448.png)

# 5. Consultas de Agrupamiento con Filtro Post-Agregación (HAVING)

### 5.1: Agrupamiento con condición de conteo HAVING (Forma 1 - WHERE)

``` sql
SELECT s.id AS supplier_id,  s.razon_social, 
COUNT(ins.id) AS total_servicios 
FROM suppliers s, included_services ins 
WHERE s.id = ins.supplier_id 
  AND ins.created_at BETWEEN TIMESTAMP '2023-01-01 00:00:00' AND TIMESTAMP '2026-03-31 23:59:59' 
  AND ins.status = 'active' 
GROUP BY s.id, s.razon_social 
HAVING COUNT(ins.id) >= 1 
ORDER BY total_servicios DESC;
```

![](images/clipboard-2894892436.png)

### 5.2: Agrupamiento con condición de conteo HAVING (Forma 2 - JOIN)

``` sql
SELECT  p.id AS package_id,  p.name AS nombre_paquete, 
COUNT(d.id) AS total_salidas, 
SUM(d.capacity) AS capacidad_total 
FROM packages p 
JOIN departures d ON p.id = d.package_id 
WHERE d.status = 'active' 
GROUP BY p.id, p.name 
HAVING COUNT(d.id) >= 2
ORDER BY capacidad_total DESC;
```

![](images/clipboard-4004608208.png)

# 6. Subconsultas y Teoría de Conjuntos (A-B)

### 6.1: Clientes sin ventas en un rango usando subconsulta NOT IN (Forma 1)

``` sql
SELECT * FROM suppliers s 
WHERE s.id NOT IN (
    SELECT ins.supplier_id 
    FROM included_services ins 
    WHERE ins.created_at BETWEEN TIMESTAMP '2023-03-01 00:00:00' AND TIMESTAMP '2026-03-30 23:59:59'
);
```

![](images/clipboard-1573422763.png)

### 6.2: Clientes sin ventas en un rango usando LEFT JOIN y IS NULL (Forma 2)

``` {.sql .sq}
SELECT p.* FROM packages p 
LEFT JOIN (
    SELECT DISTINCT d.package_id 
    FROM departures d 
    WHERE d.departure_date >= TIMESTAMP '2026-01-01 00:00:00'
) d_sub ON p.id = d_sub.package_id 
WHERE d_sub.package_id IS NULL;
```

![](images/clipboard-660293381.png)
