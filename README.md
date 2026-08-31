# Instalación de Motores de Bases de Datos con Docker en WSL

Este documento presenta el procedimiento para configurar y ejecutar **cuatro sistemas gestores de bases de datos relacionales** mediante Docker dentro de un entorno WSL 2. Se describen los requisitos necesarios, la organización de los directorios y los pasos básicos para poner en funcionamiento cada motor.

---

##  Requisitos necesarios

Antes de comenzar con la instalación, es necesario contar con los siguientes elementos:

* **Docker** instalado y funcionando correctamente.
* **Docker Compose** disponible para administrar los servicios.
* **WSL 2** con una distribución Linux configurada.
* Una estructura de carpetas organizada para almacenar los servicios y conservar la información de las bases de datos.

Se recomienda utilizar una estructura similar a la siguiente:

```text
~/ia-lab/
├── data/
│   ├── mysql/
│   ├── postgres/
│   ├── mssql/
│   └── oracle/
└── services/
    └── motores-bd/
```

La carpeta `data` permite mantener los datos de los motores aunque los contenedores sean detenidos o recreados.

---

##  Metodología de instalación

La configuración de cada motor sigue un procedimiento similar. Primero se crea un directorio exclusivo para el servicio, posteriormente se establecen las variables de entorno y la configuración de Docker Compose.

Una vez definidos los archivos necesarios, se inicia el servicio mediante:

```bash
docker compose up -d
```

El parámetro `-d` permite ejecutar el contenedor en segundo plano.

---

#  Configuración de los motores de bases de datos

## 1. MySQL

**MySQL** es un sistema gestor de bases de datos relacionales ampliamente utilizado, especialmente en aplicaciones web y sistemas que requieren almacenar información estructurada.

### Paso 1. Crear el directorio del servicio

```bash
mkdir -p ~/ia-lab/services/motores-bd/mysql
cd ~/ia-lab/services/motores-bd/mysql
```

### Paso 2. Configurar las variables de entorno

Crear el archivo `.env`:

```bash
nano .env
```

En este archivo se pueden establecer valores como el usuario, contraseña, nombre de la base de datos y demás parámetros necesarios.

### Paso 3. Crear la configuración de Docker Compose

```bash
nano docker-compose.yml
```

Aquí se define la imagen de MySQL, el nombre del contenedor, los puertos, las variables de entorno y el volumen utilizado para conservar los datos.

### Paso 4. Crear la documentación del servicio

```bash
nano README.md
```

Este archivo puede utilizarse para documentar las características y comandos específicos utilizados en la configuración de MySQL.

### Paso 5. Iniciar el contenedor

```bash
docker compose up -d
```

### Paso 6. Acceder a MySQL desde el contenedor

```bash
docker exec -it mysql-server mysql -u root -p
```

Después de ejecutar el comando, se solicitará la contraseña configurada en el archivo `.env`.

### Paso 7. Crear la base de datos

Una vez establecida la conexión, se puede crear la base de datos utilizando las instrucciones SQL correspondientes.

### Paso 8. Realizar una copia de seguridad

Se recomienda generar periódicamente respaldos de la información almacenada para evitar pérdidas de datos.

### Paso 9. Conectar desde DBeaver

Para realizar la conexión mediante **DBeaver**, se deben utilizar los datos definidos en la configuración:

* Host
* Puerto
* Usuario
* Contraseña
* Nombre de la base de datos

---

# 2. PostgreSQL

**PostgreSQL** es un sistema gestor de bases de datos relacional de código abierto, conocido por su estabilidad, extensibilidad y capacidad para trabajar con grandes cantidades de información.

### Paso 1. Crear la carpeta del servicio

```bash
mkdir -p ~/ia-lab/services/motores-bd/postgres
cd ~/ia-lab/services/motores-bd/postgres
```

### Paso 2. Crear el archivo de variables

```bash
nano .env
```

En este archivo se establecen las credenciales y demás parámetros utilizados por PostgreSQL.

### Paso 3. Crear `docker-compose.yml`

```bash
nano docker-compose.yml
```

En este archivo se especifican la imagen de PostgreSQL, el puerto de conexión, las credenciales y el almacenamiento persistente.

### Paso 4. Crear el README del servicio

```bash
nano README.md
```

### Paso 5. Levantar el contenedor

```bash
docker compose up -d
```

### Paso 6. Ingresar al servidor PostgreSQL

