---
id: oauth-authorize
title: OAuth Authorization
---

### Endpoint
`GET /api/oauth/:service_name/authorize`

### Description
Redirects the user to the OAuth provider’s authorization URL for the specified service.

### Parameters
- **service_name** (string, path) - Name of the service for OAuth authorization.

### Responses
- **302 Redirect** - Redirects the user to the OAuth provider's authorization URL.
- **404 Not Found** - Returned if the specified service is not available.
- **500 Internal Server Error** - Returned if there is an issue with creating services.

### Example Request
```http
GET /api/oauth/github/authorize
```

### Example Response
Redirects to the authorization URL of the specified OAuth service.
