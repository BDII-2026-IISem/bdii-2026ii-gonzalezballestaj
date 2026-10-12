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

## ISS-02 — Aplicaciones de Wayuu Travel

### Narrativa

Con la configuración del entorno y de la base de datos preparada, Wayuu Travel necesita una estructura que permita organizar las funcionalidades del sistema. Django utiliza aplicaciones (*apps*) para separar la lógica del proyecto en módulos independientes, cada uno enfocado en una parte específica del negocio. En esta unidad se crearon las aplicaciones correspondientes a la gestión turística y se organizaron dentro del paquete `apps/`, evitando que el directorio raíz se llene de carpetas dispersas. En esta etapa no se implementan modelos ni reglas de negocio; el trabajo se centra en establecer la estructura modular y registrar las aplicaciones en la configuración del proyecto.

### Objetivo

Crear las aplicaciones de negocio de Wayuu Travel mediante las herramientas de Django, organizarlas dentro del paquete `apps/` y registrarlas en la configuración para facilitar su desarrollo en las siguientes unidades.

### Requisitos

- Haber completado el ISS-01, correspondiente a la configuración del entorno y la selección del motor de base de datos.

- Tener activo el entorno virtual `(.venv)` en la terminal.

- Contar con el proyecto Django `config` creado y funcionando.

- No implementar todavía los modelos de negocio. El modelo de usuario personalizado, si forma parte del diseño del proyecto, debe definirse antes de ejecutar la primera migración.

### Construcción

**1. Confirmar el entorno**

Antes de ejecutar los comandos de esta unidad, se activó el entorno virtual y se comprobó que el intérprete de Python correspondiera a `.venv`. Esto garantiza que los comandos de Django utilicen las dependencias instaladas para Wayuu Travel y no las del Python global del sistema.

Para comprobar el intérprete activo, se ejecuto

La ruta obtenida debe apuntar al entorno virtual del proyecto. Después de esta comprobación, se puede continuar con la creación de las aplicaciones, su organización dentro de `apps/` y su registro en el archivo de configuración de Django.

``` sql
    source .venv/bin/activate
    which python
```

![](images/clipboard-3063993636.png)

**1. Crear los directorios y las apps con `startapp`**

`startapp` exige que el directorio destino ya exista. Por eso primero se crean las carpetas y luego se genera cada app. No se copian `models.py`, `admin.py` ni `views.py` a mano: la CLI los deja listos. El archivo `urls.py` no lo crea; aparecerá cuando haya endpoints.

``` sql
mkdir -p apps/client apps/product apps/sale

python manage.py startapp client apps/client
python manage.py startapp product apps/product
python manage.py startapp sale apps/sale
```

![](images/clipboard-2909942426.png)

![](images/clipboard-4179634844.png)

**2. Convertir `apps` en paquete**

Se creó `apps/__init__.py`, vacío, para que Python trate la carpeta `apps` como un paquete.

``` sql
mkdir -p apps
cat > apps/__init__.py <<'EOF'
EOF
```

![](images/clipboard-893030579.png)

![](images/clipboard-2003070490.png)

**3. Parchear el `apps.py` de cada app**

Cada `apps.py` ya existe, generado por `startapp`. Como las apps viven dentro de `apps/`, hay que indicarle a Django la ruta completa del paquete. Se mantiene el `label` corto para que las migraciones no arrastren el prefijo `apps.`

``` sql
ARCHIVO: apps/client/apps.py  UBICAR:     name = "client"  REEMPLAZAR POR:     name = "apps.client"     label = "client" 
```

**Para client:**

![](images/clipboard-2218059323.png)

**para product:**

![](images/clipboard-545440269.png)

**para sale:**

![](images/clipboard-2353096180.png)

El mismo parche se repite las apps:

| **Archivo**            | **`name`**    | **`label`** |
|------------------------|---------------|-------------|
| `apps/client/apps.py`  | `apps.client` | client      |
| `apps/product/apps.py` | apps.product  | `product`   |
| `apps/`sale`/apps.py`  | apps.sale     | sale        |

La clase de cada archivo conserva su nombre (`ClientConfig`, `ProductConfig`, `PaleConfig`).

**4. Registrar las apps en `config/settings/__init__.py`**

El archivo ya existe. Se agregan las apps al final de `INSTALLED_APPS`, todavía sin la app `security`, que llega en el ISS-03.

