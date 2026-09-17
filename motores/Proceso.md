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

### 2. CREACION DE LA TABLA PACKAGES

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

### 2.2 CREACION DE LA TABLA PACKAGES

![](images/clipboard-3237409082.png)

![](images/clipboard-2482493912.png)

### 3.3 CREACION DE LA TABLA DEPARTURES

![](images/clipboard-3270130399.png)

![](images/clipboard-158725013.png)

### 4.4 CREACION DE LA TABLA SUPPLIERS

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

## DIAGRAMA ENTIDAD-RELACION DE LAS TABLAS DE LA BASE DE DATOS (WAYUUTRAVEL) MYSQL

![](images/clipboard-3970777423.png)

# xCREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO POSTGRE

## CREACION DE TABLAS POR CONSOLA EN DBEABER (POSTGRE)

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-679097950.png)

``` sql
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

### 2. CREACION DE LA TABLA PACKAGES

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

### 7. CREACION DE LA TABLA TRAVELERS

![](images/clipboard-3609447196.png)

``` sql
CREATE TABLE travelers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 8. CREACION DE LA TABLA PAYMENTS

![](images/clipboard-967317882.png)

``` sql
CREATE TABLE payments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT NOT NULL,
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 9. CREACION DE LA TABLA VOUCHERS

![](images/clipboard-647953970.png)

``` sql
CREATE TABLE vouchers (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 10. CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-1458760851.png)

