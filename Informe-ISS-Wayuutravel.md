# **WayuuTravel— Informe de ISS (Django + DRF)**

**Estudiante:** Jaime Rafael Gonzalez Ballesta\
**Programa:** Ingeniería de Sistemas — Universidad de La Guajira\
**Proyecto:** Wayuutravel — Sistema de gestión de gimnasio

## Introducción

WayuuTravel es un sistema de gestión para experiencias turísticas responsables. Su objetivo es centralizar en una sola plataforma la administración de clientes, paquetes turísticos, proveedores, servicios incluidos, salidas programadas, reservas, viajeros, pagos, vouchers y cancelaciones, facilitando la organización y el seguimiento de las operaciones turísticas.

Este informe documenta, unidad por unidad (ISS), cómo se fue construyendo el backend de WayuuTravel con Django y Django REST Framework: qué se desarrolló en cada etapa, por qué se tomaron determinadas decisiones técnicas y qué evidencias demuestran que cada funcionalidad quedó implementada y operativa. Cada unidad finaliza con un GATE, una tabla de criterios de verificación que permite comprobar el cumplimiento de los objetivos establecidos antes de avanzar a la siguiente etapa del desarrollo.

## **Modelo de datos de WayuuTravel**

Tablas: `bookings`, `cancellations`, `clients`, `departures`, `included_services`, `packages`, `payments`, `suppliers`, `travelers`, `vouchers`.

![](images/clipboard-2364692870.png)

### **ISS-00 — Configuración del entorno y creación del proyecto Django**

### **Narrativa**

El desarrollo comienza con la preparación del entorno de trabajo y la estructura base de Django. Antes de implementar las funcionalidades del sistema, se configuró un entorno virtual independiente para mantener organizadas las dependencias del proyecto y evitar conflictos con otras instalaciones de Python. Posteriormente, se creó la estructura inicial de Django, que servirá como base para desarrollar la lógica del backend y gestionar las operaciones relacionadas con los servicios turísticos. En esta etapa aún no se implementan modelos de datos ni endpoints; el propósito es establecer una base organizada y funcional para las siguientes unidades.

### **Objetivo**

Configurar un entorno virtual e inicializar el proyecto Django `config` para Wayuu Travel, dejando preparada la estructura básica del backend, sin implementar todavía modelos ni endpoints.

### **Requisitos**

- Python 3.12 instalado.

- Un directorio de proyecto vacío.

- Conexión a Internet para instalar Django 5.2.17.

- Terminal para ejecutar los comandos de configuración.

### **Construcción**

Inicialmente, se creó y activó un entorno virtual para aislar las dependencias de WayuuTravel. A continuación, se instaló Django en la versión 5.2.17, fijando así una versión específica del framework para mantener la consistencia del entorno de desarrollo. Después, se ejecutó el comando `startproject config .`, utilizando el punto final para ubicar `manage.py` directamente en la raíz del proyecto y conservar los archivos de configuración dentro del directorio `config/`, evitando la creación de carpetas anidadas innecesarias. Finalmente, se registraron las dependencias instaladas en el archivo `requirements.txt`, facilitando la reproducción del entorno en otros equipos.

``` sql
python3 -m venv .venv
source .venv/bin/activate
python -m pip install "Django==5.2.17"
django-admin startproject config .
python -m pip freeze > requirements.txt
python -m django --version
```

![](images/clipboard-2283502522.png)

Creación del `.gitignore`:

Django no crea un `.gitignore`, así que se añadió a mano. Su función es evitar que el entorno virtual, los secretos del `.env`, las bases de datos locales y los archivos temporales lleguen al repositorio.

![](images/clipboard-624738056.png)

### Explicación

- **Django 5.2.17:** framework principal de esta unidad. Proporciona las herramientas necesarias para iniciar el proyecto, gestionar la configuración y preparar el desarrollo del backend.

- **`.venv`:** entorno virtual que mantiene las dependencias de Wayuu Travel separadas de las del sistema. Cuando está activo, el terminal muestra `(.venv)`.

- **`django-admin startproject config .`:** genera la estructura inicial del proyecto, dejando `manage.py` en la raíz y los archivos de configuración dentro de `config/`.

- **`.gitignore`:** archivo que evita incluir en el repositorio elementos locales o sensibles, como `.venv/` y `.env`.

