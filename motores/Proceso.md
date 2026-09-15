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

``` sql
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

``` sql
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

``` sql
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

``` sql
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

### 7. CREACION DE LA TABLA TRAVELERS

![](images/clipboard-2063264671.png)

``` sql
  CREATE TABLE travelers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 8. CREACION DE LA TABLA PAYMENTS

![](images/clipboard-1370832080.png)

``` sql
CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 9. CREACION DE LA TABLA VOUCHERS

![](images/clipboard-2127321086.png)

``` sql
CREATE TABLE vouchers (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 10. CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-2060199281.png)

``` sql
CREATE TABLE cancellations (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO MYSQL

## CREACION DE TABLAS VISUALMENTE EN WORKBENCH (MYSQL)

### 1.1 CREACION DE LA TABLA CLIENTS

![](images/clipboard-1343015768.png)

![](images/clipboard-1854287258.png)

### 2.2 CREACION DE LA TABLA PACKGES

![](images/clipboard-3237409082.png)

![](images/clipboard-2482493912.png)

### 3.3 CREACION DE LA TABLA DEPARTURES

![](images/clipboard-3270130399.png)

![](images/clipboard-158725013.png)

### 4.4  CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-3469831276.png)

![](images/clipboard-405023470.png)

### 5.5 CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-624732266.png)

![](images/clipboard-1209932386.png)

### 6.6 CREACION DE LA TABLA BOOKINGS

![](images/clipboard-2855572543.png)

![](images/clipboard-635019324.png)

### 7.7 CREACION DE LA TABLA TRAVELERS

![](images/clipboard-2039037022.png)

![](images/clipboard-2119614780.png)

### 8.8 CREACION DE LA TABLA PAYMENTS 

![](images/clipboard-3759498152.png)

![](images/clipboard-311367302.png)

### 9.9 CREACION DE LA TABLA VOUCHERS

![](images/clipboard-1327982059.png)

![](images/clipboard-846379830.png)

### 10.10 CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-4011018005.png)

![](images/clipboard-2832411162.png)

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO POSTGRE

## CREACION DE TABLAS POR CONSOLA EN DBEABER (POSTGRE)

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-679097950.png)

``` SQL
CREATE TABLE clients (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    document VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. CREACION DE LA TABLA PACKGES

![](images/clipboard-2336064163.png)

``` sql
CREATE TABLE packages (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 3. CREACION DE LA TABLA DEPARTURES

![](images/clipboard-1011657939.png)

``` sql
CREATE TABLE departures (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    package_id INT NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    capacity INT NOT NULL,
    available_capacity INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 

### 4. CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-3750965860.png)

``` sql
CREATE TABLE suppliers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nit VARCHAR(100) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 5. CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-2839224848.png)

``` sql
CREATE TABLE included_services (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    package_id INT NOT NULL,
    supplier_id INT NOT NULL,
    relation_data VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 6. CREACION DE LA TABLA BOOKINGS

![](images/clipboard-908690370.png)

``` sql
CREATE TABLE bookings (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id INT NOT NULL,
    departure_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    observations VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
