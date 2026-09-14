# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO MYSQL

## CREACION DE TABLAS POR CONSOLA EN DBEABER (MYSQL)

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-2996954593.png)

``` sql
USE wayuutravel;

CREATE TABLE cliente (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    document_type VARCHAR(30) NOT NULL,
    document_number VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. CREACION DE LA TABLA PACKGES

![](images/clipboard-3584741441.png)

``` sql
CREATE TABLE packages (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. CREACION DE LA TABLA DEPARTURES

### ![](images/clipboard-3817368070.png) 

``` SQL
CREATE TABLE departures (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    departure_date DATETIME NOT NULL,
    capacity INT NOT NULL,
    available_capacity INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id)
);
```

### 4. CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-916313055.png)

``` SQL
CREATE TABLE suppliers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nit VARCHAR(100) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

### 5. CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-2949639763.png)

``` SQL
CREATE TABLE included_services (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    supplier_id INT NOT NULL,
    relation_data VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
```

### 6. CREACION DE LA TABLA BOOKINGS

![](images/clipboard-1197054540.png)

``` SQL
CREATE TABLE bookings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    departure_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME,
    observations VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
