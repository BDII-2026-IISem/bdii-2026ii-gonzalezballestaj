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
