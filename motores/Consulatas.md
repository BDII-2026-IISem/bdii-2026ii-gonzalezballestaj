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

###  1.3: Campos específicos usando alias en la tabla

``` sql
SELECT C.name, C.document_number , C.phone  FROM clients AS C;
```

![](images/clipboard-3895929929.png)
