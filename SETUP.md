# Frontend Setup & Installation Guide

## 📋 Requirements

- Node.js 14+ (recommended 16+)
- npm 6+ or yarn

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install:

- `express` - Web server framework
- `pug` - Template engine
- `cookie-parser` - Cookie middleware
- `dotenv` - Environment variables
- `nodemon` - Development auto-reload (dev)

### 2. Configure Environment Variables

Create or update `.env` file:

```bash
# .env
API_BASE_URL=http://localhost:3000/api
PORT=3001
NODE_ENV=development
```

### 3. Start the Server

**For production:**

```bash
npm start
```

**For development (with auto-reload):**

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3001**

## 📂 Project Structure

```
frontend/
├── views/                           # Pug templates
│   ├── layouts/
│   │   └── main.pug               # Main layout
│   └── pages/
│       ├── login.pug              # Login page
│       ├── dashboard.pug          # Dashboard
│       ├── monthly-chart.pug      # Monthly chart
│       ├── stations.pug           # Stations list
│       ├── station-detail.pug     # Station details
│       ├── bulletins-latest.pug   # Latest bulletins
│       ├── bulletins-by-month.pug # Bulletins by month
│       ├── weather.pug            # Weather forecast
│       └── 404.pug                # 404 error page
├── public/
│   ├── css/
│   │   ├── style.css              # Main styles
│   │   └── auth.css               # Auth page styles
│   └── js/
│       ├── api.js                 # API service
│       ├── auth.js                # Auth logic
│       └── utils.js               # Utilities
├── server.js                       # Express server
├── package.json                    # Dependencies
├── .env                           # Environment config
└── README.md                      # Documentation
```

## 🔧 Configuration Details

### Express Middleware Stack

The `server.js` sets up:

1. **Static files** - Serve CSS, JS from `public/` folder
2. **JSON parsing** - Parse JSON requests
3. **URL encoding** - Parse form data
4. **Cookie parsing** - Handle cookies
5. **Pug template engine** - Render views
6. **Locals middleware** - Pass data to all templates

### Key Variables in Templates

The `res.locals` middleware provides:

- `token` - Access token from cookies
- `user` - User info from cookies
- `apiBase` - API base URL (from env)

These are available in all Pug templates as:

```pug
#{token}
#{user}
#{apiBase}
```

Also available in JavaScript as:

```javascript
window.API_BASE_URL; // Set in main layout
```

## 🛣️ Routes

| Route                                       | Template               | Description        |
| ------------------------------------------- | ---------------------- | ------------------ |
| `/`                                         | redirect to dashboard  | Home page          |
| `/login`                                    | login.pug              | Login page         |
| `/dashboard`                                | dashboard.pug          | Dashboard          |
| `/monthly-chart` or `/chart`                | monthly-chart.pug      | Monthly chart      |
| `/stations`                                 | stations.pug           | Stations list      |
| `/station-detail`                           | station-detail.pug     | Station details    |
| `/bulletins` or `/bulletins-latest`         | bulletins-latest.pug   | Latest bulletins   |
| `/bulletins-by-month` or `/bulletins/month` | bulletins-by-month.pug | Bulletins by month |
| `/weather` or `/forecast`                   | weather.pug            | Weather forecast   |
| `/*`                                        | 404.pug                | 404 error page     |

## 🌍 API Integration

### Base URL

- **Local**: `http://localhost:3000/api`
- **Production**: Set via `API_BASE_URL` env variable

### API Endpoints Used

**Authentication:**

- `POST /api/access/login` - Login

**Salinity:**

- `GET /api/salinity/dashboard` - Dashboard stats
- `GET /api/salinity/monthly-chart` - Monthly chart data
- `GET /api/salinity/monthly-comment` - Monthly comment
- `POST /api/salinity/monthly-comment` - Save comment
- `GET /api/salinity/stations/all-station` - All stations
- `GET /api/salinity/stations/max-stations` - Max salinity by month
- `GET /api/salinity/station` - Station detail
- `GET /api/salinity/bulletins/latest` - Latest bulletins
- `GET /api/salinity/bulletins/` - Bulletins by month
- `POST /api/salinity/bulletins/` - Create bulletin

**Weather:**

- `GET /api/weather/forecast/:ma_xa` - Weather forecast

## 🔐 Authentication

### Login Flow

1. User enters username/password
2. Submit to `POST /api/access/login`
3. Backend returns: `{ metadata: { access_token, user: {...} } }`
4. Frontend saves `access_token` to `localStorage`
5. Redirect to dashboard

### Protected Requests

All subsequent API calls include JWT token:

```javascript
headers: {
  'Authorization': 'Bearer <access_token>'
}
```

### Token Expiry Handling

- If API returns 401, redirect to login page
- Token stored in `localStorage` survives page refresh
- Logout removes token from localStorage

## 🎨 Customization

### Change API URL

Edit `.env`:

```
API_BASE_URL=http://your-api-server:3000/api
```

### Change Port

Edit `.env`:

```
PORT=3002
```

### Customize Styles

Edit `public/css/style.css` or `public/css/auth.css`

### Add New Page

1. Create `views/pages/my-page.pug`:

```pug
extends ../layouts/main

block content
  // Your content here

block scripts
  script.
    // Your scripts here
```

2. Add route in `server.js`:

```javascript
app.get("/my-page", (req, res) => {
  res.render("pages/my-page", { title: "My Page" });
});
```

3. Add link in navbar (main.pug)

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change PORT in .env to different port (e.g., 3002)
# Or kill process using port 3001
```

### API Connection Issues

- Check `API_BASE_URL` in `.env`
- Ensure backend API is running on correct port
- Check CORS settings on backend if running on different domain

### Template Not Rendering

- Check Pug syntax in template file
- Clear browser cache
- Check browser console for errors

### Missing Dependencies

```bash
npm install
```

## 📝 Development Tips

### Hot Reload

Use `npm run dev` for auto-reload on file changes

### API Testing

- Use browser DevTools Network tab to inspect API requests
- Check response status and metadata structure

### Debug Mode

Add console.logs in browser to debug JavaScript:

```javascript
console.log("Value:", value);
console.error("Error:", error);
```

## 📦 Production Deployment

### Build for Production

```bash
npm install --production
```

### Run on Production

```bash
PORT=80 NODE_ENV=production npm start
```

### Use Process Manager (Recommended)

Use `pm2` or `forever` to keep server running:

```bash
npm install -g pm2
pm2 start server.js --name "frontend"
```

## 🔗 Related Links

- [Express.js Documentation](https://expressjs.com/)
- [Pug Template Engine](https://pugjs.org/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 📞 Support

For issues or questions:

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Verify API backend is running
4. Check network requests in DevTools

---

Last updated: February 2026
