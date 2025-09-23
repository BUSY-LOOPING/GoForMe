## Acess Token
``eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NTg1NjgwMTcsImV4cCI6MTc1ODU2ODkxN30.-cJ5jLbSA6VsAVNX4An452Wt9yhmDcao9-Ia-TrXX8c``
## User Registration
```
curl -X POST "http://localhost:5000/api/auth/register" ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"phone\":\"234567890\"}"
```
## User Login
```
curl -X POST "http://localhost:5000/api/auth/login" ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"test@example.com\",\"password\":\"Test123!@#\"}" ^
-c cookies.txt
```

- Response
    ```json
    {"success":true,"message":"Login successful","data":{"user":{"id":2,"email":"test@example.com","first_name":"John","last_name":"Doe","phone":"234567890","address":null,"city":null,"state":null,"zip_code":null,"date_of_birth":null,"profile_image":null,"email_verified":false,"phone_verified":false,"is_active":true,"last_login":"2025-09-22T19:14:07.491Z","createdAt":"2025-09-22T19:06:57.000Z","updatedAt":"2025-09-22T19:14:07.491Z","deletedAt":null,"roles":["user"]},"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE3NTg1Njg0NDcsImV4cCI6MTc1ODU2OTM0N30.WKMFiC24btDuNow4m3bebqiPrNkdrkuF1TPO9jv1gis","expires_in":900,"token_type":"Bearer"}}
    ```
## Get User Profile
```
curl -X GET "http://localhost:5000/api/auth/profile" ^
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" ^
-H "Content-Type: application/json"

```

- Response
    ```json
    {"success":true,"data":{"user":{"id":2,"email":"test@example.com","first_name":"John","last_name":"Doe","phone":"234567890","address":null,"city":null,"state":null,"zip_code":null,"date_of_birth":null,"profile_image":null,"email_verified":false,"phone_verified":false,"is_active":true,"last_login":"2025-09-22T19:14:07.000Z","createdAt":"2025-09-22T19:06:57.000Z","updatedAt":"2025-09-22T19:14:07.000Z","deletedAt":null,"roles":["user"]}}}
    ```