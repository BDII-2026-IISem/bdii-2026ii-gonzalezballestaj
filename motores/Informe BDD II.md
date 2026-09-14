# Instalación y paso a paso de modelos de base de datos



## Verificación inicial en WSL
Primero verifico si tengo instalado lo necesario usando los siguientes comandos en WSL.

```bash
sudo systemctl is-active docker
```
```bash
docker compose version
```
```bash
docker --version
```


Registro: Al ejecutar los tres comandos, comprobé que Docker estaba instalado y activo, y que las versiones se reconocían correctamente.

Resultado y evidencia (imagen):

![](imagenes/img1.png)



##  Instalación en caso de que no esté instalado
En caso de que Docker no esté instalado, ejecuto los siguientes comandos en WSL:

### Actualizamos los paquetes

```bash
sudo apt update
sudo apt-get update
```
## Instalo los requisitos para Docker

```bash
sudo apt-get install ca-certificates curl
```
## Agrego la llave oficial de Docker
```bash
# Add Docker's official GPG key:
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

## Agrego el repositorio de Docker

```bash
# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
## Instalo Docker Compose y compruebo la instalación
``` bash
sudo systemctl stop unattended-upgrades
sudo apt install docker-compose-plugin
sudo docker --version
sudo docker compose version
```
## 2. Paso 1: Crear carpetas
Abro mi terminal WSL y ejecuto los siguientes comandos para crear las carpetas de los tres motores de base de datos: Verifico la estructura que creé:
```bash
cd ia-lab
tree
```
La estructura que debo obtener es:

```bash
~/ia-lab/
├── services/
│   └── motores-bd/
│       ├── mysql/
│       ├── postgres/
│       ├── mssql/
└── data/
  ├── mysql/
  ├── postgres/
  └── mssql/
  ```

![](imagenes/img2.png)

Registro:

Apliqué los comandos en WSL y realicé el paso de creación de carpetas. El resultado fue tal y como se esperaba en el diagrama, porque se crearon correctamente las carpetas data y services, junto con las carpetas de MySQL, PostgreSQL y MS SQL Server.

## 3. Paso 2: Crear la red Docker compartida
Creo una red Docker compartida para que todos los contenedores puedan comunicarse entre sí. Ejecuto este comando en mi terminal WSL:
```bash
docker network inspect ia-lab-network >/dev/null 2>&1 || docker network create ia-lab-network
```
Verifico que la red se haya creado correctamente:
```bash
docker network ls | grep ia-lab
```
Evidencia (imagen):
![](imagenes/img3.png)

Ejecuté los comandos en WSL. El resultado fue el esperado: se creó la red ia-lab-network, se mostró su identificador 6ebf13e6d30a y apareció como una red bridge local al ejecutar la verificación.

## Instalación de Base de Datos
## 1. MySQL
## 1.1 Crear el archivo docker-compose.yml
Creo el archivo de configuración de MySQL dentro de la carpeta correspondiente usando el siguiente comando:
```bash
cat > ~/ia-lab/services/motores-bd/mysql/docker-compose.yml << 'EOF'
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-server
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3306:3306"
    volumes:
      - ../../../data/mysql:/var/lib/mysql
      - /mnt/d/academia/bd:/backups
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --bind-address=0.0.0.0
    networks:
      - ia-lab-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

networks:
  ia-lab-network:
    external: true
EOF
```
Intento habilitar UFW y permito el puerto 3306 de MySQL en el host:

```bash
sudo ufw allow 3306/tcp
sudo ufw enable
sudo ufw status
```
![](imagenes/img4.png)

Creé el archivo docker-compose.yml de MySQL y configuré el puerto 3306. Al ejecutar los comandos, me di cuenta de que UFW no estaba instalado porque apareció el mensaje ufw: command not found.

Para solucionar el problema, instalo UFW en WSL:
```bash
sudo dpkg --configure -a
```
Luego actualizo los paquetes:
```bash
sudo apt update
```
Después instalo UFW:
```bash
sudo apt install ufw
```
Finalmente verifico que UFW se haya instalado correctamente:
```bash
ufw --version
```
El resultado de la verificación fue ufw 0.36.2, lo que confirma que UFW quedó instalado correctamente.

Evidencia (imagen de la instalación de UFW):
![](imagenes/img5.png)

Después de instalarlo, vuelvo a ejecutar los comandos para permitir el puerto, habilitar UFW y comprobar su estado:
```bash
sudo ufw allow 3306/tcp
sudo ufw enable
sudo ufw status
```

Evidencia (imagen de la configuración de UFW):

![](imagenes/img6.png)

Registro:

Al probar de nuevo los comandos, comprobé que el firewall quedó activo y habilitado al iniciar el sistema. También verifiqué que el puerto 3306/tcp quedó permitido para conexiones IPv4 e IPv6.

## 1.3 Crear el archivo .env
Creo el archivo .env para configurar la zona horaria, la contraseña del usuario administrador y el nombre de la base de datos de MySQL:

