# My-Flower-Shop

A full-stack flower shop web application built with React (client) and Node.js/Express (server).

## Features

- Browse and search for flower products
- Add products to a shopping cart
- Checkout with customer details and shipping options
- Order confirmation and order lookup
- Responsive and modern design

## Project Structure

```
My Flower Shop/
│
├── Client/      # React client app
│   └── ...
│
├── Server/      # Node.js/Express server
│   └── ...
│
└── README.md    # This file
```

## Getting Started

### Prerequisites

- Node.js 
- npm
- MongoDB 

### Installation

#### 1. Clone the repository

```bash
git clone <repo-url>
cd 'My Flower Shop'
```

#### 2. Install server dependencies

```bash
cd Server
npm install
```

#### 3. Install client dependencies

```bash
cd ../Client
npm install
```

### Running the Project

#### 1. Start the server

```bash
cd Server
npm start
```
Server runs by default on [http://localhost:5000](http://localhost:5000)

#### 2. Start the client

```bash
cd ../Client
npm start
```
Client runs by default on [http://localhost:3000](http://localhost:3000)

### Environment Variables

- The server expects MongoDB to be running at `mongodb://localhost:27017/flower-shop` by default.

## Folder Details

- `Client/` - React app (components, pages, context, etc.)
- `Server/` - Express API, MongoDB models, controllers, routes