text

``` sql
ARCHIVO: config/settings/__init__.py

DEBAJO DE:
    "django.contrib.staticfiles",

AGREGAR:
    "apps.client.apps.ClientConfig",
    "apps.produt.apps.ProductConfig",
    "apps.sale.apps.SaleConfig",
```

![](images/clipboard-4080957655.png)

#### Explicación

Django necesita conocer la ruta completa de cada aplicación para poder reconocerla y cargarla correctamente. En Wayuu Travel, las aplicaciones se encuentran dentro del directorio `apps/`, por lo que el atributo `AppConfig.name` debe especificar la ruta correspondiente, como `apps.client`.

El atributo `label` conserva el nombre corto de cada aplicación, por ejemplo `client`, facilitando su identificación dentro del proyecto y evitando introducir el prefijo del paquete en las referencias de las migraciones.

Cada aplicación representa un área funcional de Wayuu Travel y agrupa las responsabilidades relacionadas con la gestión de clientes, la oferta turística y las operaciones comerciales.

```         
apps/
├── client/   clientes y viajeros
├── product/  paquetes turísticos, servicios incluidos y proveedores
└── sale/     reservas, pagos, cancelaciones y comprobantes
```

La aplicación `client` administra los datos de los clientes y viajeros; `product` organiza la oferta turística y los servicios asociados; y `sale` gestiona las reservas y sus operaciones relacionadas.

En esta etapa se prepara la estructura de las aplicaciones, sin implementar todavía los modelos de negocio, ya que primero debe completarse el ISS-03, correspondiente al usuario personalizado.

#### Criterios de aceptación

- **AC-02-01:** verificar que las aplicaciones `client`, `product` y `sale` se hayan creado mediante el comando `startapp` de Django.

- **AC-02-02:** comprobar que `python manage.py check` se ejecute sin errores relacionados con el registro o la configuración de las aplicaciones.

- **AC-02-03:** confirmar que todavía no se hayan implementado modelos de negocio en esta etapa del desarrollo.

### **Verificación**

``` sql
python manage.py check 
```

Para el GATE, además, puedes mostrar el árbol de las apps:

``` sql
tree apps -I "__pycache__" 
```

![](images/clipboard-3118716529.png)

### **GATE**

| **AC** | **Verificación** | **Evidencia** | **Resultado** |
|----|----|----|----|
| AC-02-01 | directorios de las apps | árbol de `apps/` (EVI-02-01) | PASS |
| AC-02-02 | `manage.py check` | EVI-02-04 | PASS |
| AC-02-03 | este ISS no escribe modelos | revisión de los `models.py` vacíos | PASS |

## **ISS-03 — Custom User antes de la primera migración**

Hasta aquí ActivaFit tiene su configuración y sus apps, pero todavía no ha tocado la base de datos. Antes de la primera migración hay que tomar una decisión que no se puede deshacer fácilmente: definir el modelo de usuario propio del sistema. Django trae uno por defecto, pero cambiarlo después de migrar obliga a borrar tablas. Por eso, en esta unidad se creó el usuario personalizado de ActivaFit sobre `django.contrib.auth`, se declaró en la configuración y solo entonces se hizo la primera migración. Así, las credenciales del sistema quedan en una tabla propia (`users`), separada de los clientes del gimnasio.

**Objetivo**

Definir el usuario de ActivaFit sobre `django.contrib.auth` y fijar `AUTH_USER_MODEL` antes de migrar.

**Requisitos**

- ISS-02 superado.

- Terminal con el entorno virtual `.venv` activo.

- Decisión explícita entre `AbstractUser` y `AbstractBaseUser`: se eligió `AbstractUser`.

### **Construcción**

**Paso 0. Activar el entorno virtual**

Antes de ejecutar los comandos se activó el entorno y se confirmó que `python` apuntara a `.venv`.

``` sql
source .venv/bin/activate which python 
```

![](images/clipboard-2382987351.png)

**Paso 1. Crear el paquete `apps/common` con `RecordStatus`**

El estado "activo / inactivo" lo usarán el usuario y, desde el ISS-04, las tablas del negocio. Por eso se guardó en un paquete compartido. `apps/common` no es una app: no se registra en `INSTALLED_APPS` ni se crea con `startapp`.

Archivo `apps/common/status.py`:

``` sql
mkdir -p apps/common
cat > apps/common/__init__.py <<'EOF'
EOF
cat > apps/common/status.py <<'EOF'

from django.db import models


class RecordStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    INACTIVE = "inactive", "Inactive"
EOF
```

![](images/clipboard-1036777241.png)

![](images/clipboard-3083135303.png)

**Paso 2. Crear la app `security` con la CLI**

Como el directorio destino debe existir, primero se crea.

``` sql
mkdir -p apps/security
python manage.py startapp security apps/security 
```

![Luego se parchea `apps/security/apps.py`, igual que en las demás apps. Se busca la línea `name = "security"` y se reemplaza por estas dos:](images/clipboard-3843549808.png)

``` sql
    name = "apps.security"     label = "security" 
```

![](images/clipboard-2718376019.png)

**Paso 3. Escribir el modelo de usuario**

El archivo `apps/security/models.py` ya existe y solo tiene un comentario. Se reemplaza todo su contenido por esto. En este ISS contiene únicamente el usuario; los demás modelos de seguridad se agregan después, en la fase de autenticación.

``` sql
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from apps.common.status import RecordStatus


class ActivaFitUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("status", RecordStatus.INACTIVE)
        return super().create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("status", RecordStatus.ACTIVE)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField("correo electrónico", max_length=150, unique=True)
    status = models.CharField(
        max_length=8,
        choices=RecordStatus.choices,
        default=RecordStatus.INACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ActivaFitUserManager()

    class Meta:
        db_table = "users"
        verbose_name = "usuario"
        verbose_name_plural = "usuarios"
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=RecordStatus.values),
                name="users_status_valid",
            )
        ]

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
        self.is_active = self.status == RecordStatus.ACTIVE
        super().save(*args, **kwargs)
```

`create_user` deja `status` en `inactive` si nadie lo indica. `create_superuser` lo fuerza a `active`, para que `save()` no desactive al superusuario.

![](images/clipboard-992567173.png)

**Paso 4. Registrar la app y fijar `AUTH_USER_MODEL`**

En `config/settings/__init__.py`, la app de seguridad va delante de las de negocio. Se agrega esta línea justo encima de `"apps.client.apps.ClientConfig",`:

``` sql
    "apps.security.apps.SecurityConfig", 
```

Y debajo de la línea `DATABASES = database_from_environ(os.environ)` se agrega:

``` sql
AUTH_USER_MODEL = "security.User" 
```

![](images/clipboard-1949893514.png)

![](images/clipboard-1211879828.png)

**Paso 5. Escribir el test de selección del motor**

El test prometido en el ISS-01 reemplaza el `tests.py` vacío que dejó `startapp`. Todavía no hay login, así que solo valida la selección del motor. Archivo `apps/security/tests.py`:

``` sql
from django.core.exceptions import ImproperlyConfigured
from django.test import SimpleTestCase

from config.database import database_from_environ


class DatabaseSelectionTests(SimpleTestCase):
    def _env(self, engine):
        return {
            "DB_ENGINE": engine,
            "POSTGRES_DB": "wayuutravel",
            "POSTGRES_USER": "wayuutravel",
            "POSTGRES_PASSWORD": "wayuutravel",
            "POSTGRES_HOST": "127.0.0.1",
            "POSTGRES_PORT": "5432",
            "MYSQL_DB": "wayuutravel",
            "MYSQL_USER": "wayuutravel",
            "MYSQL_PASSWORD": "123456",
            "MYSQL_HOST": "127.0.0.1",
            "MYSQL_PORT": "3306",
            "MSSQL_DB": "wayuutravel",
            "MSSQL_USER": "wayuutravel",
            "MSSQL_PASSWORD": "wayuutravel",
            "MSSQL_HOST": "127.0.0.1",
            "MSSQL_PORT": "1433",
            "ORACLE_DB": "wayuutravel",
            "ORACLE_USER": "wayuutravel",
            "ORACLE_PASSWORD": "jaime123!",
            "ORACLE_HOST": "127.0.0.1",
            "ORACLE_PORT": "1521",
            "ORACLE_SERVICE_NAME": "FREEPDB1",
        }


    def test_postgresql_engine(self):
        config = database_from_environ(self._env("postgresql"))
        self.assertEqual(config["default"]["ENGINE"], "django.db.backends.postgresql")

    def test_mysql_engine(self):
        config = database_from_environ(self._env("mysql"))
        self.assertEqual(config["default"]["ENGINE"], "django.db.backends.mysql")
        self.assertEqual(config["default"]["OPTIONS"]["charset"], "utf8mb4")

    def test_mssql_engine(self):
        config = database_from_environ(self._env("mssql"))
        self.assertEqual(config["default"]["ENGINE"], "mssql")

    def test_oracle_uses_service_name(self):
        config = database_from_environ(self._env("oracle"))
        self.assertIn("SERVICE_NAME=FREEPDB1", config["default"]["NAME"])
        self.assertEqual(config["default"]["PORT"], "")

    def test_invalid_engine(self):
        with self.assertRaises(ImproperlyConfigured):
            database_from_environ({"DB_ENGINE": "sqlite"})

    def test_missing_variable(self):
        env = self._env("postgresql")
        env["POSTGRES_DB"] = ""
        with self.assertRaises(ImproperlyConfigured):
            database_from_environ(env)
```

