# **Название проекта**

Программное средство реализации тикет-сервиса со встроенным ИИ-ассистентом

Ссылки на репозитории сервера и клиента

---

## **Содержание**

1. [Архитектура](#Архитектура)
   1. [C4-модель](#C4-модель)
   2. [Схема данных](#Схема_данных)
2. [Функциональные возможности](#Функциональные_возможности)
   1. [Диаграмма вариантов использования](#Диаграмма_вариантов_использования)
   2. [User-flow диаграммы](#User-flow_диаграммы)
3. [Детали реализации](#Детали_реализации)
   1. [UML-диаграммы](#UML-диаграммы)
   2. [Спецификация API](#Спецификация_API)
   3. [Безопасность](#Безопасность)
   4. [Оценка качества кода](#Оценка_качества_кода)
4. [Тестирование](#Тестирование)
   1. [Unit-тесты](#Unit-тесты)
   2. [Интеграционные тесты](#Интеграционные_тесты)
5. [Установка и запуск](#installation)
   1. [Манифесты для сборки docker образов](#Манифесты_для_сборки_docker_образов)
   2. [Манифесты для развертывания k8s кластера](#Манифесты_для_развертывания_k8s_кластера)
6. [Лицензия](#Лицензия)
7. [Контакты](#Контакты)

---

## **Архитектура**

### C4-модель

Иллюстрация и описание архитектура ПС

![alt text](assets/container.png)
Контейнерный уровень в нотации C4

![alt text](assets/component.png)
Компонентный уровень в нотации C4

### Схема данных

Описание отношений и структур данных, используемых в ПС. Также представить скрипт (программный код), который необходим для генерации БД

![alt text](assets/database.png)
Физическая модель базы данных

---

## **Функциональные возможности**

### Диаграмма вариантов использования

Диаграмма вариантов использования и ее описание

### User-flow диаграммы

Описание переходов между части ПС для всех ролей из диаграммы ВИ (название ролей должны совпадать с тем, что указано на c4-модели и диаграмме вариантов использования)

![alt text](assets/userflow-initiator.png)
User-flow для инициатора обращения

![alt text](assets/userflow-operator.png)
User-flow для оператора службы поддержки

![alt text](assets/userflow-manager.png)
User-flow для менеджера сервисного обслуживания

---

## **Детали реализации**

### UML-диаграммы

Представить все UML-диаграммы , которые позволят более точно понять структуру и детали реализации ПС

![alt text](assets/class-diagram.png)
Диаграмма классов и интерфейсов в нотации UML

### Спецификация API

Представить описание реализованных функциональных возможностей ПС с использованием Open API (можно представить либо полный файл спецификации, либо ссылку на него)

### Безопасность

В IntelliTicket реализован отдельный модуль безопасности, который отвечает за аутентификацию пользователей, ролевую авторизацию и защиту данных при работе с API тикет‑сервиса.

Основные подходы:
- безопасное хранение паролей с использованием хеширования (bcrypt через passlib);
- аутентификация на основе JWT и схемы OAuth2PasswordBearer (FastAPI);
- ролевая авторизация на уровне эндпоинтов;
- проверка владельца ресурса при работе с персональными данными (тикеты конкретного пользователя).

#### Аутентификация

Для аутентификации используется стандартная схема OAuth2 с выдачей access‑токена формата JWT. Пароли никогда не хранятся в открытом виде – при регистрации и смене пароля на сервере вычисляется хеш, который и сохраняется в базе.

Пример модуля работы с паролями:

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

Модели пользователя и создание записи в базе:

```python
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    # "service_manager" – менеджер сервиса (админ системы),
    # "operator" – оператор службы поддержки,
    # "initiator" – инициатор обращения (обычный пользователь)
    role: str
```

```python
from sqlalchemy import Column, String, Boolean
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    # по умолчанию создаем обычного пользователя инициатора
    role = Column(String, nullable=False, default="initiator")
    is_active = Column(Boolean, default=True)
```

```python
from .security.passwords import get_password_hash
from .models.users import User


def create_user(db, user_in: UserCreate) -> User:
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

Выдача и проверка JWT‑токенов:

```python
from datetime import datetime, timedelta
from jose import jwt
from pydantic import BaseModel

SECRET_KEY = "super-secret-key-change-me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class TokenData(BaseModel):
    user_id: str | None = None
    role: str | None = None


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> TokenData:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return TokenData(
        user_id=payload.get("sub"),
        role=payload.get("role"),
    )
```

Эндпоинт аутентификации:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from .security.tokens import create_access_token
from .security.passwords import verify_password
from .models.users import User
from .dependencies import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)):
    user: User | None = (
        db.query(User).filter(User.email == form_data.username).first()
    )
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Учетная запись заблокирована",
        )
    access_token = create_access_token({"sub": user.id, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}
```

Общая зависимость для получения текущего пользователя:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .tokens import decode_token
from .models.users import User
from .dependencies import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)) -> User:
    token_data = decode_token(token)
    if token_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не удалось проверить токен",
        )
    user = db.query(User).get(token_data.user_id)
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден или заблокирован",
        )
    return user
```

#### Авторизация и роли

Поверх аутентификации реализована ролевая авторизация. Доступ к защищенным эндпоинтам ограничивается в зависимости от роли пользователя (service_manager, operator, initiator).

Вспомогательная зависимость `require_role` (`app/security/roles.py`):

```python
from fastapi import Depends, HTTPException, status
from .deps import get_current_user
from .models.users import User


def require_role(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Недостаточно прав для выполнения операции",
            )
        return current_user
    return role_checker
```

Пример ограничения доступа к эндпоинтам работы с тикетами (`app/api/tickets.py`):

```python
from fastapi import APIRouter, Depends
from .security.roles import require_role
from .models.users import User

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get(
    "/",
    dependencies=[Depends(require_role(["service_manager", "operator"]))],
)
def list_tickets(
    current_user: User = Depends(require_role(["service_manager", "operator"])),
):
    # Просмотр очереди тикетов (например, для менеджера сервиса и оператора)
    ...


@router.post(
    "/{ticket_id}/process",
    dependencies=[Depends(require_role(["service_manager", "operator"]))],
)
def process_ticket(
    ticket_id: str,
    current_user: User = Depends(require_role(["service_manager", "operator"])),
):
    # Обработка тикета
    ...
```

Такая схема гарантирует, что:
- инициатор обращений не имеет прямого доступа к очереди всех тикетов;
- оператор и менеджер сервиса могут работать с обращениями пользователей;
- административные операции (управление пользователями, настройками) доступны только роли service_manager.

#### Защита данных и взаимодействия

Дополнительно используются следующие механизмы безопасности:

- все защищенные эндпоинты требуют валидного JWT‑токена, в противном случае сервер возвращает 401;
- пароли пользователей всегда хешируются с помощью bcrypt;
- при работе с персональными данными тикетов проверяется совпадение идентификатора пользователя из токена с владельцем тикета в базе;
- рекомендуется разворачивать API только по HTTPS и ограничивать источники запросов (CORS) доверенными доменами фронтенда.

В совокупности эти механизмы обеспечивают безопасный вход в систему, разграничение прав доступа и защиту данных пользователей тикет‑сервиса IntelliTicket.

### Оценка качества кода

Используя показатели качества и метрики кода, оценить его качество

---

## **Тестирование**

### Unit-тесты

Представить код тестов для пяти методов и его пояснение

### Интеграционные тесты

Представить код тестов и его пояснение

---

## Установка и запуск

### Манифесты для сборки Docker образов

Для разработки и запуска IntelliTicket в контейнерах используются Docker манифесты для трех основных сервисов: базы данных PostgreSQL, backend на FastAPI и frontend на React + Vite. Ниже приведены их содержимое и краткие комментарии.  

#### docker-compose.yml

```yaml
version: "3.9"

services:
  db:
    image: postgres:16-alpine
    container_name: ticket_service_db
    environment:
      POSTGRES_DB: ticket_service
      POSTGRES_USER: ticket_service_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - ticket_service_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: ticket_service_backend
    env_file:
      - .env
    environment:
      DATABASE_URL: postgresql+psycopg2://ticket_service_user:${POSTGRES_PASSWORD}@db:5432/ticket_service
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      JWT_ALGORITHM: HS256
    depends_on:
      - db
    ports:
      - "8000:8000"
    networks:
      - ticket_service_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: ticket_service_frontend
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    ports:
      - "5173:5173"
    networks:
      - ticket_service_network

volumes:
  db_data:

networks:
  ticket_service_network:
    driver: bridge
```

* `db` – контейнер с PostgreSQL и именованным volume для хранения данных.  
* `backend` – FastAPI приложение, получает настройки из `.env` и переменных окружения.  
* `frontend` – React + Vite клиент, которому через `VITE_API_BASE_URL` передается URL backend сервера.  

#### Dockerfile backend

```dockerfile
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends     build-essential     libpq-dev     && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip &&     pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim

ENV PATH="/opt/venv/bin:$PATH"     PYTHONUNBUFFERED=1

RUN useradd -m -u 1000 ticketservice && mkdir -p /app && chown -R ticketservice:ticketservice /app
USER ticketservice
WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY backend/ /app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Первый этап (`builder`) собирает виртуальное окружение и зависимости, второй использует облегченный образ для запуска приложения.

#### Dockerfile frontend

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

На этапе сборки устанавливаются зависимости, далее поднимается dev сервер Vite, доступный снаружи по порту 5173.

#### Скрипт запуска docker compose

```bash
#!/bin/bash
set -e

echo "=== Разvertyvanie tiket-servisa (development) ==="

if ! command -v docker &>/dev/null; then
  echo "Oshibka: Docker ne ustanovlen"
  exit 1
fi

if ! command -v docker compose &>/dev/null; then
  echo "Oshibka: Docker Compose ne ustanovlen"
  exit 1
fi

if [ ! -f ".env" ]; then
  echo "Sozdanie faila .env iz .env.example"
  cp .env.example .env
  echo "Zapolnite znachenija POSTGRES_PASSWORD i JWT_SECRET_KEY v faile .env pered pervym zapuskom."
fi

docker compose pull || true
docker compose build
docker compose up -d

echo "Backend dostupen po adresu http://localhost:8000"
echo "Frontend dostupen po adresu http://localhost:5173"
```

Скрипт проверяет наличие Docker и Docker Compose, при необходимости создает `.env` и запускает `docker compose up -d`.

---

### Манифесты для развертывания k8s кластера

Для развертывания IntelliTicket в Kubernetes можно использовать отдельные манифесты для базы данных, backend и frontend. Предполагается, что образы уже собраны и размещены в доступном реестре (например, `ghcr.io/username/ticket-service-backend:latest` и `ghcr.io/username/ticket-service-frontend:latest`).  

#### Postgres (Deployment и Service)

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ticket-service-postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticket-service-postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ticket-service-postgres
  template:
    metadata:
      labels:
        app: ticket-service-postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: ticket_service
            - name: POSTGRES_USER
              value: ticket_service_user
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: ticket-service-secrets
                  key: POSTGRES_PASSWORD
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: ticket-service-postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: ticket-service-postgres
spec:
  selector:
    app: ticket-service-postgres
  ports:
    - port: 5432
      targetPort: 5432
```

#### Backend (Deployment и Service)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticket-service-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ticket-service-backend
  template:
    metadata:
      labels:
        app: ticket-service-backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/username/ticket-service-backend:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              value: postgresql+psycopg2://ticket_service_user:$(POSTGRES_PASSWORD)@ticket-service-postgres:5432/ticket_service
            - name: JWT_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: ticket-service-secrets
                  key: JWT_SECRET_KEY
            - name: JWT_ALGORITHM
              value: HS256
          envFrom:
            - secretRef:
                name: ticket-service-secrets
---
apiVersion: v1
kind: Service
metadata:
  name: ticket-service-backend
spec:
  selector:
    app: ticket-service-backend
  ports:
    - port: 8000
      targetPort: 8000
```

#### Frontend (Deployment и Service)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ticket-service-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ticket-service-frontend
  template:
    metadata:
      labels:
        app: ticket-service-frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/username/ticket-service-frontend:latest
          ports:
            - containerPort: 5173
          env:
            - name: VITE_API_BASE_URL
              value: http://ticket-service-backend:8000
---
apiVersion: v1
kind: Service
metadata:
  name: ticket-service-frontend
spec:
  type: NodePort
  selector:
    app: ticket-service-frontend
  ports:
    - port: 80
      targetPort: 5173
      nodePort: 30080
```

---

## **Лицензия**

Этот проект лицензирован по лицензии MIT - подробности представлены в файле [License.md](License.md)

---

## **Контакты**

Автор: marmikhailovskaya20@gmail.com