- **`python -m pip`:** permite administrar los paquetes de Python mediante el intérprete del entorno activo, facilitando el control de las dependencias instaladas.

### Criterios de aceptación

- **AC-00-01:** el comando `python -m django --version` muestra la versión `5.2.17`.

- **AC-00-02:** existen los archivos `manage.py` y `config/urls.py`.

- **AC-00-03:** el proyecto todavía no contiene modelos de negocio ni endpoints propios de Wayuu Travel.

### Verificación

Para cerrar la unidad se comprobó la versión instalada y se ejecutó el chequeo del proyecto, que confirma que la estructura es válida aunque todavía no tenga lógica de negocio.

``` sql
python -m django --version
python manage.py check
```

![](images/clipboard-2407436608.png)

### **GATE**

| **AC**   | **Verificación**               | **Evidencia** | **Resultado** |
|----------|--------------------------------|---------------|---------------|
| AC-00-01 | versión de Django              | EVI-00-01     | PASS          |
| AC-00-02 | archivos del proyecto          | EVI-00-02     | PASS          |
| AC-00-03 | ausencia de modelos de negocio | EVI-00-02     | PASS          |

## **ISS-01 — Settings y selección del motor**

### Narrativa

Una vez preparada la estructura inicial , el siguiente paso consiste en definir cómo se conectará el backend con la base de datos. Para facilitar la configuración y evitar que los parámetros de conexión queden escritos directamente en el código, se decidió utilizar un archivo `.env` que permita seleccionar el motor de base de datos mediante variables de entorno. De esta manera, se puede configurar PostgreSQL, MySQL, SQL Server u Oracle sin modificar la lógica de Python. En esta unidad se establece una configuración flexible y organizada, con la regla de utilizar un solo motor de base de datos por ejecución del proyecto.

### Objetivo

Configurar la selección de un único motor de base de datos para WayuuTravel mediante variables de entorno definidas en `.env`, sin implementar todavía consultas SQL ni lógica de negocio.

### Requisitos

- Haber completado el ISS-00 y tener activo el entorno virtual `(.venv)`.

- Contar con las variables de configuración necesarias para PostgreSQL, MySQL, SQL Server y Oracle.

- Disponer de un archivo `.env` para almacenar los parámetros de configuración fuera del código fuente.

- Mantener las credenciales y los datos sensibles fuera del repositorio.

### Construcción

**1. Confirmar el entorno**

Antes de instalar nuevas dependencias, se verificó que el intérprete de Python correspondiera al entorno virtual de Wayuu Travel. Este paso permite garantizar que los paquetes necesarios para la configuración de la base de datos se instalen dentro del proyecto y estén disponibles para Django.

``` sql
source .venv/bin/activate
which python
```

![](images/clipboard-2036133970.png)

**2. Instalar `python-dotenv` y los drivers de cada motor**

Se instaló `python-dotenv`, que permite leer el `.env`, y un drivers por cada motor soportado. Django no trae esos drivers; sin ellos, `migrate` falla al importar el backend, aunque la configuración esté bien escrita.

``` sql
python -m pip install "python-dotenv==1.2.3"
python -m pip install "psycopg[binary]==3.3.6"
python -m pip install "mysqlclient==2.3.0"
python -m pip install "mssql-django==2.0.0"
python -m pip install "oracledb==26.0.1"
python -m pip freeze > requirements.txt
```

![![](images/clipboard-728795391.png)](images/clipboard-728795391.png)

**Incidencia durante la instalación de `mysqlclient`**

Al ejecutar `python -m pip install "mysqlclient==2.3.0"`, la instalación falló. Este paquete no es solo Python: necesita compilar una extensión en C y, para eso, requiere las librerías de desarrollo de MySQL y algunas herramientas de compilación en el sistema, que no estaban instaladas. El error indicaba que no se encontraba `pkg-config` o `mysql_config`.

Para solucionarlo se instalaron las dependencias del sistema con el siguiente comando:

``` sql
sudo apt update 
sudo apt install build-essential pkg-config default-libmysqlclient-dev python3.12-dev  
```

![](images/clipboard-150113441.png)

Luego se repitió la instalación del paquete, esta vez con éxito:

``` sql
python -m pip install "mysqlclient==2.3.0"   
```

![](images/clipboard-3590541556.png)