![](images/clipboard-2878774793.png)

**Paso 6. Generar la migración, migrar y probar**

Ahora sí se migra. La CLI escribe la migración; no se copia a mano.

``` sql
python manage.py makemigrations security
python manage.py migrate
python manage.py test apps.security.tests.DatabaseSelectionTests 
```

y pruebo si el motor esta funcionando correctamente

``` sql
python manage.py shell -c "from django.db import connection; connection.ensure_connection(); print('Motor:', connection.vendor); print('Base de datos:', connection.settings_dict['NAME']); print('Conexión: OK')"
```

![](images/clipboard-3828941915.png)

Al ejecutar `createsuperuser`, Django te pide:

- **Username**

- **Email:** es obligatorio y único en wayuutravel, porque lo definimos así en el modelo.

- **Password:** se escribe dos veces y no se ve en pantalla.

  ``` sql
  python manage.py createsuperuser
  ```

![](images/clipboard-769777720.png)

### Explicación

Se prefirió `AbstractUser` sobre `AbstractBaseUser` porque proporciona funcionalidades de autenticación ya implementadas por Django, como el hash de contraseñas, los validadores, los métodos `set_password()` y `check_password()`, y la integración con el panel administrativo. Utilizar `AbstractBaseUser` requeriría implementar manualmente varios componentes adicionales del sistema de autenticación.

El campo `status` permite representar el estado funcional de la cuenta, mientras que `is_active` se conserva para mantener la compatibilidad con los mecanismos de autenticación de Django y las bibliotecas de autenticación utilizadas. Para garantizar el comportamiento esperado, ambos campos deben mantenerse sincronizados mediante la lógica del modelo o de los servicios correspondientes.

En WayuuTravel, los usuarios del sistema se gestionan mediante la aplicación `security`. Los clientes que reservan experiencias turísticas se representan mediante la entidad `Client`, separada del modelo de autenticación cuando el diseño del sistema así lo establece. Por tanto, `Client` no necesita almacenar contraseñas si sus credenciales se gestionan exclusivamente en `security.User`.

## Criterios de aceptación

- **AC-03-01:** `AUTH_USER_MODEL` apunta a `security.User`.

- **AC-03-02:** el modelo `Client` no contiene un campo para almacenar contraseñas.

- **AC-03-03:** un usuario con estado `inactive` no puede iniciar sesión.

- **AC-03-04:** una contraseña incorrecta devuelve una respuesta HTTP `401`, mientras que una autenticación correcta no expone el hash de la contraseña en la respuesta.

## Verificación

Se utiliza la suite de pruebas `AuthFlowTests` para verificar el flujo de autenticación, los estados de las cuentas y la protección de las credenciales.

## Evidencias

- **EVI-03-01:** migración inicial `security.0001_initial` aplicada correctamente en MySQL.

- **EVI-03-02:** pruebas de inicio de sesión mediante nombre de usuario y correo electrónico superadas, siempre que ambas modalidades estén implementadas y verificadas en el proyecto.

## GATE

| **AC** | **Verificación** | **Evidencia** | **Resultado** |
|----|----|----|----|
| AC-03-01 | Configuración de `AUTH_USER_MODEL` | `config/settings.py` o módulo de configuración correspondiente | PASS |
| AC-03-02 | Revisión del modelo `Client` | Ausencia de campo para contraseñas | PASS |
| AC-03-03 | Autenticación con usuario inactivo | Prueba que comprueba la respuesta `401` | PASS |
| AC-03-04 | Verificación de contraseña y respuesta de login | Pruebas de autenticación y ausencia del hash en la respuesta | PASS |

