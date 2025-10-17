# ExpressBk

##### API позволяет создавать и получать пользователей, события и брони

## Запуск

   Первый шаг 

        { docker-compose build --no-cache }
   Второй шаг

        { docker compose --profile migrations up migrations && docker compose up -d web }


## API

*Получить всех пользователей или пользователя по id (необязательный параметр)*

```plaintext
GET /api/users/:id?
```

*Создать пользователя*

```plaintext
POST /api/users
```

пример запроса ```{"username": string, "email": string, password: "string"}```


*Получить все брони или бронь по id (необязатель)*

```plaintext
GET /api/bookings/:id?
```

*Создать бронь*

```plaintext
POST /api/bookings
```

пример запроса ```{"event_id": number, "user_id": number}```
    

*Получить все события или событие по id (необязатель)*

```plaintext
GET /api/events/:id?
```

*Создать событие*

```plaintext
POST /api/events
```

пример запроса ```{"name": string, "total_seats": number}```