**3. Convertir `settings.py` en paquete**

`startproject` genera `settings.py` como archivo, pero se necesita un paquete con ese mismo nombre. Como un archivo y un paquete no pueden llamarse igual, se eliminó el archivo y se creó la carpeta.

``` sql
rm config/settings.py
mkdir -p config/settings
```

**4. Crear `.env.example` y copiarlo a `.env`**

Se creó `.env.example` como plantilla pública: solo contiene los nombres de las variables, sin secretos. Luego se copió a `.env`, que es donde van los valores reales y que nunca se versiona.

``` sql
cat > .env.example <<'EOF'
# Copie este archivo a .env y complete los valores.
# .env no se versiona.
 
DJANGO_SECRET_KEY=
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,testserver
 
# Motor activo. Uno solo por ejecución: postgresql | mysql | mssql | oracle
DB_ENGINE=postgresql
 
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
 
MYSQL_DB=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
 
MSSQL_DB=
MSSQL_USER=
MSSQL_PASSWORD=
MSSQL_HOST=127.0.0.1
MSSQL_PORT=1433
 
ORACLE_DB=
ORACLE_USER=
ORACLE_PASSWORD=
ORACLE_HOST=127.0.0.1
ORACLE_PORT=1521
ORACLE_SERVICE_NAME=
 
# Laboratorio académico. En producción liste orígenes explícitos.
CORS_ALLOW_ALL_ORIGINS=True
EOF
cp .env.example .env
```

![](images/clipboard-1112405641.png)

### **Modificacion del .env**

![](images/clipboard-1115664275.png)

**5. Crear `config/database.py`**

Se escribió el traductor entre el entorno y Django. Lee `DB_ENGINE` y devuelve un único `DATABASES["default"]`. Si el motor no es válido o falta una variable obligatoria, falla antes de intentar conectarse y con un mensaje claro.

``` sql
cat > config/database.py <<'EOF'
"""Selección del motor de base de datos a partir del entorno.
 
Un solo alias, default, queda activo en cada ejecución.
"""
 
from django.core.exceptions import ImproperlyConfigured
 
ALLOWED_ENGINES = ("postgresql", "mysql", "mssql", "oracle")
 
 
def database_from_environ(env):
    engine = str(env.get("DB_ENGINE", "postgresql")).strip().lower()
    if engine not in ALLOWED_ENGINES:
        allowed = ", ".join(ALLOWED_ENGINES)
        raise ImproperlyConfigured(
            f"DB_ENGINE='{engine}' no es válido. Valores permitidos: {allowed}."
        )
    builders = {
        "postgresql": _postgresql,
        "mysql": _mysql,
        "mssql": _mssql,
        "oracle": _oracle,
    }
    return {"default": builders[engine](env)}
 
 
def _required(env, key):
    value = env.get(key)
    if value is None or str(value).strip() == "":
        raise ImproperlyConfigured(
            f"Falta la variable de entorno {key} para DB_ENGINE={env.get('DB_ENGINE')}."
        )
    return str(value).strip()
 
 
def _postgresql(env):
    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": _required(env, "POSTGRES_DB"),
        "USER": _required(env, "POSTGRES_USER"),
        "PASSWORD": _required(env, "POSTGRES_PASSWORD"),
        "HOST": _required(env, "POSTGRES_HOST"),
        "PORT": _required(env, "POSTGRES_PORT"),
    }
 
 
def _mysql(env):
    return {
        "ENGINE": "django.db.backends.mysql",
        "NAME": _required(env, "MYSQL_DB"),
        "USER": _required(env, "MYSQL_USER"),
        "PASSWORD": _required(env, "MYSQL_PASSWORD"),
        "HOST": _required(env, "MYSQL_HOST"),
        "PORT": _required(env, "MYSQL_PORT"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
 
 
def _mssql(env):
    return {
        "ENGINE": "mssql",
        "NAME": _required(env, "MSSQL_DB"),
        "USER": _required(env, "MSSQL_USER"),
        "PASSWORD": _required(env, "MSSQL_PASSWORD"),
        "HOST": _required(env, "MSSQL_HOST"),
        "PORT": _required(env, "MSSQL_PORT"),
        "OPTIONS": {
            "driver": "ODBC Driver 18 for SQL Server",
            "extra_params": "TrustServerCertificate=yes",
        },
    }
 
 
def _oracle(env):
    host = _required(env, "ORACLE_HOST")
    port = _required(env, "ORACLE_PORT")
    service = _required(env, "ORACLE_SERVICE_NAME")
    dsn = (
        f"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST={host})(PORT={port}))"
        f"(CONNECT_DATA=(SERVICE_NAME={service})))"
    )
    return {
        "ENGINE": "django.db.backends.oracle",
        "NAME": dsn,
        "USER": _required(env, "ORACLE_USER"),
        "PASSWORD": _required(env, "ORACLE_PASSWORD"),
        "HOST": host,
        "PORT": "",
    }
EOF
```