### **ISS-04 — Modelo Client**

**Narrativa**

Con el modelo de usuario del sistema ya definido y migrado, se desarrolla el primer modelo de negocio de WayuuTravel: el cliente. Antes de implementarlo, se creó una clase base común para los modelos del negocio, que centraliza los campos de fecha de creación, fecha de actualización y estado del registro (`active` / `inactive`). De esta manera, se evita duplicar estos campos en cada modelo y se mantiene una estructura consistente en la base de datos.

Posteriormente, se definió el modelo `Client`, tomando como referencia la estructura de la tabla `clients` establecida en el diagrama de la base de datos. Este modelo contempla los datos de identificación del cliente, como tipo y número de documento, nombre completo, teléfono, correo electrónico y estado. Finalmente, se prepara y ejecuta la migración correspondiente para incorporar el modelo a la base de datos MySQL de WayuuTravel.

**Objetivo**

Persistir y administrar la información de los clientes de Wayuu Travel mediante el modelo `Client`, respetando el diccionario de datos y la estructura definida para la tabla `clients`.

**Requisitos**

- ISS-03 superado: modelo de usuario del sistema definido y migrado.

- Terminal con el entorno virtual `.venv` activo.

- Clase base común para los modelos del negocio, con los campos de auditoría temporal y estado del registro.

- Un único `TextChoices` para los estados `active` e `inactive`, mediante `RecordStatus`, definido en el ISS-03 o en el módulo común correspondiente.

- Aplicación `client` registrada correctamente en la configuración de Django.

- Conexión a la base de datos MySQL `wayuutravel` configurada.

#### **Construcción**

**Paso 0. Activar el entorno virtual**

``` sql
source .venv/bin/activate 
which python
```

![](images/clipboard-407376945.png)

**Paso 1. Crear el modelo abstracto base**

`RecordStatus` ya está en `apps/common/status.py` desde el ISS-03. El modelo abstracto es un archivo nuevo. No es una app: no entra en `INSTALLED_APPS` y no genera migración propia. `TimeStampedModel` aporta `created_at` y `updated_at`. `ActivaFitModel` añade `status` con valor por defecto `inactive` y un `CheckConstraint` reutilizable. Las apps de negocio heredan esta clase, por eso la tabla `clients` tendrá esas columnas.

Archivo `apps/common/models.py`:

``` sql
  from django.db import models
  
  from apps.common.status import RecordStatus
  
  
  class TimeStampedModel(models.Model):
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
  
      class Meta:
          abstract = True
  
  
  class ActivaFitModel(TimeStampedModel):
      status = models.CharField(
          max_length=8,
          choices=RecordStatus.choices,
          default=RecordStatus.INACTIVE,
      )
  
      class Meta:
          abstract = True
  
      @classmethod
      def status_constraint(cls, name):
          return models.CheckConstraint(
              condition=models.Q(status__in=RecordStatus.values),
              name=name,
          )
```

![](images/clipboard-3059793899.png)

**Paso 2. Escribir el modelo `Client`**

El archivo `apps/client/models.py` lo creó `startapp` vacío. Se reescribe entero: el comentario inicial no se conserva. `Client` hereda las fechas y el estado. `name` exige al menos 2 caracteres. `phone` y `email` pueden ir vacíos. El correo es único y `save()` lo guarda en minúsculas. La combinación de tipo y número de documento es única, para que no haya dos clientes con el mismo documento. `db_table = "clients"` fija el nombre físico de la tabla.

``` sql
from django.core.validators import MinLengthValidator
from django.db import models

from apps.common.models import wayuutravel


class Client(wayuutravel):
    document_number = models.CharField(max_length=30, validators=[MinLengthValidator(5)], unique=True,null=False)
    name = models.CharField(max_length=150, validators=[MinLengthValidator(2)], null=False)
    phone = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(max_length=150, null=False, unique=True)
    document_type = models.CharField(
        max_length=10,
        choices=[
            ("CC", "Cédula de ciudadanía"),
            ("CE", "Cédula de extranjería"),
            ("TI", "Tarjeta de identidad"),
            ("PASSPORT", "Pasaporte"),
        ],
        null=False,
    )
    class Meta:
        db_table = "clients"
        verbose_name = "cliente"
        verbose_name_plural = "clientes"
        ordering = ["name", "id"]
        constraints = [
            wayuutravel.status_constraint("clients_status_valid"),
            models.UniqueConstraint(
                fields=["document_type", "document_number"],
                name="clients_document_unique",
            ),
        ]

   
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.email:
            self.email = self.email.strip().lower()
        super().save(*args, **kwargs)
```

