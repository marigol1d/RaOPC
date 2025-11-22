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

## **Установка и запуск**

### Манифесты для сборки docker образов

Представить весь код манифестов или ссылки на файлы с ними (при необходимости снабдить комментариями)

### Манифесты для развертывания k8s кластера

Представить весь код манифестов или ссылки на файлы с ними (при необходимости снабдить комментариями)

---

## **Лицензия**

Этот проект лицензирован по лицензии MIT - подробности представлены в файле [License.md](License.md)

---

## **Контакты**

Автор: marmikhailovskaya20@gmail.com
