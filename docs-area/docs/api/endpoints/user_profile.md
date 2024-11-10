---
id: user-profile
title: User Profile
---

### Endpoint
`POST /api/profile`

### Description
Fetches the user's profile details, including connected services.

### Request Body
| Field | Type   | Location | Description                          |
|-------|--------|----------|--------------------------------------|
| token | string | body     | JWT token for user authentication.  |

### Responses
| Status Code | Description                              |
|-------------|------------------------------------------|
| **200 OK**  | Returns the user's profile details, including connected services. |
| **401 Unauthorized** | Returned if the token is invalid. |
| **404 Not Found** | Returned if the user is not found. |
| **500 Internal Server Error** | Returned if there is a server error. |

### Example Request
```http
POST /api/profile
Content-Type: application/json

{
  "token": "jwt_token"
}
```

### Example Response (200 OK)
```json
{
  "success": true,
  "profile": {
    "id": 123,
    "created_at": "2024-01-01T12:00:00Z",
    "services": [
      {
        "service_name": "GitHub",
        "service_email": "user@example.com"
      }
    ]
  }
}
```