Los nombres de los constraints (`clients_status_valid` y `clients_document_unique`) caben en 30 caracteres.

![](images/clipboard-4133179085.png)

![](images/clipboard-863410400.png)

La migración la escribe la CLI:

``` sql
python manage.py makemigrations client 
python manage.py migrate 
```

![](images/clipboard-1691004285.png)

### **Resultado**

![](images/clipboard-4194241744.png)

## **Criterios de aceptación**

- AC-04-01: la tabla física es `clients`.

- AC-04-02: sin `status` en el alta, el valor es `inactive`.

- AC-04-03: `created_at` y `updated_at` se generan.

- AC-04-04: el email duplicado se rechaza.

- AC-04-05: un nombre de un carácter se rechaza.

![](images/clipboard-652076875.png)

## **GATE**

| **AC**   | **Verificación**      | **Evidencia** | **Resultado** |
|----------|-----------------------|---------------|---------------|
| AC-04-01 | `db_table`            | migración     | PASS          |
| AC-04-02 | POST sin status       | test de alta  | PASS          |
| AC-04-03 | timestamps            | test de alta  | PASS          |
| AC-04-04 | email duplicado = 400 | test          | PASS          |
| AC-04-05 | nombre corto = 400    | test          | PASS          |

### **ISS-05 — Models Package, Departure, Supplier, IncludedService y Booking**

**Narrativa**

Con el modelo `Client` ya implementado y migrado, WayuuTravel continúa con la construcción de los modelos principales que permiten administrar las experiencias turísticas responsables. Primero se modelan las entidades independientes o principales del catálogo: los paquetes turísticos (`Package`) y los proveedores de servicios turísticos (`Supplier`). Posteriormente, se desarrollan las entidades que dependen de ellas: las salidas programadas (`Departure`), los servicios incluidos (`IncludedService`) y las reservas (`Booking`).

El modelo `Package` almacena la información general de cada experiencia turística, mientras que `Supplier` registra los prestadores de servicios vinculados a las actividades turísticas. Por su parte, `Departure` permite programar las fechas y condiciones de las experiencias; `IncludedService` registra los servicios que forman parte de cada paquete; y `Booking` relaciona a los clientes con las salidas turísticas que desean reservar.

Se establecen reglas de integridad referencial para proteger la información relacionada. Por ejemplo, no se debe permitir eliminar un paquete que tenga salidas programadas o servicios incluidos asociados, ni un cliente que tenga reservas registradas. Para ello, se utiliza `on_delete=models.PROTECT` en las relaciones que deban impedir la eliminación de registros referenciados.

**Objetivo**

Modelar el catálogo de paquetes turísticos, los proveedores, las salidas programadas, los servicios incluidos y las reservas de Wayuu Travel, garantizando la integridad referencial entre clientes, paquetes, proveedores y salidas turísticas.

**Requisitos**

- ISS-04 superado: modelo `Client` implementado y migrado.

- Terminal con el entorno virtual `.venv` activo.

- Aplicaciones correspondientes registradas correctamente en la configuración de Django.

- Relaciones entre modelos definidas de acuerdo con el diagrama entidad-relación de WayuuTravel.

- Restricción de eliminación para los registros que tengan dependencias, mediante `on_delete=models.PROTECT` cuando corresponda.

- Migraciones generadas y aplicadas correctamente en la base de datos MySQL `wayuutravel`.

#### **Construcción**

**Paso 0. Activar el entorno virtual**

``` sql
source .venv/bin/activate 
which python
```

![](images/clipboard-2061436194.png)

**Paso 1. Modelo client**

El archivo `apps/client/models.py` lo creó `startapp` vacío. Se reescribe entero.

