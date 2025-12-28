# E-Commerce Full Stack Application

A complete full-stack E commerce mobile application built with React Native (Expo), Express.js, and MongoDB.

##  Features

### Frontend Features
User Authentication: Secure login and registration
Product Browsing: Browse products with images, descriptions, and ratings
Search & Filter: Search products and filter by category, price range, and ratings
Shopping Cart: Add, update, and remove items from cart
Checkout Process: Complete checkout with shipping and payment details
Order History: View past orders and order details
User Profile: Manage personal information and view order history
Responsive Design: Beautiful UI with React Native Paper components
Smooth Animations: Enhanced user experience with animations

### Backend Features
RESTful API: Well-structured Express.js API
MongoDB Database: Scalable NoSQL database
User Authentication: JWT-based authentication
Product Management: CRUD operations for products
Cart Management: Add, update, remove cart items
Order Processing: Create and manage orders
Profile Management: Update user information

##  Technology Stack

### Frontend
React Native with Expo
React Navigation (Stack & Bottom Tabs)
React Native Paper (UI Components)
React Native Animatable (Animations)
Axios (HTTP requests)
AsyncStorage (Local storage)

### Backend
Node.js with Express.js
MongoDB with Mongoose
JWT (Authentication)
bcryptjs (Password hashing)
CORS (Cross-origin resource sharing)

##  Project Structure


ecommerce-app/
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── navigation/
│   │   │   └── AppNavigator.js
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── ProductDetailScreen.js
│   │   │   ├── CartScreen.js
│   │   │   ├── CheckoutScreen.js
│   │   │   ├── OrderConfirmationScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── CategoriesScreen.js
│   │   └── services/
│   │       └── api.js
│   ├── App.js
│   └── package.json
└── backend/
    ├── models/
    │   ├── Product.js
    │   ├── User.js
    │   ├── Order.js
    │   └── Cart.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   ├── orders.js
    │   └── profile.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── seedData.js
    └── package.json
```

##  Installation & Setup

### Prerequisites
 Node.js (v14 or higher)
 MongoDB (local installation or MongoDB Atlas account)
 npm or yarn
 Expo CLI (for running the mobile app)

### Backend Setup

1. Navigate to backend directory:**
   bash
   cd backend
   

2. Install dependencies:
   bash
   npm install
  

3. Set up MongoDB:

   Option 1: Local MongoDB
   Install MongoDB from https://www.mongodb.com/try/download/community
   Start MongoDB service:
     bash
     # Windows
     net start MongoDB
     
     # macOS
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
    

   Option 2: MongoDB Atlas (Cloud)
    Create a free account at https://www.mongodb.com/cloud/atlas
    Create a new cluster
    Get your connection string
    Update the connection string in `server.js` (line 15)

4. Seed the database with sample products:
   bash
   npm run seed
   
   This will populate your database with 22 sample products across different categories.

5. Start the server:
   bash
   npm start
   
   The server will run on "http://localhost:3000"

### Frontend Setup

1. Navigate to frontend directory:
   bash
   cd frontend
  

2. Install dependencies:
  bash
   npm install
   

3. Configure API URL:
    Open frontend/src/services/api.js
    Update the `API_URL` constant:
     javascript
     // For Android Emulator
     const API_URL = 'http://10.0.2.2:3000/api';
     
     // For iOS Simulator or Physical Device
     const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';
     // Example: 'http://192.168.1.100:3000/api'
    

4. Start the Expo development server:
   bash
   npx expo start


5. Run the app:
    Press `a` for Android emulator
    Press `i` for iOS simulator
    Scan QR code with Expo Go app for physical device

##  App Screens

### 1. Authentication Screens
   Login Screen: User login with email and password
   Register Screen: New user registration with validation

### 2. Home Screen
Grid view of products
Search bar for product search
Category filters
Add to cart functionality
Pull to refresh

### 3. Product Detail Screen
Large product image
Product name, price, and description
Stock availability
Product ratings and reviews
Quantity selector
Add to cart button

### 4. Cart Screen
List of cart items with images
Quantity adjustment (+/-)
Remove item functionality
Total price calculation
Proceed to checkout button

### 5. Categories & Filter Screen
Category selection chips
Price range filter (min/max)
Sort options (price low/high, rating)
Search functionality
Clear filters option

### 6. Checkout Screen
Shipping address input
Payment method selection
Order summary with price breakdown
Place order button

### 7. **Order Confirmation Screen**
   - Success message with icon
   - Order ID and details
   - Ordered items list
   - Estimated delivery date
   - Total amount
   - Navigation to order history or continue shopping

### 8. **Profile Screen**
   - User information display
   - Edit profile functionality
   - Order history with status
   - Logout button

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get all categories

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders (Protected)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/create` - Create new order

### Profile (Protected)
- `GET /api/profile` - Get user profile
- `PUT /api/profile/update` - Update user profile

## 🔒 Authentication Flow

1. User registers or logs in
2. Server generates JWT token
3. Token is stored in AsyncStorage
4. Token is sent with every protected API request
5. Server validates token and processes request

