# Milkman Production Architecture (Django + DRF + React + JWT)

## Backend Structure

```text
milkman/
  accounts/
    models.py                # Custom User model (ADMIN/CUSTOMER) with one-admin rule
    authentication.py        # JWT authentication class for DRF
    permissions.py           # IsAdminRole / IsCustomerRole
    jwt_utils.py             # HS256 JWT issue/verify
    serializers.py           # login/register/setup/profile serializers
    views.py                 # auth APIs
    urls.py                  # /api/v1/auth/*
    management/commands/
      seed_admin.py          # one-time admin creation command
  operations/
    models.py                # Product, Subscription, Order, DeliverySchedule, Payment
    serializers.py           # domain serializers
    services.py              # daily delivery + dashboard aggregation logic
    views.py                 # admin/customer/public APIs
    urls.py                  # /api/v1/*
  milkman/
    settings.py              # AUTH_USER_MODEL + DRF auth defaults
    urls.py                  # only secure v1 routes
```

## Database Schema (Core)

- `accounts.User`
  - `role`: `ADMIN` or `CUSTOMER`
  - unique `email`
  - one-admin enforced at model level

- `operations.Product`
  - `name`, `category`, `price_per_unit`, `unit`, `image`, `is_available`

- `operations.Subscription`
  - `customer`, `product`, `quantity`, `delivery_type`, `start_date`, `status`

- `operations.SubscriptionSchedule`
  - weekday mapping for custom subscriptions (`0=Mon ... 6=Sun`)

- `operations.Order`
  - `customer`, `status`, `payment_status`, `delivery_date`, `total_amount`

- `operations.OrderItem`
  - `order`, `product`, `quantity`, `unit_price`, `line_total`

- `operations.DeliverySchedule`
  - generated list for daily deliveries from subscriptions + orders

- `operations.Payment`
  - placeholder payment object per order

## Authentication & RBAC

- JWT token is issued by `POST /api/v1/auth/login/`.
- JWT must be passed as `Authorization: Bearer <token>`.
- Role guards:
  - admin APIs: `IsAdminRole`
  - customer APIs: `IsCustomerRole`

## One-Admin Rule

- Admin cannot be created from public registration.
- Admin creation options:
  - `python manage.py seed_admin --name ... --email ... --password ...`
  - `POST /api/v1/auth/admin/setup/` with `setup_key` (disabled after first admin)
- If admin exists, additional admin creation is blocked.

## Main API Endpoints

### Auth
- `POST /api/v1/auth/admin/setup/`
- `POST /api/v1/auth/customer/register/`
- `POST /api/v1/auth/login/`
- `GET/PATCH /api/v1/auth/me/`

### Public
- `GET /api/v1/public/products/`

### Admin
- `GET /api/v1/admin/dashboard/`
- `GET /api/v1/admin/deliveries/today/`
- `CRUD /api/v1/admin/products/`
- `PATCH /api/v1/admin/products/{id}/availability/`
- `GET /api/v1/admin/customers/`
- `GET /api/v1/admin/customers/{id}/`
- `POST /api/v1/admin/customers/{id}/activate/`
- `POST /api/v1/admin/customers/{id}/deactivate/`
- `GET /api/v1/admin/customers/{id}/subscriptions/`
- `GET /api/v1/admin/customers/{id}/orders/`
- `GET /api/v1/admin/subscriptions/`
- `GET /api/v1/admin/orders/`
- `PATCH /api/v1/admin/orders/{id}/status/`
- `GET /api/v1/admin/payments/`

### Customer
- `CRUD /api/v1/customer/subscriptions/`
- `POST /api/v1/customer/subscriptions/{id}/pause/`
- `POST /api/v1/customer/subscriptions/{id}/resume/`
- `POST /api/v1/customer/subscriptions/{id}/cancel/`
- `CRUD /api/v1/customer/orders/`
- `GET /api/v1/customer/deliveries/?date=YYYY-MM-DD`

## Delivery Logic

- Service: `operations.services.generate_today_deliveries()`
  - Includes active subscriptions:
    - daily
    - alternate days
    - custom weekdays
  - Includes one-time orders due today
  - Produces:
    - today delivery list
    - totals by product
    - total quantity

## Frontend Page Structure (React)

```text
/login/admin                     # admin login only
/login/customer                  # customer login only
/register/customer               # customer registration only
/admin/dashboard                 # KPI + operations
/admin/products                  # product management
/admin/customers                 # customer list/profile
/admin/subscriptions             # all subscriptions
/admin/orders                    # order list + date filters + status update
/products                        # public catalog
/customer/subscriptions          # manage subscription (pause/resume/cancel)
/customer/orders                 # order history
/customer/deliveries             # delivery schedule
/customer/profile                # profile management
```
