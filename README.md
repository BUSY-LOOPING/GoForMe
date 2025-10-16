# GoForMe

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat&logo=stripe&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white)

A service marketplace platform connecting users with service providers for on-demand errands and tasks. This is a Minimum Viable Product (MVP) demonstrating core functionality for a task-based service platform.

## Project Status

This project is an MVP (Minimum Viable Product) developed as a demonstration of a full-stack service marketplace application. It showcases core features including user authentication, service requests, payment processing, and real-time order tracking.

## Features

- User authentication with email and Google OAuth
- Browse and request various services
- Dynamic service forms with custom fields
- Real-time pricing calculation with distance-based fees
- Secure payment processing with Stripe
- Order management and tracking
- Responsive design for mobile and desktop
- Docker containerization for easy deployment

## Tech Stack

### Backend
- Node.js with Express
- Sequelize ORM with MySQL
- JWT authentication
- Passport.js for OAuth
- Stripe payment integration
- Docker for containerization

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Stripe React Elements
- Tailwind CSS for styling
- Vite build tool

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Stripe account for payment processing
- Google Cloud Console project for OAuth (optional)

## Installation

### Clone the Repository

```
git clone https://github.com/BUSY-LOOPING/GoForMe.git
cd GoForMe
```

### Backend Setup

1. Navigate to backend directory:
    ```
    cd backend
    ```
2. Install dependencies:
    ```
    npm install
    ```
3. Create `.env` file:
    ```
    cp .env.example .env
    ```
4. Configure environment variables in `.env`:
    ```
    PORT=8000
    NODE_ENV=development
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_NAME=goforme
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d
    JWT_REFRESH_EXPIRES_IN=7d
    STRIPE_SECRET_KEY=your_stripe_secret_key
    STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_OAUTH_CALLBACK=http://localhost:8000/api/auth/google/callback
    FRONTEND_URL=http://localhost:5173
    ```

### Frontend Setup

1. Navigate to frontend directory:

    ```
    cd frontend
    ```

2. Install dependencies:
    ```
    npm install
    ```
3. Create `.env` file:
    ```
    cp .env.example .env
    ```
4. Configure environment variables in `.env`:
    ```
    VITE_API_URL=http://localhost:8000
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    VITE_NOMINATIM_API_URL=https://nominatim.openstreetmap.org
    ```


## Running Locally

### Without Docker

1. Start MySQL server locally

2. Run backend:
    ```
    cd backend
    npm run dev
    ```
3. Run frontend:
    ```
    cd frontend
    npm run dev
    ```

4. Access the application at `http://localhost:5173`

### With Docker

1. Create Docker network:
    ```
    docker network create goforme-network
    ```
2. Start MySQL (seperate container)

3. Start backend and frontend:
    ```
    docker-compose up -d --build
    ```

4. Access the application at `http://localhost:8080`

## Database Migrations

Migrations run automatically when the backend starts. To run manually:
```
cd backend
npx sequelize-cli db:migrate
```


To run seeders:
```
npx sequelize-cli db:seed:all
```


## Testing Payments

Use Stripe test cards for payment testing. In test mode, use the following card numbers:

### Successful Payments

| Brand | Card Number | CVC | Expiration |
|-------|-------------|-----|------------|
| Visa | 4242424242424242 | Any 3 digits | Any future date |
| Visa (debit) | 4000056655665556 | Any 3 digits | Any future date |
| Mastercard | 5555555555554444 | Any 3 digits | Any future date |
| Mastercard (debit) | 5200828282828210 | Any 3 digits | Any future date |
| American Express | 378282246310005 | Any 4 digits | Any future date |
| Discover | 6011111111111117 | Any 3 digits | Any future date |

### Declined Payments

| Description | Card Number | Error Code | Decline Code |
|-------------|-------------|------------|--------------|
| Generic decline | 4000000000000002 | card_declined | generic_decline |
| Insufficient funds | 4000000000009995 | card_declined | insufficient_funds |
| Lost card | 4000000000009987 | card_declined | lost_card |
| Stolen card | 4000000000009979 | card_declined | stolen_card |
| Expired card | 4000000000000069 | expired_card | n/a |
| Incorrect CVC | 4000000000000127 | incorrect_cvc | n/a |
| Processing error | 4000000000000119 | processing_error | n/a |

For more test cards, visit the [Stripe Testing Documentation](https://docs.stripe.com/testing?testing-method=card-numbers).

<!-- ## Project Structure -->


## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token

### Service Endpoints

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `GET /api/services/:id/fields` - Get service form fields
- `POST /api/services/:id/pricing` - Calculate pricing

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status

### Payment Endpoints

- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/methods` - Get saved payment methods
- `POST /api/payments/methods` - Save payment method
- `DELETE /api/payments/methods/:id` - Delete payment method

## Environment Variables

### Backend Required Variables

- `PORT` - Server port (default: 8000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USER` - Database user
- `DB_PASS` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend Required Variables

- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## Contributing

This is an MVP project and not currently accepting contributions. However, feedback and suggestions are welcome through GitHub issues.

## Known Limitations

As an MVP, this project has the following limitations:

- Limited error handling in some edge cases
- Basic user roles (no advanced permissions)
- Simplified runner assignment logic
- No real-time notifications system

## Future Enhancements

Potential features for future development:

- Real-time chat between users and runners
- Advanced search and filtering
- Rating and review system
- Runner application and verification process
- Admin dashboard for service management
- Mobile applications (iOS/Android)
- Email notifications
- Advanced analytics and reporting

## Security Considerations

This MVP includes basic security measures:

- JWT authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- SQL injection prevention via Sequelize ORM
- Input validation

For production deployment, additional security measures should be implemented.

## Troubleshooting

### Database Connection Issues

Ensure MySQL is running and credentials are correct in `.env` file.

### Port Already in Use

Change the PORT variable in backend `.env` or stop the conflicting process.



## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.