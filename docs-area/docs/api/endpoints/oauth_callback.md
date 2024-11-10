---
id: oauth-callback
title: OAuth Callback
---

### Endpoint
`GET /api/oauth/:service_name/callback`

### Description
Handles the OAuth provider's callback, exchanges the authorization code for an access token, and verifies the user.

### Parameters
- **service_name** (string, path) - Name of the service for OAuth.
- **code** (string, query) - Authorization code from the OAuth provider.
- **mobile** (boolean, query) - Indicates if the request is from a mobile client.
- **token** (string, query) - Optional JWT token to verify user.

### Responses
- **200 OK** - Returns a success message with the JWT token if from a mobile client.
- **302 Redirect** - Redirects the user to the web base URL for browser clients.
- **400 Bad Request** - Returned if the code is invalid.
- **401 Unauthorized** - Returned if access token retrieval fails.
- **404 Not Found** - Returned if the specified service is not available.

### Example Request
```http
GET /api/oauth/github/callback?code=example_code
```

### Example Response (JSON)
```json
{
  "success": true,
  "message": "User logged-in",
  "token": "jwt_token"
}
```
