const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Set up view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware to pass token, user and API_BASE_URL to all views
app.use((req, res, next) => {
  res.locals.token = req.cookies?.access_token || null;
  res.locals.user = req.cookies?.user ? JSON.parse(req.cookies.user) : null;
  res.locals.apiBase = process.env.API_BASE_URL || "http://localhost:3000/api";
  next();
});

// Routes
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

app.get("/login", (req, res) => {
  res.render("pages/login", { title: "Đăng nhập" });
});

app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard" });
});

app.get("/monthly-chart", (req, res) => {
  res.render("pages/monthly-chart", { title: "Biểu đồ độ mặn" });
});

app.get("/chart", (req, res) => {
  res.render("pages/monthly-chart", { title: "Biểu đồ độ mặn" });
});

app.get("/stations", (req, res) => {
  res.render("pages/stations", { title: "Danh sách trạm" });
});

app.get("/station-detail", (req, res) => {
  res.render("pages/station-detail", { title: "Chi tiết trạm" });
});

app.get("/station/:id", (req, res) => {
  res.render("pages/station-detail", {
    title: "Chi tiết trạm",
    stationId: req.params.id,
  });
});

app.get("/bulletins-latest", (req, res) => {
  res.render("pages/bulletins-latest", { title: "Công báo mới nhất" });
});

app.get("/bulletins", (req, res) => {
  res.render("pages/bulletins-latest", { title: "Công báo mới nhất" });
});

app.get("/bulletins-by-month", (req, res) => {
  res.render("pages/bulletins-by-month", { title: "Công báo theo tháng" });
});

app.get("/bulletins/month", (req, res) => {
  res.render("pages/bulletins-by-month", { title: "Công báo theo tháng" });
});

app.get("/weather", (req, res) => {
  res.render("pages/weather", { title: "Dự báo thời tiết" });
});

app.get("/forecast", (req, res) => {
  res.render("pages/weather", { title: "Dự báo thời tiết" });
});

// 404 - Must be at the end
app.use((req, res) => {
  res.status(404).render("pages/404", { title: "404 - Không tìm thấy" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});