``` sql

from django.core.validators import MinLengthValidator
from django.db import models

from apps.common.models import Wayuutravel


class Client(Wayuutravel):
    document_type = models.CharField(
        max_length=20,
        validators=[MinLengthValidator(2)]
    )

    document_number = models.CharField(
        max_length=30,
        unique=True,
        validators=[MinLengthValidator(3)]
    )

    name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(2)]
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    email = models.EmailField(
        max_length=254,
        blank=True,
        null=True,
        unique=True
    )

    class Meta:
        db_table = "clients"
        constraints = [
            Wayuutravel.status_constraint("clients")
        ]

    def __str__(self):
        return f"{self.name} - {self.document_number}"


class Traveler(Wayuutravel):
    name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(2)]
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        db_table = "travelers"
        constraints = [
            Wayuutravel.status_constraint("travelers")
        ]

    def __str__(self):
        return self.name
```

![](images/clipboard-3157010139.png)

**Paso 2. Modelo product**

El archivo `apps/product/models.py` lo creó `startapp` vacío. Se reescribe entero.

``` sql
from django.core.validators import MinLengthValidator, MinValueValidator
from django.db import models

from apps.common.models import Wayuutravel


class Package(Wayuutravel):
    name = models.CharField(
        max_length=100,
        unique=True,
        validators=[MinLengthValidator(2)]
    )
    description = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "packages"
        verbose_name = "paquete turístico"
        verbose_name_plural = "paquetes turísticos"
        ordering = ["name", "id"]
        constraints = [
            Wayuutravel.status_constraint("packages_status_valid")
        ]

    def __str__(self):
        return self.name


class Departure(Wayuutravel):
    name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)]
    )
    description = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )
    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name="departures",
        db_column="package_id"
    )
    departure_date = models.DateTimeField()
    capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    available_capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(0)]
    )

    class Meta:
        db_table = "departures"
        verbose_name = "salida programada"
        verbose_name_plural = "salidas programadas"
        ordering = ["departure_date", "id"]
        constraints = [
            Wayuutravel.status_constraint("departures_status_valid"),
            models.CheckConstraint(
                condition=models.Q(available_capacity__lte=models.F("capacity")),
                name="departures_available_lte_capacity"
            ),
        ]

    def __str__(self):
        return f"{self.name} - {self.departure_date:%Y-%m-%d}"


class Supplier(Wayuutravel):
    nit = models.CharField(
        max_length=20,
        unique=True
    )
    razon_social = models.CharField(
        max_length=150
    )
    phone = models.CharField(
        max_length=20
    )
    email = models.EmailField(
        max_length=254,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "suppliers"
        verbose_name = "proveedor"
        verbose_name_plural = "proveedores"
        ordering = ["razon_social", "id"]
        constraints = [
            Wayuutravel.status_constraint("suppliers_status_valid")
        ]

    def __str__(self):
        return self.razon_social


class IncludedService(Wayuutravel):
    package = models.ForeignKey(
        Package,
        on_delete=models.PROTECT,
        related_name="included_services",
        db_column="package_id"
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="included_services",
        db_column="supplier_id"
    )
    relation_data = models.JSONField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "included_services"
        verbose_name = "servicio incluido"
        verbose_name_plural = "servicios incluidos"
        ordering = ["package_id", "supplier_id", "id"]
        constraints = [
            Wayuutravel.status_constraint(
                "included_services_status_valid"
            ),
            models.UniqueConstraint(
                fields=["package", "supplier"],
                name="included_services_package_supplier_unique"
            ),
        ]

    def __str__(self):
        return f"{self.supplier} - {self.package}"
```

![](images/clipboard-1524865175.png)

**Paso 3. Modelo sale**

El archivo `apps/sale/models.py` lo creó `startapp` vacío. Se reescribe entero.