![](images/clipboard-2217452890.png)

![](images/clipboard-2277001564.png)

**6. Crear `config/settings/__init__.py`**

Se armó el paquete de configuración: carga el `.env`, exige la `SECRET_KEY` y delega la base de datos a `database.py`. Por ahora no incluye las apps de ActivaFit, DRF ni JWT; cada uno se añadirá en la unidad que lo necesite.

``` sql
cat > config/settings/__init__.py <<'EOF'
"""Configuración de ActivaFit.
 
El paquete sustituye al settings.py generado por startproject.
DJANGO_SETTINGS_MODULE sigue siendo config.settings.
"""
 
import os
from pathlib import Path
 
# python-dotenv, instalado en este ISS. Lee .env antes de SECRET_KEY y DATABASES.
from dotenv import load_dotenv
 
from config.database import database_from_environ
 
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")
 
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "").strip()
if not SECRET_KEY:
    from django.core.exceptions import ImproperlyConfigured
 
    raise ImproperlyConfigured("Defina DJANGO_SECRET_KEY en el archivo .env.")
 
DEBUG = os.environ.get("DJANGO_DEBUG", "False").strip().lower() in {"1", "true", "yes", "on"}
 
ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]
 
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]
 
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
 
ROOT_URLCONF = "config.urls"
 
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
 
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"
 
DATABASES = database_from_environ(os.environ)
 
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
 
LANGUAGE_CODE = "es"
TIME_ZONE = "America/Bogota"
USE_I18N = True
USE_TZ = True
 
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
EOF
```

![![](images/clipboard-3262240758.png)](images/clipboard-13322367.png)

**7. Crear `config/project_python.py`**

Para que `python3 manage.py` funcione aunque no se haya activado el entorno, se añadió un pequeño ayudante que vuelve a lanzar el comando con el Python de `.venv`.

``` sql
cat > config/project_python.py <<'EOF'
"""Intérprete del proyecto.
 
Los paquetes se instalan dentro de .venv. El comando python3 manage.py
usa el Python del sistema y no ve esos paquetes.
use_project_python() vuelve a lanzar el mismo comando con .venv/bin/python.
"""
 
import os
import sys
from pathlib import Path
 
PROJECT_ROOT = Path(__file__).resolve().parent.parent
 
 
def use_project_python():
    """Reejecuta el proceso con el Python de .venv si aún no es ese intérprete."""
    venv_root = PROJECT_ROOT / ".venv"
    venv_python = venv_root / "bin" / "python"
    if not venv_python.is_file():
        return
    try:
        if Path(sys.prefix).resolve() == venv_root.resolve():
            return
    except OSError:
        return
    os.execv(venv_python, [str(venv_python), *sys.argv])
EOF
```

![](images/clipboard-3548904752.png)

![](images/clipboard-1277651545.png)

**8. Parchear `manage.py`, `config/wsgi.py` y `config/asgi.py`**

Para terminar, se editaron los tres puntos de entrada del proyecto para que carguen el `.env` antes de que Django lea la configuración. Sin ese paso, `SECRET_KEY` y las credenciales aparecerían vacías.

Estos archivos ya existen; no se regeneran, se editan.

**Evidencia EVI-01-05.** Esta es la evidencia del reemplazo realizado anteriormente en los puntos de entrada del proyecto (`manage.py`, `config/wsgi.py` y `config/asgi.py`), donde se agregó la carga del archivo `.env` con `load_dotenv()`.

