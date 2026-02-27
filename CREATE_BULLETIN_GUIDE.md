# Create Bulletin & Monthly Comment Feature

## ✅ Chức năng đã được hoàn thành

### 1. **Tạo/Cập nhật/Xóa Công báo (Bulletin CRUD)**

- ✅ Form tạo công báo mới
- ✅ Chỉnh sửa và xóa công báo với cùng một modal (trang latest)
- ✅ Các biểu tượng edit/delete xuất hiện cho user có quyền
- ✅ Gửi PATCH/DELETE request tới backend
- ✅ Client reload lại danh sách sau mọi thao tác

### 2. **Tạo Công báo (Create Bulletin)**

- ✅ Form tạo công báo mới
- ✅ Kiểm tra quyền admin/forecaster trên client
- ✅ Validation dữ liệu (ngày, tiêu đề, nội dung)
- ✅ Xử lý lỗi 401, 403
- ✅ Loading state khi gửi
- ✅ Notification thành công/lỗi
- ✅ Auto reload danh sách công báo

### 2. **Cập nhật Bình luận tháng (Monthly Comment)**

- ✅ Form cập nhật bình luận
- ✅ Kiểm tra quyền admin/forecaster
- ✅ Hiển thị bình luận cũ
- ✅ Xử lý lỗi kết nối
- ✅ Loading state
- ✅ Validation input

## 📝 Thay đổi chi tiết

### Bulletin Form (bulletins-by-month.pug)

**Trước:**

```pug
if user && (user.role === 'admin' || user.role === 'canbocanbovien')
  .create-bulletin-section
    // form code
```

**Sau:**

```pug
#createBulletinSection.create-bulletin-section.hidden
  // form code

// JavaScript checks role from localStorage
```

**Tính năng:**

- Form luôn hiển thị (ẩn đi nếu không có quyền)
- Kiểm tra token và user role từ localStorage
- Validation đầu vào
- Xử lý status 201 (Created)
- Xử lý 401 (redirect login) và 403 (no permission)

### Comment Form (monthly-chart.pug)

**Trước:**

```pug
if user && (user.role === 'admin' || user.role === 'forecaster')
  .comment-form
    // form code
```

**Sau:**

```pug
#commentFormSection.comment-form.hidden
  // form code

// JavaScript checks role from localStorage
```

**Tính năng:**

- Form ẩn hiện động dựa trên role
- Tải bình luận cũ vào textarea (để chỉnh sửa)
- Xác thực token trước gửi
- Xử lý các status code khác nhau

### CSS Styling

Thêm các style mới:

- `.create-bulletin-section` - Form tạo công báo
- `.comment-form` - Form cập nhật bình luận
- `.comment-section` - Container bình luận
- `.comment-content` - Hiển thị bình luận cũ

## 🔄 Luồng hoạt động

### Tạo Công báo

1. User truy cập `/bulletins-by-month`
2. JavaScript kiểm tra token và role
3. Nếu có quyền, hiển thị form
4. User nhập dữ liệu (from_date, to_date, title, content)
5. JavaScript validation
6. Gửi POST request với Authorization header
7. Backend xác thực và tạo bulletin
8. Reload danh sách công báo

### Cập nhật Bình luận

1. User truy cập `/monthly-chart`
2. Chọn tháng
3. JavaScript kiểm tra quyền
4. Nếu có quyền, hiển thị form (tải bình luận cũ)
5. User chỉnh sửa bình luận
6. Gửi POST request
7. Backend cập nhật bình luận
8. Reload hiển thị bình luận mới

## 📋 API Endpoints Được Sử Dụng

### Create Bulletin

```
POST /api/salinity/bulletins/
Headers: Authorization: Bearer <token>
Body: {
  from_date: "2026-02-01",
  to_date: "2026-02-28",
  title: "Tiêu đề",
  content: "Nội dung..."
}
Response: 201
{
  message: "Created",
  status: 201,
  metadata: { id, title, from_date, to_date, content, created_at }
}
```

### Update Bulletin