``` sql
CREATE TABLE cancellations (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    booking_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO POSTGRE

## CREACION DE TABLAS VISUALMENTE EN PGADMIN (POSTGRE)

### 1.1 CREACION DE LA TABLA CLIENTS

![](images/clipboard-2256769397.png)

![](images/clipboard-2469146774.png)

### 2.2 CREACION DE LA TABLA PACKAGES

![](images/clipboard-2469893943.png)

![](images/clipboard-3403510277.png)

### 3.3 CREACION DE LA TABLA DEPARTURES

![](images/clipboard-2960413376.png)

![](images/clipboard-3133591742.png)

### 4.4 CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-3133591742.png)![](images/clipboard-47416835.png)

### 5.5 CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-1205398726.png)

![](images/clipboard-4096540522.png)

### 6.6 CREACION DE LA TABLA BOOKINGS

![![](images/clipboard-3915899921.png)](images/clipboard-2317135876.png)

### 7.7 CREACION DE LA TABLA TRAVELERS

![](images/clipboard-3575868501.png)

![](images/clipboard-3459926181.png)

### 8.8 CREACION DE LA TABLA PAYMENTS

![](images/clipboard-1579975355.png)

![](images/clipboard-772565754.png)

### 9.9 CREACION DE LA TABLA VOUCHERS

![![](images/clipboard-797820722.png)](images/clipboard-872950822.png)

### 10.10 CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-4236275177.png)

![](images/clipboard-903196227.png)

## DIAGRAMA ENTIDAD-RELACION DE LAS TABLAS DE LA BASE DE DATOS (WAYUUTRAVEL) POSTGRE

![](images/clipboard-3806329115.png)

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO MYSQL-SERVER

## CREACION DE TABLAS POR CONSOLA EN DBEAVER (MYSQL-SERVER)

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-1928248391.png)

``` sql
CREATE TABLE clients (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    document VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 2. CREACION DE LA TABLA PACKAGES

![](images/clipboard-809885854.png)

``` sql

CREATE TABLE packages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 3. CREACION DE LA TABLA DEPARTURES

![](images/clipboard-1361951238.png)

``` sql
CREATE TABLE departures (
    id INT IDENTITY(1,1) PRIMARY KEY,
    package_id INT NOT NULL REFERENCES packages(id),
    departure_date DATETIME2 NOT NULL,
    capacity INT NOT NULL,
    available_capacity INT NOT NULL,
    is_active BIT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 4. CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-203048720.png)

``` sql
CREATE TABLE suppliers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nit VARCHAR(100) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 5. CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-766293714.png)

``` sql
CREATE TABLE included_services (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    package_id INT NOT NULL REFERENCES packages(id),
    supplier_id INT NOT NULL REFERENCES suppliers(id),
    relation_data VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 6. CREACION DE LA TABLA BOOKINGS

![](images/clipboard-3394303976.png)

``` sql
CREATE TABLE bookings (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id),
    departure_id INT NOT NULL REFERENCES departures(id),
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2,
    observations VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 7. CREACION DE LA TABLA TRAVELERS

![](images/clipboard-2190532825.png)

``` sql
CREATE TABLE travelers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 8. CREACION DE LA TABLA PAYMENTS

![](images/clipboard-2079734557.png)

``` sql
CREATE TABLE payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    method VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 9. CREACION DE LA TABLA VOUCHERS

![](images/clipboard-2989382658.png)

``` sql
CREATE TABLE vouchers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

### 10. CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-1417119238.png)

``` sql
CREATE TABLE cancellations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    name VARCHAR(150) NOT NULL,
    description VARCHAR(250),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
```

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO MYSQL-SERVER

## CREACION DE TABLAS VISUALMENTE EN SQL SERVER (MYSQL-SERVER)

### 1.1 CREACION DE LA TABLA CLIENTS

![](images/clipboard-3006707970.png)

![](images/clipboard-809966056.png)

### 2.2 CREACION DE LA TABLA PACKAGES

![](images/clipboard-3541759479.png)

![](images/clipboard-2701260406.png)

### 3.3 CREACION DE LA TABLA DEPARTURES

![](images/clipboard-1493769566.png)

![](images/clipboard-2596540791.png)

### 4.4 CREACION DE LA TABLA SUPPLIERS

![![](images/clipboard-130576381.png)](images/clipboard-2577585410.png)

### 5.5 CREACION DE LA TABLA INCLUDED_SERVICES

![![](images/clipboard-241297228.png)](images/clipboard-81693572.png)

### 6.6 CREACION DE LA TABLA BOOKINGS

![![](images/clipboard-3180547654.png)](images/clipboard-2858328857.png)

### 7.7 CREACION DE LA TABLA TRAVELERS

![![](images/clipboard-843880461.png)](images/clipboard-2950560342.png)

### 8.8 CREACION DE LA TABLA PAYMENTS

![](images/clipboard-3442016329.png)

![](images/clipboard-2418127969.png)

### 9.9 CREACION DE LA TABLA VOUCHERS

![![](images/clipboard-1672446729.png)](images/clipboard-3898886429.png)

### 10.10 CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-1169841503.png)

![](images/clipboard-165455643.png)

## DIAGRAMA ENTIDAD-RELACION DE LAS TABLAS DE LA BASE DE DATOS (WAYUUTRAVEL) SQL-SERVER

![](images/clipboard-3195666160.png)

# CREACION DE TABLAS DE LA BASE DE DATOS WAYUUTRAVEL EN EL MOTRO MYSQL-SERVER

## CREACION DE TABLAS POR CONSOLA EN DBEAVER (ORACLE)

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-3118293154.png)

``` sql
CREATE TABLE clients (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    document_type VARCHAR2(30) NOT NULL,
    document_number VARCHAR2(30) NOT NULL,
    name VARCHAR2(150) NOT NULL,
    phone VARCHAR2(30),
    email VARCHAR2(150),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT pk_clients PRIMARY KEY (id),
    CONSTRAINT uq_clients_document_number UNIQUE (document_number),
    CONSTRAINT uq_clients_email UNIQUE (email),
    CONSTRAINT chk_clients_status CHECK (status IN ('active', 'inactive'))
);
```

### 2. CREACION DE LA TABLA PACKAGES

![](images/clipboard-1524120105.png)

``` sql
CREATE TABLE packages (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR2(150) NOT NULL,
    description VARCHAR2(255),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_packages PRIMARY KEY (id),
    CONSTRAINT chk_packages_status CHECK (status IN ('active', 'inactive'))
);
```

### 3. CREACION DE LA TABLA DEPARTURES

![](images/clipboard-844880942.png)

``` sql
CREATE TABLE departures (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR2(150) NOT NULL,
    description VARCHAR2(255),
    package_id NUMBER NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    capacity NUMBER NOT NULL,
    available_capacity NUMBER NOT NULL,
    is_active NUMBER(1) NOT NULL,
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_departures PRIMARY KEY (id),
    CONSTRAINT fk_departures_package FOREIGN KEY (package_id) REFERENCES packages(id),
    CONSTRAINT chk_departures_status CHECK (status IN ('active', 'inactive')),
    CONSTRAINT chk_departures_capacity CHECK (capacity > 0),
    CONSTRAINT chk_departures_avail_cap CHECK (available_capacity >= 0 AND available_capacity <= capacity),
    CONSTRAINT chk_departures_is_active CHECK (is_active IN (0, 1))
);
```

### 4. CREACION DE LA TABLA SUPPLIERS

![](images/clipboard-980527899.png)

``` sql
CREATE TABLE suppliers (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    nit VARCHAR2(100) NOT NULL,
    razon_social VARCHAR2(255) NOT NULL,
    phone VARCHAR2(30),
    email VARCHAR2(150),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_suppliers PRIMARY KEY (id),
    CONSTRAINT uq_suppliers_nit UNIQUE (nit),
    CONSTRAINT uq_suppliers_email UNIQUE (email),
    CONSTRAINT chk_suppliers_status CHECK (status IN ('active', 'inactive'))
);
```

### 5. CREACION DE LA TABLA INCLUDED_SERVICES

![](images/clipboard-983786331.png)

``` sql
CREATE TABLE included_services (
    id NUMBER(19) GENERATED BY DEFAULT AS IDENTITY,
    package_id NUMBER NOT NULL,
    supplier_id NUMBER NOT NULL,
    relation_data VARCHAR2(255),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_included_services PRIMARY KEY (id),
    CONSTRAINT fk_inc_serv_package FOREIGN KEY (package_id) REFERENCES packages(id),
    CONSTRAINT fk_inc_serv_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT chk_inc_serv_status CHECK (status IN ('active', 'inactive'))
);
```

### 6. CREACION DE LA TABLA ITRAVELERS

![](images/clipboard-317610843.png)

``` SQL

CREATE TABLE travelers (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR2(150) NOT NULL,
    description VARCHAR2(255),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_travelers PRIMARY KEY (id),
    CONSTRAINT chk_travelers_status CHECK (status IN ('active', 'inactive'))
);
```

### 7. CREACION DE LA TABLA BOOKINGS

![](images/clipboard-1981648361.png)

``` sql
CREATE TABLE bookings (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    client_id NUMBER NOT NULL,
    departure_id NUMBER NOT NULL,
    traveler_id NUMBER NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    observations VARCHAR2(225),
    status VARCHAR2(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_bookings PRIMARY KEY (id),
    CONSTRAINT fk_bookings_client FOREIGN KEY (client_id) REFERENCES clients(id),
    CONSTRAINT fk_bookings_departure FOREIGN KEY (departure_id) REFERENCES departures(id),
    CONSTRAINT fk_bookings_traveler FOREIGN KEY (traveler_id) REFERENCES travelers(id),
    CONSTRAINT chk_bookings_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    CONSTRAINT chk_bookings_dates CHECK (end_date >= start_date)
);
```

### 8. CREACION DE LA TABLA PAYMENTS

![](images/clipboard-2663591487.png)

``` sql
CREATE TABLE payments (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    booking_id NUMBER NOT NULL,
    method VARCHAR2(50) NOT NULL,
    amount NUMBER(12,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_payments PRIMARY KEY (id),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT chk_payments_status CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
    CONSTRAINT chk_payments_amount CHECK (amount > 0)
);
```

### 9. CREACION DE LA TABLA VOUCHERS

![](images/clipboard-600012217.png)

``` sql
CREATE TABLE vouchers (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    booking_id NUMBER NOT NULL,
    name VARCHAR2(150) NOT NULL,
    descriptions VARCHAR2(250),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_vouchers PRIMARY KEY (id),
    CONSTRAINT fk_vouchers_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT chk_vouchers_status CHECK (status IN ('active', 'inactive'))
);
```

### 10. CREACION DE LA TABLA CANCELLATIONS

![](images/clipboard-3374902884.png)

``` sql
CREATE TABLE cancellations (
    id NUMBER GENERATED BY DEFAULT AS IDENTITY,
    booking_id NUMBER NOT NULL,
    name VARCHAR2(150) NOT NULL,
    descriptions VARCHAR2(250),
    status VARCHAR2(10) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT pk_cancellations PRIMARY KEY (id),
    CONSTRAINT fk_cancellations_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT chk_cancellations_status CHECK (status IN ('active', 'inactive'))
);
```

## DIAGRAMA ENTIDAD-RELACION DE LAS TABLAS DE LA BASE DE DATOS (WAYUUTRAVEL) ORACLE

![](images/clipboard-3638277764.png)

## CREACION DE TABLAS POR LA PARTE VISUAL EN ORACLE SQL DEVELOPER

### 1. CREACION DE LA TABLA CLIENTS

![](images/clipboard-3015201699.png)

![](images/clipboard-2845399445.png)
