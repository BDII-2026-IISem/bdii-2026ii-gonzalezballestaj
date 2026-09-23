# Consultas avanzadas en MYSQL

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

![](images/clipboard-321902976.png)

### 1.2: Campos específicos

``` sql
SELECT id,name,phone,document_number   FROM clients;
```

![](images/clipboard-1096190889.png)

### 1.3: Campos específicos usando alias en la tabla

``` sql
SELECT C.name, C.document_number , C.phone  FROM clients AS C;
```

![](images/clipboard-3895929929.png)

# 2. Consultar datos de varias tablas (Relaciones / Joins)

### 2.1: Relación mediante la cláusula WHERE (Forma 1)

``` sql
SELECT * FROM clients, packages  WHERE clients.id = packages.id;
```

![](images/clipboard-2028166054.png)

### 2.2: Relación mediante WHERE con alias

``` sql
SELECT * FROM clients AS C, packages AS P WHERE C.id = P.id;
```

![](images/clipboard-3741076282.png)

### 2.3: Selección de campos específicos y comodín de tabla (`V.*`) usando WHERE

``` sql
SELECT C.name, C.email, P.* FROM clients AS C, packages  AS P WHERE C.id = P.id;
```

![](images/clipboard-2058742056.png)

### 2.4: Relación mediante la cláusula JOIN ... ON (Forma 2)

``` sql
SELECT C.name, C.email, B.* FROM clients AS C 
JOIN bookings AS B ON (C.id = B.client_id);
```

![](images/clipboard-1566588778.png)

# 3. Condiciones y Filtros en las Consultas

### 3.1: Filtro por fecha en consulta multitabla (Forma 1 - WHERE)

``` sql
SELECT C.name, C.email, B.* FROM clients AS C, bookings  AS B 
WHERE C.id = B.client_id AND B.created_at  = "2026-02-17 11:00:00";
```

![](images/clipboard-309924258.png)

### 3.2: Filtro por fecha en consulta multitabla (Forma 2 - JOIN)

``` sql
SELECT C.name, C.email, B.* 
FROM clients AS C JOIN bookings  AS B ON (C.id = B.id) 
WHERE B.updated_at  = "2026-02-20 11:00:00";
```

![](images/clipboard-3476490450.png)

### 3.3: Filtro por patrón con `LIKE` (comienza con 'j' o 'm')

``` sql
SELECT * FROM clients AS C 
WHERE C.name LIKE 'm%' OR C.name LIKE 'j%';
```

![](images/clipboard-2724522030.png)

### 3.4: Filtro por patrón con `LIKE` y `CONCAT` (contiene 'Diego Silva' o 'diego.silva58\@gmail.com')

``` sql
SELECT * FROM clients AS C 
WHERE C.name LIKE '%Diego Silva%' or C.email LIKE '%diego.silva58@gmail.com%';
```

![](images/clipboard-1566591675.png)

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

![](images/clipboard-2859133064.png)

### 3.6: Consulta entre 4 tablas unidas con rango de fechas y ordenamiento (Forma 2 - JOIN)

``` sql
SELECT * 
FROM clients AS C 
JOIN bookings AS B ON (C.id = B.client_id) 
JOIN vouchers AS V ON (B.id = V.booking_id) 
WHERE B.created_at BETWEEN "2026-02-17 11:00:00" AND "2026-05-16 12:00:00" 
ORDER BY B.created_at  ASC;
```

![](images/clipboard-2272254038.png)

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

![](images/clipboard-1027377177.png)

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