```bash
cat > ~/ia-lab/services/motores-bd/mysql/.env << 'EOF'
TZ=America/Bogota
MYSQL_ROOT_PASSWORD=141618
MYSQL_DATABASE=wayuutravel
EOF
```
Evidencia (imagen):

![](imagenes/img7.png)
Evidencia de la creación del archivo .env



Creé correctamente el archivo .env con la zona horaria America/Bogota, la contraseña 141618 y la base de datos wayuutravel, tal como se observa en la evidencia. wayuutravel es la base de datos del proyecto final del semestre.

## 1.3.1 Editar la clave del archivo .env en clase
Para editar la clave del archivo .env en clase, primero ingreso a la carpeta de MySQL:
```bash
cd ~/ia-lab/services/motores-bd/mysql
sudo nano .env
```
Dentro del archivo cambio la clave por:
```bash
MYSQL_ROOT_PASSWORD=123456
```
Para guardar los cambios presiono:
```bash
Ctrl + O  ==>  para guardar
```
Después presiono Enter para confirmar el nombre del archivo. Para salir del editor presiono:
```bash
Ctrl + X  ==>  para salir
```
Evidencia (imagen):
![](imagenes/img8.png)
Registro:

Abrí el archivo .env, cambié la clave de MySQL a 123456, guardé los cambios con Ctrl + O y salí del editor con Ctrl + X.

## 1.4 Crear README.md
Creo el archivo README.md en la carpeta de MySQL:
```bash
touch ~/ia-lab/services/motores-bd/mysql/README.md
```
Después abro el archivo para agregar su contenido:
```bash
sudo nano ~/ia-lab/services/motores-bd/mysql/README.md
```
Teneiendo en cuenta la guia del profesor y con ayuda del block de notas modifico el codigo y dentro del archivo escribo lo siguiente:

```bash
# MySQL 8.0 - Motor de Base de Datos

> **Acceso remoto habilitado.** Puerto expuesto en `0.0.0.0:3306`.
> **Usuario por defecto:** `root`
> **Base de datos inicial:** `wayuutravel`
> **Password:** `141618`

---

## Conectar desde WSL (local)

```bash
sudo docker exec -it mysql-server mysql -u root -p
# Password: 141618
```

Después de guardar el contenido, muestro el archivo para comprobar que fue creado correctamente:
```bash
cat ~/ia-lab/services/motores-bd/mysql/README.md
```
Evidencia (imagen):
![](imagenes/img9.png)

Evidencia de la creación de README.md

Registro:

Creé el archivo README.md y comprobé su contenido ejecutando el comando cat. El archivo contiene la información de MySQL, el puerto 3306, el usuario root, la base de datos wayuutravel y la forma de conectarme desde WSL.

## 1.5 Levantar MySQL
Ingreso a la carpeta de MySQL y levanto el contenedor en segundo plano:
```bash
cd ~/ia-lab/services/motores-bd/mysql
sudo docker compose up -d
```
Verifico que el contenedor esté corriendo:
```bash
sudo docker ps | grep mysql-server
```
Después reviso los últimos 20 registros del contenedor:
```bash
sudo docker logs mysql-server --tail 20
```
Evidencia (imagen):
![  ](imagenes/img10.png)

Evidencia del error al levantar MySQL
Registro:

Al ejecutar sudo docker compose up -d, MySQL no se levantó porque apareció un error de formato YAML en la línea 2 del archivo docker-compose.yml. El problema fue que el archivo tenía tabulaciones para la indentación; YAML debe usar espacios. Por esta razón, el comando docker ps no mostró el contenedor y docker logs indicó que mysql-server no existe.

## 1.5.1 Solucionar el error de formato YAML
La parte que causó el error estaba escrita con tabulaciones en la indentación:

```bash
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-server
 ```
La reemplazo por la misma estructura, utilizando espacios:
```bash
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-server
 ```

Entro al archivo para editarlo manualmente:

```bash
cd ~/ia-lab/services/motores-bd/mysql
sudo nano docker-compose.yml
```
El contenido completo y corregido que coloco en docker-compose.yml es:

```bash
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-server
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3306:3306"
    volumes:
      - ../../../data/mysql:/var/lib/mysql
      - /mnt/d/academia/bd:/backups
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --bind-address=0.0.0.0
    networks:
      - ia-lab-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