```bash
sudo docker exec -it postgres-server psql -U postgres -d wayuutravel

Este comando permite ingresar directamente al cliente `psql` dentro del contenedor.

### Paso 7. Crear o administrar la base de datos

Desde PostgreSQL se pueden ejecutar las instrucciones SQL necesarias para crear tablas, usuarios, esquemas y demás elementos de la base de datos.

### Paso 8. Generar un respaldo

Se debe realizar una copia de seguridad de la información para facilitar su recuperación en caso de algún inconveniente.

### Paso 9. Conectar mediante DBeaver

La conexión externa puede realizarse utilizando:

* Host
* Puerto
* Usuario
* Contraseña
* Base de datos

---

# 3. Microsoft SQL Server

**Microsoft SQL Server** es un sistema gestor de bases de datos desarrollado por Microsoft y utilizado principalmente en aplicaciones empresariales y sistemas que requieren una administración avanzada de información.

### Paso 1. Crear el directorio

```bash
mkdir -p ~/ia-lab/services/motores-bd/mssql
cd ~/ia-lab/services/motores-bd/mssql
```

### Paso 2. Crear las variables de entorno

```bash
nano .env
```

Aquí se pueden establecer la contraseña del usuario administrador, el nombre de la edición y otros parámetros necesarios.

### Paso 3. Crear el archivo Compose

```bash
nano docker-compose.yml
```

En este archivo se configura el contenedor de SQL Server, sus puertos, variables y almacenamiento.

### Paso 4. Crear el archivo de documentación

```bash
nano README.md
```

### Paso 5. Ejecutar el servicio

```bash
docker compose up -d
```

### Paso 6. Acceder mediante SQLCMD

```bash
sudo docker exec -it mssql-server /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P 'TU_CONTRASEÑA' -C
```

> Se recomienda utilizar una contraseña definida mediante variables de entorno en lugar de escribirla directamente en el comando.

### Paso 7. Crear la base de datos

Una vez conectado mediante `sqlcmd`, se pueden ejecutar las sentencias SQL necesarias para crear y administrar las bases de datos.

### Paso 8. Crear un respaldo

Es importante realizar copias de seguridad de las bases de datos para garantizar la recuperación de la información.

### Paso 9. Configurar DBeaver

Para conectarse desde DBeaver se deben proporcionar los datos correspondientes al servidor:

* Host
* Puerto
* Usuario
* Contraseña
* Base de datos

---

# 4. Oracle Database Express Edition

**Oracle Database Express Edition (XE)** es una edición de Oracle Database orientada al aprendizaje, desarrollo y proyectos que requieren las funcionalidades principales del motor Oracle.

### Paso 1. Crear la carpeta de trabajo

```bash
mkdir -p ~/ia-lab/services/motores-bd/oracle
cd ~/ia-lab/services/motores-bd/oracle
```

### Paso 2. Crear el archivo `.env`

```bash
nano .env
```

En este archivo se pueden definir las credenciales y parámetros utilizados para ejecutar Oracle.

### Paso 3. Crear `docker-compose.yml`

```bash
nano docker-compose.yml
```

Aquí se establece la configuración del contenedor, los puertos, las variables de entorno y el almacenamiento persistente.

### Paso 4. Crear la documentación

```bash
nano README.md
```

### Paso 5. Iniciar Oracle

```bash
docker compose up -d
```

### Paso 6. Acceder a Oracle desde el contenedor

```bash
docker exec -it oracle-server sqlplus system/TU_CONTRASEÑA@//localhost:1521/wayuutravel
```

El comando permite establecer una conexión con Oracle utilizando `SQL*Plus`.

### Paso 7. Crear la base de datos o esquema

Una vez establecida la conexión, se pueden crear usuarios, esquemas, tablas y demás objetos necesarios para el proyecto.

### Paso 8. Realizar el respaldo

Oracle permite utilizar herramientas como **Data Pump** para generar copias de seguridad de esquemas y datos.

### Paso 9. Conectar desde DBeaver

Para establecer la conexión se deben configurar:

* Host
* Puerto
* Usuario
* Contraseña
* Service Name

---

#  Verificación de los contenedores

Después de instalar los diferentes motores, se puede comprobar el estado de los contenedores mediante:

```bash
docker ps
```

También es posible consultar todos los contenedores, incluidos aquellos que se encuentran detenidos:

```bash
docker ps -a
```

Para revisar los registros de un servicio específico:

```bash
docker logs nombre-del-contenedor
```

Por ejemplo:

```bash
docker logs mysql-server
```

---

#  Organización final del proyecto
Al finalizar la configuración, la estructura general puede quedar organizada de la siguiente manera:

```text
~/ia-lab/
│
├── data/
│   ├── mysql/
│   ├── postgres/
│   ├── mssql/
│   └── oracle/
│
└── services/
    └── motores-bd/
        ├── mysql/
        │   ├── .env
        │   ├── docker-compose.yml
        │   └── README.md
        │
        ├── postgres/
        │   ├── .env
        │   ├── docker-compose.yml
        │   └── README.md
        │
        ├── mssql/
        │   ├── .env
        │   ├── docker-compose.yml
        │   └── README.md
        │
        └── oracle/
            ├── .env
            ├── docker-compose.yml
            └── README.md
```

---

#  Presentado por

**JAIME RAFAEL GONZALEZ**

**Estudiante de Ingeniería de Sistemas**

**Universidad de La Guajira**