``` sql
ARCHIVO: manage.py
 
UBICAR:
import os
import sys
 
REEMPLAZAR POR:


import sys
from pathlib import Path
 
_ROOT = Path(__file__).resolve().parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))
 
from config.project_python import use_project_python
 
use_project_python()
 
import os
 
# python-dotenv se instaló en este ISS, dentro de .venv.
from dotenv import load_dotenv
 
DEBAJO DE:
    """Run administrative tasks."""
 
AGREGAR:
    load_dotenv()
```

**Evidencia EVI-01-05a.** Reemplazo realizado anteriormente en `manage.py`: se agregó la ruta del proyecto, `use_project_python()` y `load_dotenv()`.

#### **Antes del Reemplazo:**

![](images/clipboard-332111666.png)

#### **Despues del Reemplazo:**

![](images/clipboard-3805084254.png)

**Evidencia EVI-01-05b.** Reemplazo realizado anteriormente en `config/wsgi.py`: se agregó `load_dotenv()` antes de definir `DJANGO_SETTINGS_MODULE`.

``` sql
ARCHIVO: config/wsgi.py
 
UBICAR:
import os
 
from django.core.wsgi import get_wsgi_application
 
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
 
REEMPLAZAR POR:
import os
 
# python-dotenv (este ISS) carga .env en el intérprete que arrancó el proceso.
from dotenv import load_dotenv
 
from django.core.wsgi import get_wsgi_application
 
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
```

El mismo parche en `config/asgi.py`, cambiando `wsgi` por `asgi` y `get_wsgi_application` por `get_asgi_application`.

![![](images/clipboard-3088793566.png)](images/clipboard-2892950474.png)

### Explicación

La configuración de ActivaFit permite seleccionar el motor de base de datos mediante una única variable de entorno, sin necesidad de modificar directamente el archivo de configuración de Django. A continuación, se describe la función de cada componente:

- **Intérprete de Python:** la función `use_project_python()` permite ejecutar `python3 manage.py runserver` sin activar previamente el entorno virtual. Sin embargo, para utilizar `pip`, es necesario activar el entorno mediante `source .venv/bin/activate`.

- **Carga de variables de entorno:** la función `load_dotenv()` carga las variables definidas en `.env`, respetando aquellas que ya existen en el entorno del sistema. Esto permite cambiar temporalmente el motor mediante `DB_ENGINE=mysql python manage.py test`, sin modificar el archivo `.env`.

- **Configuración única de la base de datos:** Django utiliza exclusivamente `DATABASES["default"]`, lo que permite que el ORM trabaje con el motor seleccionado sin requerir cambios adicionales en las consultas.

- **Conexión a Oracle:** el DSN se construye utilizando `SERVICE_NAME`, mientras que `PORT` se deja vacío en la configuración descrita. La conexión se realiza mediante el controlador `oracledb`.

- **Conexión a SQL Server:** el valor `mssql` se establece en `ENGINE`, de acuerdo con el identificador utilizado por `mssql-django`. Además, es necesario tener instalado el controlador ODBC Driver 18 en el sistema.

- **Configuración regional:** se establece el idioma español mediante `LANGUAGE_CODE = "es"`, la zona horaria de Colombia con `TIME_ZONE = "America/Bogota"` y el manejo de fechas y horas con `USE_TZ = True`.

El proceso de configuración sigue esta secuencia:

```         
.env → DB_ENGINE → database_from_environ → DATABASES["default"] → ORM
```

### Criterios de aceptación

- **AC-01-01:** verificar que los motores `postgresql`, `mysql`, `mssql` y `oracle` generen el valor de `ENGINE` correspondiente a cada configuración.

- **AC-01-02:** comprobar que la selección de un motor no reconocido produzca una excepción `ImproperlyConfigured`.

- **AC-01-03:** confirmar que la ausencia de una variable obligatoria provoque un error de configuración antes de intentar establecer la conexión.

- **AC-01-04:** validar que el DSN de Oracle incluya el parámetro `SERVICE_NAME`.

### Verificación

#### GATE

| **Criterio** | **Método de comprobación** | **Evidencia** | **Resultado** |
|----|----|----|----|
| AC-01-01 | Pruebas de configuración para cada motor | EVI-01-06 | PASS |
| AC-01-02 | Prueba con un motor no admitido | EVI-01-06 | PASS |
| AC-01-03 | Prueba con una variable obligatoria vacía | EVI-01-06 | PASS |
| AC-01-04 | Aserción para comprobar `SERVICE_NAME` | EVI-01-06 | PASS |