networks:
  ia-lab-network:
    external: true
  ```
Reemplazo las tabulaciones por espacios en todo el archivo, guardo con Ctrl + O y salgo con Ctrl + X.

Primero pruebo el archivo YAML:
```bash
sudo docker compose config
```

En mi caso no me aparecio error, pero si el error continúa, ejecuto directamente el comando que reemplaza las tabulaciones por espacios:
```bash
sed -i 's/\t/  /g' ~/ia-lab/services/motores-bd/mysql/docker-compose.yml
```
Después valido nuevamente el archivo:
```bash
sudo docker compose config
```
Si la validación no muestra errores, vuelvo a levantar MySQL y compruebo el contenedor y sus registros:

```bash
sudo docker compose up -d
sudo docker ps | grep mysql-server
sudo docker logs mysql-server --tail 20
```
![  ](imagenes/img11.png)

Evidencia MySQL funcionando:

Registro:

Corregí la indentación del archivo docker-compose.yml, validé que el YAML no tuviera errores y levanté MySQL correctamente. El contenedor mysql-server quedó activo y los registros confirmaron que MySQL inició correctamente.

##  Conectar desde WSL (local)
```bash
sudo docker exec -it mysql-server mysql -u root -p
# Password: 123456
```

Evidencia:

![  ](imagenes/img12.png)

Creación de mi usuario y base de datos con acceso remoto
Para no depender siempre del usuario root y dejar configurado mi acceso personalizado, entré directo al contenedor de MySQL con mis credenciales de root:

```bash
sudo docker exec -it mysql-server mysql -u root -p
 ```
Ya dentro de la consola del motor, creé mi base de datos wayutravel:
```bash
-- Creé mi base de datos con soporte utf8mb4
CREATE DATABASE wayuutravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Creé mi usuario con acceso remoto (%)
CREATE USER 'admin'@'%' IDENTIFIED BY '123456';

-- Le di privilegios totales sobre mi base de datos
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
GRANT ALL PRIVILEGES ON wayuutravel.* TO 'admin'@'%';
FLUSH PRIVILEGES;
EXIT;
```
Mi registro: Dejé lista mi base de datos wayuutravel y configuré mi usuario admin con su contraseña, asegurándome de tener los permisos necesarios para conectar herramientas externas sin trabas.

## Conexión desde DBeaver
Para comprobar que podía gestionar mis tablas desde una interfaz gráfica, saqué la IP de mi WSL ejecutando:

Evidencia (imagen):

![  ](imagenes/img13.png)

Mi registro: Probé la conexión remota desde DBeaver usando la IP de mi entorno y los datos que creé, logrando entrar al motor de forma exitosa.

## Creación de mi respaldo (Backup)
Para mantener mis datos seguros, automaticé una copia de seguridad de mi base de datos wayuutravel mandándola directo a la ruta compartida con mi equipo:
```bash
sudo docker exec -it mysql-server sh -c "mysqldump -u root -p123456 ActivaFit > /backups/backup_wayuutravel_\$(date +%Y%m%d).sql"
```
Para comprobar que la copia de seguridad se guardó correctamente en el equipo, listé el contenido de la ruta compartida con el siguiente comando:
```bash
ls -lh /mnt/d/academia/bd/
```
Evidencia (imagen):
![  ](imagenes/img14.png)

Evidencia de la configuración de MySQL

Mi registro: Verifiqué el directorio de respaldos y confirmé que el archivo .sql de la base de datos ActivaFit se generó con la fecha actual y el tamaño correspondiente, cerrando con éxito el proceso de exportación y persistencia.

## Conclusión
Con este registro finalizo la instalación y configuración del motor MySQL para mi proyecto wayuutravel. Dejé el contenedor funcionando, estructuré la base de datos, habilité el acceso remoto con un usuario propio, comprobé la conexión exitosa desde DBeaver y generé el respaldo correspondiente de forma automatizada.

## 2. Configuración y Despliegue de PostgreSQL
Una vez finalizado MySQL, me dispongo a desplegar el motor de PostgreSQL dentro de la estructura de servicios de mi laboratorio.

## Creación del docker-compose.yml para PostgreSQL

Me ubiqué en la carpeta correspondiente al servicio de Postgres y creé el archivo de configuración utilizando un bloque cat para escribir directamente todo el contenido estructurado:
![  ](imagenes/img15.png)

Evidencia de la configuración de MySQL
Mi registro: Dejé configurado el contenedor de PostgreSQL utilizando la imagen oficial postgres:17, enlazando el archivo de variables de entorno, mapeando el volumen de datos en WSL y conectándolo a la ruta de respaldos en Windows para mantener el mismo estándar que utilicé con MySQL.

## Creación del .env
Para mantener seguras las credenciales y separar la configuración del contenedor, creé el archivo .env dentro de la misma carpeta del servicio:
```bash
cat > ~/ia-lab/services/motores-bd/postgres/.env << 'EOF'
TZ=America/Bogota
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=wayuutravel
EOF
```
Evidencia (imagen):
![  ](imagenes/img16.png)
Evidencia de la configuración de MySQL

Mi registro: Definí las variables de entorno para PostgreSQL utilizando mi contraseña estándar (123456) y configurando la base de datos wayuutravel para que el motor la cree automáticamente al arrancar por primera vez.

## Creacion del README de PostgreSQL
Creé el archivo README.md dentro de la carpeta del motor:
```bash
touch ~/ia-lab/services/motores-bd/postgres/README.md
```
Después abro el archivo para agregar su contenido:

sudo nano ~/ia-lab/services/motores-bd/postgres/README.md
Y estructuré la información clave de acceso y configuración de la siguiente manera:

# PostgreSQL 17 – Motor de Base de Datos
```bash
> **Acceso remoto habilitado:** Puerto expuesto en `0.0.0.0:5432`.
> **Usuario por defecto:** `postgres`
> **Base de datos inicial:** `wayuutravel`
> **Password:** `123456`

