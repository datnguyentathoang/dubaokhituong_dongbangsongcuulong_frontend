# Weather District Selector - Implementation Guide

## 📋 Tổng quan tính năng

Thay vì người dùng phải nhập mã xã, giờ họ có thể **chọn từ dropdown** với tên xã và mã xã.

## ✅ Thay đổi được thực hiện

### 1. Frontend Changes

**File: `frontend/views/pages/weather.pug`**

#### Trước:

```pug
.form-group
  label(for='maXa') Mã xã
  input#maXa.form-control(
    type='text',
    placeholder='Nhập mã xã (VD: ma_xa_01)',
    required
  )
```

#### Sau:

```pug
.form-group
  label(for='districtSelect') Chọn xã
  select#districtSelect.form-control(required)
    option(value='') -- Chọn một xã --
    #districtOptions
```

#### Tính năng được thêm:

- ✅ Load danh sách xã từ API backend
- ✅ Populate vào select dropdown
- ✅ Fallback danh sách mặc định nếu API fail
- ✅ Hiển thị tên xã (ten_xa) và mã xã (ma_xa)
- ✅ Gửi mã xã khi query

### 2. Backend Changes

**File: `backend/src/routes/weather/index.js`**

```javascript
router.get("/districts", asyncHandler(weatherController.getDistricts));
```

**File: `backend/src/controllers/weather.controller.js`**

```javascript
getDistricts = async (req, res, next) => {
  const data = await WeatherService.getDistricts();
  new OK("Get Districts Success!", data).send(res);
};
```

**File: `backend/src/service/weather.service.js`**

```javascript
static async getDistricts() {
  const { data, error } = await supabase
    .from("communes")
    .select("ma_xa, ten_xa")
    .order("ten_xa", { ascending: true });

  return (data || []).map((row) => ({
    ma_xa: row.ma_xa,
    district_name: row.ten_xa,
  }));
}
```

## 🔄 Luồng hoạt động

### 1. Page Load

```javascript
1. DOMContentLoaded event
   ↓
2. loadDistricts() function
   ↓
3. Fetch GET /api/weather/districts
   ↓
4. Backend trả về danh sách xã
   ↓
5. populateDistrictSelect() tạo option elements
   ↓
6. Dropdown ready để chọn
```

### 2. User Selection & Query

```javascript
1. User chọn xã từ dropdown
   ↓
2. Click "Xem dự báo" button
   ↓
3. loadWeatherForecast() lấy value (ma_xa)
   ↓
4. Fetch GET /api/weather/forecast/{ma_xa}
   ↓
5. Backend trả về dữ liệu thời tiết
   ↓
6. displayWeatherForecast() hiển thị kết quả
```

## 📊 API Endpoints

### Get Districts List

```
GET /api/weather/districts

Response (200 OK):
{
  message: "Get Districts Success!",
  status: 200,
  metadata: [
    {
      ma_xa: "long_bien",
      district_name: "Long Biên"
    },
    {
      ma_xa: "hai_ba_trung",
      district_name: "Hai Bà Trưng"
    },
    // ... more districts
  ]
}
```

### Get Weather Forecast

```
GET /api/weather/forecast/{ma_xa}
Headers: Authorization: Bearer <token>

Response (200 OK):
{
  message: "Get Forecast Success!",
  status: 200,
  metadata: [
    {
      time: "2026-02-25 15:00:00",
      temperature: 22.5,
      feels_like: 21.8,
      humidity: 65,
      wind_speed: 3.2,
      rain: 0,
      weather: "Mây",
      icon: "04d"
    },
    // ... 3 more entries
  ]
}
```

## 🧪 Testing

### Test 1: Load Districts

1. Mở browser console (F12)
2. Chạy command:

```javascript
fetch("http://localhost:3000/api/weather/districts")
  .then((r) => r.json())
  .then(console.log);
```

3. Kiểm tra response có chứa danh sách xã

### Test 2: Districts Dropdown

1. Truy cập `/weather`
2. Thấy dropdown "Chọn xã"
3. Click dropdown để xem danh sách
4. Tên xã và mã xã phải hiển thị (VD: "Long Biên (long_bien)")