## 💾 Database Schema

### Products Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  image_url: String,
  category: String,
  stock: Number,
  rating: Number,
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    date: Date
  }]
}
```

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  address: String,
  phone: String
}
```

### Orders Collection
```javascript
{
  user_id: ObjectId (ref: User),
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    name: String,
    image_url: String
  }],
  total_amount: Number,
  status: String,
  shipping_address: String,
  payment_method: String,
  order_date: Date
}
```

### Cart Collection
```javascript
{
  user_id: ObjectId (ref: User),
  product_id: ObjectId (ref: Product),
  quantity: Number
}
```

## 🎨 UI/UX Features

- **Material Design**: Using React Native Paper components
- **Smooth Animations**: React Native Animatable for transitions
- **Loading States**: Activity indicators during data fetching
- **Error Handling**: User-friendly error messages
- **Form Validation**: Input validation on forms
- **Responsive Design**: Works on various screen sizes
- **Badge Notifications**: Cart item count badge
- **Pull to Refresh**: Refresh product lists
- **Empty States**: Helpful messages when no data

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory (optional):
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend Configuration
Update `frontend/src/services/api.js` with your server URL.

## 🧪 Testing the Application

1. **Start MongoDB** (if using local)
2. **Start Backend Server**: `npm start` in backend folder
3. **Start Frontend**: `npx expo start` in frontend folder
4. **Seed Database**: `npm run seed` in backend folder (first time only)

### Test User Account
You can create a new account through the app, or use these test credentials:
- Create an account through the Register screen
- The app requires a valid email format and password (min 6 characters)

### Test Flow
1. Register a new account
2. Browse products on home screen
3. View product details
4. Add items to cart
5. Adjust quantities in cart
6. Proceed to checkout
7. Enter shipping address
8. Place order
9. View order confirmation
10. Check order history in profile

## 📸 Screenshots

*(Add screenshots of your app here)*

## 🚨 Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running
- **Port Already in Use**: Change PORT in server.js or kill the process
- **Seed Data Not Working**: Check MongoDB connection and run `npm run seed` again

### Frontend Issues
- **Cannot Connect to Server**: Update API_URL with correct IP address
- **White Screen on Launch**: Check console for errors, ensure all dependencies are installed
- **Navigation Not Working**: Clear Metro bundler cache: `npx expo start -c`

### Common Solutions
```bash
# Clear Metro bundler cache
npx expo start -c

# Reinstall node_modules
rm -rf node_modules
npm install

# Reset Expo cache
npx expo start --clear
```

## 🔄 How Frontend Communicates with Backend

1. **User Action**: User interacts with the app (e.g., clicks "Add to Cart")
2. **API Call**: Frontend makes HTTP request using Axios
3. **Authentication**: JWT token is automatically added to request headers
4. **Server Processing**: Express.js server receives and processes the request
5. **Database Query**: Server queries MongoDB using Mongoose
6. **Response**: Server sends JSON response back to frontend
7. **State Update**: Frontend updates app state with received data
8. **UI Update**: React components re-render with new data

Example Flow:
```
User clicks "Add to Cart"
→ Frontend: addToCart(productId, quantity)
→ API: POST http://localhost:3000/api/cart/add
→ Backend: Receives request, validates JWT token
→ Database: Inserts cart item in MongoDB
→ Backend: Sends success response
→ Frontend: Updates cart state
→ UI: Shows "Added to cart" message
```

## 📝 Assignment Checklist

- ✅ 7 Screens (Login, Register, Home, Product Details, Cart, Checkout, Order Confirmation, Profile, Categories)
- ✅ Bottom Tab Navigation (Home, Categories, Cart, Profile)
- ✅ Stack Navigation (Product details, Checkout flow)
- ✅ Backend Server with Express.js
- ✅ MongoDB Database Integration
- ✅ User Authentication (JWT)
- ✅ Product CRUD Operations
- ✅ Cart Management
- ✅ Order Processing
- ✅ Form Validation
- ✅ Loading States
- ✅ Error Handling
- ✅ UI Library (React Native Paper)
- ✅ Animations (React Native Animatable)
- ✅ Search & Filter Functionality
- ✅ Category Filtering
- ✅ Price Range Filter
- ✅ Product Reviews Display
- ✅ Order History

## 👨‍💻 Development

### Adding New Features
1. Create new schema in `backend/models/`
2. Create routes in `backend/routes/`
3. Add API functions in `frontend/src/services/api.js`
4. Create screens in `frontend/src/screens/`
5. Update navigation in `frontend/src/navigation/AppNavigator.js`

### Code Style
- Use functional components with hooks
- Follow naming conventions (PascalCase for components, camelCase for functions)
- Add comments for complex logic
- Handle errors gracefully

## 🤝 Contributing

This is an educational project for Mobile Application Development course.

## 📄 License

This project is created for educational purposes.

## 📧 Contact

For any questions or issues, please contact the development team.

---

**Note**: This application is built for educational purposes as part of a Mobile Application Development assignment. Make sure to update the JWT_SECRET in production and implement proper security measures before deploying to production.

