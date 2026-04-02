# AirVista - Backend & Frontend Integration Guide

## Project Structure

```
airvista/
├── backend/              # Spring Boot API
│   ├── src/
│   │   ├── main/java/com/example/flight/
│   │   │   ├── config/       # CORS configuration
│   │   │   ├── controller/   # REST endpoints
│   │   │   ├── dto/          # Data Transfer Objects
│   │   │   ├── entity/       # JPA entities
│   │   │   ├── repository/   # Data access layer
│   │   │   ├── service/      # Business logic
│   │   │   └── FlightApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
├── pages/                # Next.js pages
├── components/           # React components
├── lib/                  # Utilities (api.ts, utils.ts)
├── .env.local           # Environment variables
├── package.json         # Frontend dependencies
└── README.md            # This file
```

## Setup Instructions

### 1. Backend Setup (Spring Boot)

Navigate to backend directory:
```bash
cd backend
```

Build the project:
```bash
mvn clean install
```

Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Frontend Setup (Next.js)

Install dependencies:
```bash
npm install
```

Ensure `.env.local` has the correct backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Run the frontend:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Running Both Simultaneously

You can open two terminals and run:
- **Terminal 1 (Backend):** `cd backend && mvn spring-boot:run`
- **Terminal 2 (Frontend):** `npm run dev`

## API Endpoints

All endpoints are prefixed with `http://localhost:8080/api`

### Flights
- `GET /flights` - Get all flights
- `GET /flights/{id}` - Get flight by ID
- `GET /flights/number/{flightNumber}` - Get flight by flight number
- `POST /flights` - Create a new flight
- `PUT /flights/{id}` - Update a flight
- `DELETE /flights/{id}` - Delete a flight

## Using the API in Frontend

Import `apiClient` from `lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Get all flights
const flights = await apiClient.get('/flights');

// Get flight by number
const flight = await apiClient.get('/flights/number/AA123');

// Create flight
const newFlight = await apiClient.post('/flights', {
  flightNumber: 'AA123',
  airline: 'American Airlines',
  departureAirport: 'JFK',
  arrivalAirport: 'LAX',
  departureTime: '2024-04-02T10:00:00',
  arrivalTime: '2024-04-02T12:00:00',
  availableSeats: 150,
  price: 299.99
});

// Update flight
const updated = await apiClient.put('/flights/1', updatedFlightData);

// Delete flight
await apiClient.delete('/flights/1');
```

## Database

The backend uses H2 in-memory database by default. Access the console at:
`http://localhost:8080/h2-console`

Default credentials:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

## Environment Variables

### Backend (.env files in backend/src/main/resources/)
- `spring.datasource.url` - Database connection URL
- `server.port` - Backend port (default: 8080)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration

## CORS Configuration

CORS is enabled for:
- Origins: `http://localhost:3000`, `http://localhost:8080`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: All headers allowed

To change allowed origins, update `backend/src/main/java/com/example/flight/config/CorsConfig.java`

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Ensure Java 17+ is installed: `java -version`
- Clear Maven cache: `mvn clean`

### API calls failing
- Verify backend is running on `http://localhost:8080`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors

### Port conflicts
- Change backend port in `application.properties`: `server.port=8081`
- Update `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8081/api`

## Next Steps

1. ✅ Build and run the backend
2. ✅ Connect frontend to backend API
3. Add authentication endpoints in backend
4. Add booking/reservation features
5. Deploy to production