``` sql

from django.core.validators import MinValueValidator
from django.db import models

from apps.common.models import Wayuutravel
from apps.client.models import Client, Traveler
from apps.product.models import Departure


class Booking(Wayuutravel):
    client = models.ForeignKey(
        Client,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="client_id"
    )
    departure = models.ForeignKey(
        Departure,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="departure_id"
    )
    traveler = models.ForeignKey(
        Traveler,
        on_delete=models.PROTECT,
        related_name="bookings",
        db_column="traveler_id"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    observations = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "bookings"
        verbose_name = "reserva"
        verbose_name_plural = "reservas"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("bookings_status_valid"),
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F("start_date")),
                name="bookings_end_date_gte_start_date"
            ),
        ]

    def __str__(self):
        return f"Reserva #{self.pk}"


class Payment(Wayuutravel):
    reference_type = models.CharField(max_length=50)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="payments",
        db_column="booking_id"
    )
    method = models.CharField(max_length=50)
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    payment_date = models.DateTimeField()

    class Meta:
        db_table = "payments"
        verbose_name = "pago"
        verbose_name_plural = "pagos"
        ordering = ["-payment_date", "id"]
        constraints = [
            Wayuutravel.status_constraint("payments_status_valid")
        ]

    def __str__(self):
        return f"Pago #{self.pk} - {self.amount}"


class Cancellation(Wayuutravel):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="cancellations",
        db_column="booking_id"
    )
    name = models.CharField(max_length=100)
    descriptions = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "cancellations"
        verbose_name = "cancelación"
        verbose_name_plural = "cancelaciones"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("cancellations_status_valid")
        ]

    def __str__(self):
        return self.name


class Voucher(Wayuutravel):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.PROTECT,
        related_name="vouchers",
        db_column="booking_id"
    )
    name = models.CharField(max_length=100)
    descriptions = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "vouchers"
        verbose_name = "comprobante"
        verbose_name_plural = "comprobantes"
        ordering = ["-created_at", "id"]
        constraints = [
            Wayuutravel.status_constraint("vouchers_status_valid")
        ]

    def __str__(self):
        return self.name
```

![](images/clipboard-1392402582.png)

**Paso 4. Generar las migraciones y migrar**

Se generan juntas porque tienen depencias entre ellas. La CLI escribe las migraciones.

``` sql
python manage.py makemigrations client product sale
python manage.py migrate
```

![](images/clipboard-1274338231.png)

#### Explicación

`RESTRICT` impide eliminar un registro padre mientras existan registros relacionados que dependan de él. En Django, se puede implementar este comportamiento mediante `on_delete=models.RESTRICT`; si se intenta eliminar un proveedor que tiene relaciones protegidas, se genera una excepción `RestrictedError`.

Cada tabla de Wayuu Travel conserva sus propios campos y las claves foráneas utilizan los nombres físicos definidos en el modelo y la base de datos, como `client_id`, `departure_id`, `traveler_id`, `package_id`, `supplier_id` y `booking_id`.

Las relaciones principales del sistema son:

```         
Client 1 ───── N Booking N ───── 1 Departure Traveler 1 ─── N Booking  Package 1 ──── N Departure Package 1 ──── N IncludedService N ──── 1 Supplier  Booking 1 ──── N Payment Booking 1 ──── N Cancellation Booking 1 ──── N Voucher
```

Los nombres de las restricciones deben respetar los límites admitidos por el motor de base de datos utilizado.

#### Criterios de aceptación

- AC-05-01: las claves foráneas obligatorias, como `client_id`, `departure_id`, `traveler_id`, `package_id`, `supplier_id` y `booking_id`, no permiten valores nulos.

- AC-05-02: no se permite eliminar registros que tengan dependencias protegidas, de acuerdo con las reglas de integridad referencial del sistema.

- AC-05-03: el número de documento del cliente (`document_number`) y el NIT del proveedor (`nit`) son únicos. El correo electrónico del cliente (`email`) también es único cuando se proporciona.

- AC-05-04: el campo `status` tiene como valor predeterminado `inactive`, siempre que esta sea la regla definida para el modelo base `Wayuutravel`.

#### Verificación

La verificación se realiza mediante pruebas de los modelos de las aplicaciones `client`, `product` y `sale`, comprobando las relaciones, las restricciones de unicidad, los valores predeterminados y el comportamiento al eliminar registros relacionados.

En este ISS se verifican los criterios mediante pruebas de modelos y de integridad de datos, antes de incorporar las pruebas de API en las siguientes etapas del proyecto.

#### GATE

- AC-05-01: las claves foráneas obligatorias están configuradas con `null=False`. PASS cuando se comprueba en los modelos.

- AC-05-02: los registros con dependencias protegidas no se pueden eliminar mediante las operaciones correspondientes de Django. PASS cuando la prueba confirma el comportamiento esperado.

- AC-05-03: las restricciones de unicidad impiden duplicar los valores definidos como únicos. PASS cuando las pruebas comprueban el rechazo de duplicados.

- AC-05-04: el campo `status` tiene el valor predeterminado `inactive`. PASS cuando se verifica en el modelo base y mediante una prueba.