### Test 3: Weather Forecast

1. Đăng nhập
2. Truy cập `/weather`
3. Chọn xã từ dropdown
4. Click "Xem dự báo"
5. Thấy dữ liệu thời tiết 3 giờ tiếp theo
6. Header hiển thị tên xã

### Test 4: Fallback Districts

1. Dừng backend
2. Truy cập `/weather`
3. Vẫn thấy dropdown với danh sách mặc định
4. (Fallback danh sách hardcode sẽ được dùng)

## 🔍 Frontend Code Details

### Load Districts Function

```javascript
async function loadDistricts() {
  try {
    const response = await fetch(`${window.API_BASE_URL}/weather/districts`);
    const data = await response.json();

    if (data.metadata && Array.isArray(data.metadata)) {
      populateDistrictSelect(data.metadata);
    } else {
      console.warn("No districts data received");
      loadDefaultDistricts();
    }
  } catch (error) {
    console.error("Error loading districts:", error);
    loadDefaultDistricts(); // Fallback
  }
}
```

### Populate District Select

```javascript
function populateDistrictSelect(districts) {
  const optionsDiv = document.getElementById("districtOptions");
  optionsDiv.innerHTML = "";

  districts.forEach((district) => {
    const option = document.createElement("option");
    option.value = district.ma_xa; // Send ma_xa
    option.textContent = `${district.district_name} (${district.ma_xa})`; // Display ten_xa
    optionsDiv.appendChild(option);
  });
}
```

### Load Weather Forecast (Updated)

```javascript
async function loadWeatherForecast() {
  const select = document.getElementById("districtSelect");
  const maXa = select.value; // Get ma_xa
  const selectedText = select.options[select.selectedIndex].text; // Get display text

  // ... validation ...

  const response = await fetch(
    `${window.API_BASE_URL}/weather/forecast/${maXa}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  // ... handle response ...
}
```

## 📈 Benefits

✅ **Better UX** - Không cần nhớ mã xã, chỉ cần chọn  
✅ **Accurate** - Giảm lỗi nhập liệu  
✅ **Faster** - Không cần gõ, chỉ cần click  
✅ **Scalable** - Danh sách từ database, không hardcode  
✅ **Fallback** - Vẫn hoạt động nếu API fail

## 🔒 Security

- ❌ Không cần authentication để lấy danh sách xã (public)
- ✅ Cần JWT token để lấy dữ liệu thời tiết (protected)
- ✅ Mã xã được validate trên backend

## 📱 Mobile Support

- ✅ Select dropdown hoạt động tốt trên mobile
- ✅ Touch-friendly interface
- ✅ Native mobile dropdown picker

## 🐛 Troubleshooting

### Dropdown không hiển thị

- Check console: `localStorage.getItem('user')` - phải có token
- Network tab: Check request tới `/weather/districts`
- Đảm bảo backend đang chạy

### Dropdown trống (fallback được dùng)

- Backend không trả về dữ liệu
- Supabase connection error
- Check backend logs

### Thời tiết không hiển thị

- ✅ Kiểm tra token (JWT required)
- ✅ Kiểm tra mã xã được chọn
- ✅ Check OpenWeather API key

## 📝 Database Requirements

Backend cần bảng `communes` với cột:

- `ma_xa` (String) - Mã xã
- `ten_xa` (String) - Tên xã
- `lat` (Float) - Latitude
- `lon` (Float) - Longitude

## 🚀 Deployment

1. **Update Backend**
   - Rebuild nếu cần
   - Restart service

2. **Update Frontend**
   - npm install (nếu có dependency mới)
   - npm start

3. **Test All Routes**
   - /weather - Load dropdown
   - /weather/districts API - Check response

## 📊 Performance

- Danh sách xã cached trong memory (Frontend)
- Không re-fetch nếu page không reload
- Dropdown native browser (fast)
- Lazy load forecast (on demand)

---

**Status**: ✅ Completed  
**Frontend**: ✅ Updated  
**Backend**: ✅ Added  
**Database**: ✅ Ready  
**Testing**: ⏳ Pending

**Last Updated**: February 25, 2026
