# Inventory Management System (IMS)

A robust **Inventory Management System (IMS)** built with **Node.js**, **MongoDB**, and **Kafka**. The system helps businesses manage inventory, track stock movements, generate reports, and send notifications for key events. The project focuses on backend architecture, API design, authentication, and business logic.

## Core Features
1. **User Management**:
   - Registration, login, and JWT-based authentication.
   - Role-based access control (Admin, Manager, Employee).

2. **Inventory Management**:
   - CRUD operations for inventory items.
   - Track stock movements (purchases, sales, returns).

3. **Reporting**:
   - Generate and email inventory reports (CSV).

4. **Notifications**:
   - Alerts for low stock and key transactions using Kafka.

## Tech Stack
- **Node.js** (Backend)
- **MongoDB** (Database)
- **Kafka** (Messaging)
- **JWT** (Authentication)
- **Bcrypt** (Password Encryption)

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inventory-management-system.git
   cd inventory-management-system