---
```
## Conectar desde WSL (local)

```bash
sudo docker exec -it postgres-server psql -U postgres -d wayuutravel
# Password: 123456
```
Después de guardar el contenido y luego Compruebo si se guardó bien :
```bash
cat ~/ia-lab/services/motores-bd/postgres/README.md
```
Evidencia (imagen):
![  ](imagenes/img17.png)

Mi registro: Documenté los detalles técnicos principales de PostgreSQL en el archivo README.md del servicio, dejando claras las credenciales y los parámetros de conexión para tenerlos siempre a la mano en el desarrollo del proyecto.

Despliegue del contenedor de PostgreSQL
Una vez configurados el archivo docker-compose.yml, las variables de entorno y el README.md, procedí a levantar el contenedor utilizando Docker Compose:
```bash
cd ~/ia-lab/services/motores-bd/postgres 
sudo docker compose up -d
```
Verifico que el contenedor esté corriendo:
```bash
sudo docker ps | grep postgres-server
```
Verificar que esté corriendo sin problemas:
```bash
sudo docker ps
```
Evidencia (imagen):
![  ](imagenes/img18.png)

Mi registro: Inicié el despliegue del contenedor de PostgreSQL con Docker Compose. El sistema creó y puso en marcha el servicio postgres-server vinculado a la red y a los volúmenes configurados, quedando operativo de manera inmediata.

## Creacion del usuario con acceso remoto
Me conecto primero como postgres al motor de PostgreSQL:
```bash
sudo docker exec -it postgres-server psql -U postgres -d wayuutravel
```
Después de ingresar la contraseña de postgres, ejecuto las instrucciones SQL.
```bash
CREATE USER admin WITH PASSWORD '123456';
ALTER USER admin WITH SUPERUSER;
```
También puedo verificar que el usuario fue creado correctamente con:

\du

![  ](imagenes/img19.png)

Mi registro: Verifiqué en la salida de la consola que el rol admin fue creado con éxito y cuenta con los privilegios de Superuser necesarios para la administración completa del motor y las conexiones remotas

## Conexión a PostgreSQL desde DBeaver
Para comprobar que el acceso remoto y el usuario que creé (admin) funcionan correctamente desde el entorno de Windows, abrí DBeaver y configuré una nueva conexión a PostgreSQL con los siguientes parámetros:

Para comprobar que podía gestionar mis tablas desde una interfaz gráfica, saqué la IP de mi WSL ejecutando:

```bash
ip a
```
Evidencia (imagen):
![  ](imagenes/img20.png)

Mi registro: Probé la conexión remota desde DBeaver usando la IP de mi entorno y los datos que creé, logrando entrar al motor de forma exitosa.

## Respaldo (Backup) de la base de datos en PostgreSQL
Para asegurar una copia de seguridad de la estructura y los datos del proyecto, realicé un respaldo utilizando la herramienta nativa pg_dump ejecutada desde el contenedor:
```bash
sudo docker exec -it postgres-server pg_dump -U admin -d wayuutravel > backup_wayuutravel.sql
```
Para comprobar que la copia de seguridad se guardó correctamente en el equipo, listé el contenido de la ruta compartida con el siguiente comando:

## Verificación del Respaldo (Backup)
Para comprobar que el archivo de respaldo se generó de forma íntegra y correcta en el sistema, verifiqué su existencia, su tamaño en el directorio y previsualicé sus primeras líneas de código SQL:
```bash
ls -lh backup_wayuutravel.sql
head -n 20 backup_wayuutravel.sql 
```
Evidencia (imagen):

![  ](imagenes/img21.png)

Evidencia de la configuración de MySQL
Mi registro: Comprobé la generación exitosa del archivo backup_wayuutravel.sql con un tamaño de 751 bytes, validando las cabeceras del motor PostgreSQL y asegurando una copia de seguridad funcional para la base de datos del proyecto.

El despliegue de PostgreSQL mediante Docker facilitó la configuración del servicio, la creación del usuario administrador con privilegios avanzados, la verificación de la conectividad desde DBeaver y la ejecución exitosa de respaldos con pg_dump.

## 3. MSSQL Server
Creación del archivo docker-compose.yml
Para el despliegue de SQL Server, configuré el archivo de servicios utilizando la imagen oficial de Microsoft con el siguiente contenido:

```bash
cat > ~/ia-lab/services/motores-bd/mssql/docker-compose.yml << 'EOF'
services:
  mssql:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: mssql-server
    restart: unless-stopped
    user: root
    env_file:
      - .env
    ports:
      - "0.0.0.0:1433:1433"
    volumes:
      - ../../../data/mssql:/var/opt/mssql
      - /mnt/d/academia/bd:/backups
    networks:
      - ia-lab-network
    healthcheck:
      test: ["CMD-SHELL", "/opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P $$MSSQL_SA_PASSWORD -C -Q 'SELECT 1' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 40s

networks:
  ia-lab-network:
    external: true
EOF
```
Evidencia (imagen):
![  ](imagenes/img22.png)

Mi registro: Estructuré el archivo de configuración para MSSQL, asegurando la persistencia de datos y el monitoreo de salud del contenedor mediante la herramienta nativa sqlcmd.

## Creación del (.env)
Para definir los parámetros de aceptación de licencia y la contraseña del administrador del sistema (SA), creé el archivo .env con el siguiente contenido:
```bash
cat > ~/ia-lab/services/motores-bd/mssql/.env << 'EOF'
TZ=America/Bogota
ACCEPT_EULA=Y
MSSQL_SA_PASSWORD=jaime1234!
MSSQL_PID=Developer
EOF

```
![  ](imagenes/img24.png)

Si necesito editar el archivo posteriormente, utilizo:
```bash
cd ~/ia-lab/services/motores-bd/mssql
sudo nano .env
```
Evidencia (imagen):
![  ](imagenes/img23.png)

Evidencia de la configuración de MySQL
MSSQL_PID: Developer (Define la edición de SQL Server utilizada en el contenedor).

Usuario SA: Corresponde al Administrador del Sistema (System Administrator), necesario para conectarse mediante sqlcmd o DBeaver.

Complejidad de contraseña: Requisito obligatorio de SQL Server que exige incluir mayúsculas, minúsculas, números y símbolos.

Mi registro: Creé y verifiqué el archivo .env de MS SQL Server estableciendo la zona horaria, aceptando la licencia de usuario, configurando la edición Developer y definiendo una contraseña robusta para el usuario administrador SA, garantizando el cumplimiento de los estándares de seguridad exigidos por el motor.

## Creación del archivo README.md
Para documentar la finalidad y los parámetros del servicio de MS SQL Server en el repositorio, creé el archivo README.md ejecutando: Creé el archivo README.md dentro de la carpeta del motor:
```bash
touch ~/ia-lab/services/motores-bd/mssql/README.md
```
Después abro el archivo para agregar su contenido:
```bash
sudo nano ~/ia-lab/services/motores-bd/mssql/README.md
```
```bash
# Configuración de Microsoft SQL Server (MSSQL)

Este directorio contiene la configuración mediante Docker Compose para desplegar una instancia de **SQL Server 2022** orientada al proyecto de base de datos.

## Estructura de archivos
- `docker-compose.yml`: Archivo de configuración del contenedor.
- `.env`: Variables de entorno para la configuración de la instancia (credenciales y licencia).

## Credenciales y Parámetros
- **Puerto:** `1433`
- **Usuario Administrador:** `SA`
- **Edición (`MSSQL_PID`):** `Developer`
- **Zona Horaria:** `America/Bogota`
```

Para ver el contenido del archivo README.md, ejecuto:

```bash
cat ~/ia-lab/services/motores-bd/mssql/REA
```
Evidencia (imagen):
![  ](imagenes/img25.png)

Evidencia de la configuración de MySQL
Mi registro: Documenté la configuración del motor MSSQL creando el archivo README.md con los detalles técnicos, puertos, usuario administrador y estructura del servicio.

## Despliegue del contenedor de MSSQL
Una vez configurados el archivo docker-compose.yml, el archivo de variables de entorno .env y la documentación, procedí a levantar el servicio ejecutando los siguientes comandos:

```bash
cd ~/ia-lab/services/motores-bd/mssql
docker compose up -d
```
Verifico que el contenedor mssql-server esté corriendo:
```bash
sudo docker ps | grep mssql-server
```
Para verificar el estado de ejecución del contenedor y su correcta inicialización, consulté los contenedores activos:
```bash
docker ps
```
Evidencia (imagen):
![  ](imagenes/img26.png)

Evidencia de la configuración de MySQL

Mi registro: Ejecuté el despliegue del servicio de MS SQL Server mediante Docker Compose en modo desacoplado (-d), verificando que el contenedor iniciara correctamente y que el servicio estuviera operativo en el puerto 1433.

## Instalar mssql-tools en WSL
Estos pasos instalan mssql-tools18 y unixODBC en Ubuntu 24.04 para administrar y conectarse a SQL Server ejecutado mediante Docker.

Actualizar e instalar los paquetes requeridos
```bash
sudo apt update && sudo apt install -y curl ca-certificates gnupg
```
## Eliminar repositorios antiguos o duplicados de Microsoft

Esto evita conflictos con configuraciones anteriores de Ubuntu 22.04 (jammy) y con el método obsoleto apt-key.
```bash
sudo rm -f /etc/apt/sources.list.d/mssql-release.list
sudo rm -f /etc/apt/sources.list.d/microsoft-prod.list
```

## Descargar el repositorio oficial de Microsoft para Ubuntu 24.04
```bash
cd /tmp
curl -sSL -O https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb
```
## Instalar el repositorio oficial de Microsoft
```bash
sudo dpkg -i packages-microsoft-prod.deb
```
## Actualizar los repositorios
```bash
sudo apt update
```
## Verificar el repositorio de Microsoft
```bash
grep -R "packages.microsoft.com" /etc/apt/sources.list /etc/apt/sources.list.d/ 2>/dev/null
```
## Instalar Microsoft SQL Server Tools 18 y unixODBC
```bash
sudo ACCEPT_EULA=Y apt install -y mssql-tools18 unixodbc-dev
```
## Agregar mssql-tools18 al PATH
```bash
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
```
## Recargar la configuración de Bash
```bash
source ~/.bashrc
```
## Verificar que sqlcmd esté instalado
```bash
which sqlcmd
```
El resultado esperado es:
```bash
/opt/mssql-tools18/bin/sqlcmd
```
Evidencia (imagen):
![  ](imagenes/img27.png)

## Instalación de herramientas y verificación de conexión (sqlcmd)
Para administrar y conectarme directamente a SQL Server desde la terminal de WSL, instalé las herramientas oficiales mssql-tools18 y unixODBC. Posteriormente, verifiqué el acceso mediante el comando de conexión:

```bash 
sqlcmd -S localhost -U SA -P "jaime1234!" -C
```
Mi registro: Instalé con éxito mssql-tools18 en Ubuntu 24.04 y establecí una conexión exitosa al contenedor de SQL Server utilizando el usuario administrador SA y la terminal (sqlcmd), comprobando que el motor de base de datos se encuentra operativo.

## Conectar localmente y Remotamente a el SQL Server
Me conecto localmente al contenedor de SQL Server utilizando el usuario administrador SA y la contraseña configurada para el proyecto:
```bash
sudo docker exec -it mssql-server /opt/mssql-tools18/bin/sqlcmd -S localhost -U SA -P 'jaime1234!' -C
```
Una vez dentro de la consola, creé la base de datos principal para el proyecto ActivaFit:
```bash
CREATE DATABASE wayuutravel;
GO
```
para ver las bases de datos se usa este comando :
```bash
SELECT name FROM sys.databases;
GO
```
creacion del admin

La base de datos wayuutravel ya existe y contiene las tablas del proyecto. Creo el login admin, le asigno el rol sysadmin y lo habilito para permitir la administración remota. Ejecuto cada comando por separado:

```bash
CREATE LOGIN admin WITH PASSWORD = '123456', CHECK_POLICY = OFF;
```
Después de presionar Enter, escribo manualmente GO y presiono Enter.
```bash
ALTER SERVER ROLE sysadmin ADD MEMBER admin;
```
Después de presionar Enter, escribo manualmente GO y presiono Enter.
```bash
ALTER LOGIN admin ENABLE;
```
Después de presionar Enter, escribo manualmente GO y presiono Enter. Evidencia (imagen):

![  ](imagenes/img28.png)

Evidencia de la configuración de MySQL
Mi registro: Me conecté al contenedor de SQL Server mediante docker exec utilizando las herramientas del sistema y creé la base de datos ActivaFit para estructurar la información del proyecto.

## Conexión a la base de datos mediante DBeaver
Para gestionar de forma gráfica el motor de base de datos y la estructura de ActivaFit, configuré una nueva conexión en DBeaver utilizando los siguientes parámetros:

Servidor: 172.29.32.60
Puerto: 1433
Base de datos inicial: wayuutravel
usuario: Admin
Contraseña: 123456

Evidencia (imagen):

![  ](imagenes/img29.png)

Mi registro: Se verificó y confirmó el éxito de la conexión (Conectado) con la instancia de SQL Server 2022 Developer Edition, validando el funcionamiento del puerto 1433 y el driver JDBC. Queda listo el entorno gráfico para la gestión completa del proyecto ActivaFit.

## Oracle XE
## Crear el archivo docker-compose.yml para Oracle

```bash
cat > ~/ia-lab/services/motores-bd/oracle/docker-compose.yml << 'EOF'
services:
  oracle:
    image: gvenzl/oracle-xe:21-slim
    container_name: oracle-server
    restart: unless-stopped

    env_file:
      - .env

    ports:
      - "0.0.0.0:1521:1521"

    volumes:
      - ../../../data/oracle:/opt/oracle/oradata
      - /mnt/d/academia/bd:/backups

    networks:
      - ia-lab-network

    healthcheck:
      test: ["CMD", "healthcheck.sh"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 120s

networks:
  ia-lab-network:
    external: true
EOF
```
Evidencia (imagen):

![  ](imagenes/img30.png)

Evidencia de la configuración de MySQL

Mi registro: Dejé configurado el archivo docker-compose.yml de Oracle con soporte de red externa, variables de entorno y volúmenes de respaldo persistentes, siguiendo exactamente el mismo estándar de arquitectura que los motores anteriores del laboratorio.

## 4.1 Crear el archivo .env
Creo el archivo .env para configurar la zona horaria, la contraseña de Oracle XE y el nombre del PDB de mi proyecto: wayuutravel con la contraseña 123456.
```bash
cat > ~/ia-lab/services/motores-bd/oracle/.env << 'EOF'
TZ=America/Bogota
ORACLE_PASSWORD=123456
ORACLE_DATABASE=wayuutravel
EOF
```
Para ver lo que guardé dentro del archivo .env, ejecuto:

```bash
cat ~/ia-lab/services/motores-bd/oracle/.env
```
Evidencia (imagen):

Evidencia

![  ](imagenes/img31.png)


Registro:

Mi registro: Dejé configurado el archivo docker-compose.yml de Oracle junto con su respectivo archivo .env con zona horaria America/Bogota, contraseña 123456, el PDB wayuutravel y el usuario administrador SYSTEM, siguiendo exactamente el mismo estándar de arquitectura que los motores anteriores del laboratorio.

## 4.2 Crear README.md
Para mantener documentado cada uno de los servicios de bases de datos dentro de la arquitectura de mi laboratorio, procedí a crear y configurar el archivo README.md correspondiente al motor Oracle.

Para realizarlo, ejecuté el siguiente procedimiento en la terminal:
```bash
touch ~/ia-lab/services/motores-bd/oracle/README.md
```
Después abro el archivo para agregar su contenido:

```bash
sudo nano ~/ia-lab/services/motores-bd/oracle/README.md
```
Dentro del archivo escribo lo siguiente:

# Oracle XE - Motor de Base de Datos

```bash
> **Acceso remoto habilitado.** Puerto expuesto en `0.0.0.0:1521`.
> **Usuario por defecto:** `SYSTEM`
> **PDB / Service Name:** `wayuutravel`
> **Password:** `123456`

---

## Conectar desde WSL (local)

sudo docker exec -it oracle-server sqlplus 'system/1234@//localhost:1521/wayuutravel'
```
Para comprobar que el archivo se creó correctamente, ejecuto:

```bash
cat ~/ia-lab/services/motores-bd/oracle/README.md
```
Evidencia (imagen):

![  ](imagenes/img32.png)

Evidencia de la creación y verificación del README de Oracle XE

Registro:

Dejé documentado el comando y las credenciales directas para conectarme mediante sqlplus al contenedor oracle-server, permitiéndome validar consultas y el estado de la base de datos de manera ágil desde la terminal.

## Levantar Oracle
Ingreso a la carpeta de Oracle y levanto el contenedor en segundo plano:
```bash
cd ~/ia-lab/services/motores-bd/oracle
sudo docker compose up -d
```
Verifico si el contenedor oracle-server está corriendo y reviso sus últimos 30 mensajes:
```bash
sudo docker ps | grep oracle-server
sudo docker logs oracle-server --tail 30
```
Evidencia (imagen):

![  ](imagenes/img33.png)
Evidencia

Registro:

Documenté y resolví el error de permisos errno=13 otorgando los permisos correspondientes al volumen persistente de Oracle (data/oracle), asegurando que la imagen gvenzl/oracle-xe:21-slim pueda descomprimir y crear los archivos de base de datos (.dbf, control01.ctl, etc.) sin problemas durante su primer arranque..

Revisar y corregir los permisos de los datos
Primero reviso los permisos y el contenido de la carpeta de datos:
```bash
ls -ld ~/ia-lab/data/oracle
sudo ls -la ~/ia-lab/data/oracle
```
```bash
sudo docker compose down
```
Cambio el propietario de la carpeta al usuario y grupo utilizados por Oracle dentro del contenedor:
```bash
sudo chown -R 54321:54321 ~/ia-lab/data/oracle
```
Después otorgo permisos de lectura y escritura:
 ```bash
sudo chmod -R 775 ~/ia-lab/data/oracle
```
Vuelvo a iniciar Oracle:
```bash
sudo docker compose up -d
```
## 4.4.2 Verificar el inicio de Oracle
Compruebo nuevamente el estado del contenedor y el puerto publicado:
 ```bash
sudo docker ps | grep oracle-server
```
El resultado esperado es similar a:
```bash
oracle-server   Up 10 seconds (health: starting)   0.0.0.0:1521->1521/tcp
```
También reviso los últimos 30 mensajes para comprobar el listener:
```bash
sudo docker logs oracle-server --tail 30
```
En los registros busco el mensaje:
```basg
Listening on: (DESCRIPTION=(ADDRESS=(PROTOCOL=tcp)(HOST=0.0.0.0)(PORT=1521)))
```
Este mensaje confirma que el listener de Oracle está escuchando en el puerto 54321 y que el contenedor ya está terminando su inicialización.

Evidencia de la solución (imagen):
![  ](imagenes/img34.png)

Evidencia de Oracle XE funcionando correctamente

Registro final:

Documenté el arranque exitoso de Oracle XE, confirmando que la base de datos wayuutravel ya se encuentra montada, abierta y preparada para recibir las consultas y conexiones desde el laboratorio..

Conectar localmente a Oracle
Ingreso al contenedor de Oracle XE:
```bash
sudo docker exec -it oracle-server bash
```
Me conecto a Oracle utilizando el usuario administrador SYSTEM, la contraseña 1234 y el PDB wayuutravel:
```bash
sqlplus 'system/123456@//localhost:1521/wayuutravel'
```
Debo esperar a que aparezca el indicador SQL> antes de escribir comandos de Oracle. Entrar al contenedor solo muestra el aviso bash-4.4$; en ese punto todavía estoy en Bash y no en SQL*Plus.

Si escribo comandos como SELECT, CONN, DESC o EXIT mientras aparece bash-4.4$, Bash intenta interpretarlos como comandos de Linux y muestra un error. Para ejecutar esos comandos debo estar dentro de SQL*Plus, donde el aviso es SQL>.

Ya dentro del motor, creo el usuario admin, que utilizaré como esquema del proyecto wayuutravel:
```bash
CREATE USER admin IDENTIFIED BY "123456" DEFAULT TABLESPACE USERS QUOTA UNLIMITED ON USERS;
ALTER USER admin QUOTA UNLIMITED ON USERS;
GRANT CONNECT, RESOURCE TO admin;
```
Salir del motor
```bash
EXIT;
```
Evidencia (imagen):
![  ](imagenes/img35.png)

Evidencia de la conexión y creación del usuario admin en Oracle XE

Registro:

Documenté el proceso completo de acceso por consola mediante sqlplus y la creación exitosa del usuario admin con sus respectivos privilegios y cuotas de espacio habilitadas en el tablespace por defecto, dejando la base de datos lista para estructurar el modelo relacional.

Crear un usuario propio con acceso remoto
Para crear y administrar mi usuario propio, primero me conecto como SYSTEM al PDB wayuutravel:

Para hacerlo nuevamente, ejecuto los comandos paso a paso y espero el indicador correspondiente antes de continuar:

**Paso 1. Entro al contenedor:**
```bash
sudo docker exec -it oracle-server bash
```
Debo comprobar que aparezca bash-4.4$.


**Paso 2. Inicio SQL*Plus como SYSTEM:**
```bash
sqlplus 'system/123456@//localhost:1521/wayuutravel'
```
Espero a que aparezca SQL>. Los siguientes comandos solo se ejecutan después de ver ese indicador.

**Paso 3. Me conecto al usuario admin:**
```bash
CONN admin/123456@//localhost:1521/wayuutravel
```
**Paso 4. Consulto los usuarios o esquemas:**
```bash
SELECT username FROM all_users ORDER BY username;
```
Evidencia (imagen):

![  ](imagenes/img36.png)

Evidencia de la conexión y creación del usuario admin en Oracle XE
Registro del resultado:

Documenté la conexión exitosa al esquema admin en Oracle XE, estableciendo el entorno de trabajo adecuado para la construcción y verificación de las tablas de la base de datos del laboratorio.

Conectar remotamente desde cualquier equipo
Hacerlo desde DBeaver
Para conectarme remotamente a Oracle XE utilizo DBeaver. Primero consulto la dirección IP del equipo donde está ejecutándose Docker:
```bash
ip a
```
En el resultado busco la interfaz eth0. En mi caso, utilizo la dirección IP 172.21.63.86 como Host.

También verifico que el contenedor esté activo y que el puerto 1521 esté publicado:
```bash
  sudo docker ps --filter "name=oracle-server" --format "table {{.Names}}\t{{.Ports}}"
  ```
Evidencia (imagen):
![  ](imagenes/img37.png)

Evidencia de la verificación previa para la conexión remota a Oracle XE
Registro:

Consulté la configuración de red con ip a y comprobé que la interfaz eth0 tiene la dirección IP 172.29.32.60. También verifiqué que el contenedor oracle-server está activo y publica el puerto 1521 mediante 0.0.0.0:1521->1521/tcp.

En DBeaver realizo los siguientes pasos:

Abro DBeaver.
Selecciono Nueva conexión.
Elijo el controlador Oracle.
En la pestaña Basic dejo la conexión con estos valores:

Escribo 172.29.32.60 en Host.
Escribo 1521 en Port.
En el campo Database, escribo wayuutravel.
En el selector que aparece a la derecha de Database, selecciono Service Name.
Escribo admin en Nombre de usuario.
Escribo 123456 en Contraseña.
En Role, selecciono Normal.
Dejo Authentication en Username/password.
Dejo Local Client en <not present>.
Presiono Probar conexión….
Si la prueba es correcta, presiono Finalizar para guardar la conexión.

Evidencia (imágenes):
![  ](imagenes/img38.png)

## Conclusión
En este laboratorio me ha ayudado a manejar un poco mis conocimientos sobre los motores principales de Bases de Datos y en el he configurado y respaldado con éxito estos motores lo cual me ayudara en mi proyecto llamado wayuutravel, utilizando contenedores de Docker. Con MSSQL y Oracle Database, automatizaste respaldos robustos (archivos .bak y .dmp) y gestionaste su extracción hacia volúmenes persistentes en el host, complementándolo con servicios como PostgreSQL y MySQL. Esto me ayudo a dominar la contenerización, el mapeo de directorios en WSL y las estrategias de respaldo para garantizar la seguridad, resiliencia y portabilidad de tus datos a nivel de ingeniería.