```
PATCH /api/salinity/bulletins/:id
Headers: Authorization: Bearer <token>
Body: {
  from_date: "2026-02-01",
  to_date: "2026-02-28",
  title: "Tiêu đề mới",
  content: "Nội dung mới"
}
Response: 200
{
  message: "Update Bulletin Success!",
  status: 200,
  metadata: { id, ... }
}
```

### Delete Bulletin

```
DELETE /api/salinity/bulletins/:id
Headers: Authorization: Bearer <token>
Response: 200
{
  message: "Delete Bulletin Success!",
  status: 200,
  metadata: { id }
}
```

### Update Monthly Comment

```
POST /api/salinity/monthly-comment
Headers: Authorization: Bearer <token>
Body: {
  year: "2026",
  month: "02",
  comment: "Bình luận..."
}
Response: 200/201
{
  message: "Success",
  status: 200,
  metadata: { month, comment, updated_at, forecaster_name }
}
```

### Get Monthly Comment

```
GET /api/salinity/monthly-comment?year=2026&month=02
Response: 200
{
  message: "Success",
  status: 200,
  metadata: { month, comment, updated_at, forecaster_name }
  // hoặc { comment: "" } nếu chưa có
}
```

## 🧪 Hướng dẫn test

### Test Tạo Công báo

1. Đăng nhập với tài khoản có role **admin** hoặc **forecaster**
2. Truy cập `/bulletins-by-month`
3. Form "Tạo công báo mới" sẽ hiển thị
4. Nhập dữ liệu:
   - Từ ngày: 2026-02-01
   - Đến ngày: 2026-02-28
   - Tiêu đề: "Công báo kiểm tra"
   - Nội dung: "Đây là nội dung test"
5. Click "Tạo công báo"
6. Nên thấy notification "Tạo công báo thành công!"
7. Danh sách công báo sẽ tự reload

### Test Lỗi Quyền

1. Đăng nhập bằng tài khoản **không phải admin/forecaster**
2. Truy cập `/bulletins-by-month`
3. Form "Tạo công báo mới" **sẽ ẩn đi**
4. Thử submit request bằng console sẽ nhận lỗi 403

### Test Token Hết Hạn

1. Đăng nhập
2. Xóa localStorage.access_token từ console
3. Try tạo công báo
4. Nên nhận lỗi "Token hết hạn" và redirect login

### Test Cập nhật Bình luận

1. Đăng nhập với admin/forecaster
2. Truy cập `/monthly-chart`
3. Chọn tháng
4. Form "Cập nhật bình luận" sẽ hiển thị
5. Nhập bình luận mới
6. Click "Lưu bình luận"
7. Notification thành công
8. Bình luận sẽ cập nhật

## 🐛 Troubleshooting

### Form không hiển thị

- ✅ Kiểm tra đã đăng nhập chưa (check browser console: `localStorage.getItem('access_token')`)
- ✅ Kiểm tra role của user có là admin/forecaster không (check: `localStorage.getItem('user')`)
- ✅ Kiểm tra browser console có error gì không (F12)

### Request lỗi 401

- Token hết hạn, cần đăng nhập lại

### Request lỗi 403

- User không có quyền, role không đúng

### Request lỗi 500

- Lỗi backend, check backend logs

## 📞 Kiểm tra dữ liệu

Mở browser console (F12 → Console) và chạy:

```javascript
// Kiểm tra token
localStorage.getItem("access_token");

// Kiểm tra user info
JSON.parse(localStorage.getItem("user"));

// Kiểm tra API URL
window.API_BASE_URL;

// Test API call
fetch(window.API_BASE_URL + "/salinity/bulletins/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
  body: JSON.stringify({
    from_date: "2026-02-01",
    to_date: "2026-02-28",
    title: "Test",
    content: "Test content",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

## ✅ Checklist

- [x] Form tạo công báo
- [x] Form cập nhật bình luận
- [x] Kiểm tra quyền từ localStorage
- [x] Validation input
- [x] Xử lý status code
- [x] Loading state
- [x] Error handling
- [x] Auto reload dữ liệu
- [x] CSS styling
- [x] Responsive design

---

📅 Updated: February 25, 2026
