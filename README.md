# REACT APP BOILERPLATE  

## Documentation

### Important
- uid: uid will be sent via GET request headers
- JWT token will be received as JSON response in "authtoken"
  property.

- To request protected API endpoints make sure
    * Headers have "Content-Type":"application/json"
    * Headers have authtoken : authtoken
    * The requesting url must have ?uid="<uid>" query

### Includes
- Firebase Authentication system
- Client side Protected Routes
- Login / Register page redirect to intended protected route
- Refreshing / Reloading protected route won't break
- Authentication indicating Navbar
- Request for JWT token after successful firebase Authentication
- Login / Register Page will redirect to previous page if user
  is Authenticated.
