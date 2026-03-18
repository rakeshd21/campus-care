# 🎓 CampusCare — College Problem Reporter

> A clean, full-stack web application where students can report campus problems and admins can manage, track, and resolve them — all powered by Firebase.

---

## 📸 Features

### 👨‍🎓 Student Portal (`index.html`)
- Submit problems with **category**, **priority**, **location**, and **description**
- Attach a **photo** of the issue (stored in Firebase Storage)
- View **all submitted reports** in a live feed with status badges
- See **admin responses/notes** on their complaints

### 🛠️ Admin Dashboard (`admin.html`)
- Secure **admin login** (username + password)
- Live **stats cards** — Total, Pending, In Progress, Resolved, High Priority
- **Filter reports** by status, category, and priority
- **Update report status** and add a note for the student
- Full data table with photo thumbnails, student details, and badges

---

## 🗂️ Project Structure

```
campuscare/
├── index.html      # Student portal — submit & view complaints
├── admin.html      # Admin dashboard — manage all reports
├── style.css       # Shared dark-theme stylesheet
├── script.js       # Student portal logic (Firebase read/write)
├── admin.js        # Admin dashboard logic (Firebase read/update)
└── firebase.js     # Firebase config & initialization
```

---

## 🚀 Getting Started

### 1. Clone or download this repo

```bash
git clone https://github.com/your-username/campuscare.git
cd campuscare
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Enable **Firestore Database** (start in test mode)
4. Enable **Storage** (for image uploads)
5. Register a **Web App** in Project Settings
6. Copy your config and paste it into `firebase.js`:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### 3. Open in browser

Since the project uses ES modules (`type="module"`), you need a local server — just opening the HTML file directly won't work.

```bash
# Option 1: VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Option 2: Python
python -m http.server 5500

# Option 3: Node.js
npx serve .
```

Then visit:
- **Student Portal** → `http://localhost:5500/index.html`
- **Admin Dashboard** → `http://localhost:5500/admin.html`

---

## 🔐 Admin Login

| Field    | Value   |
|----------|---------|
| Username | `admin` |
| Password | `1234`  |

> ⚠️ This is a hardcoded credential for demo purposes. For production, replace with Firebase Authentication.

---

## 🔥 Firebase Setup Details

### Firestore — Complaints Collection

Each document in the `complaints` collection stores:

| Field         | Type      | Description                          |
|---------------|-----------|--------------------------------------|
| `name`        | string    | Student's name                       |
| `rollNo`      | string    | Roll number                          |
| `category`    | string    | Infrastructure, Academics, etc.      |
| `issue`       | string    | Short problem title                  |
| `description` | string    | Detailed description                 |
| `location`    | string    | Where on campus                      |
| `priority`    | string    | `low` / `medium` / `high`            |
| `status`      | string    | `pending` / `in-progress` / `resolved` |
| `imageUrl`    | string    | Firebase Storage URL (if uploaded)   |
| `adminNote`   | string    | Admin's response message             |
| `createdAt`   | timestamp | Auto-set via `serverTimestamp()`     |

### Firestore Rules (for development)

In Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /complaints/{doc} {
      allow read, write: if true; // ⚠️ Open for dev only
    }
  }
}
```

### Storage Rules (for development)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // ⚠️ Open for dev only
    }
  }
}
```

> 🔒 Before going live, tighten these rules to require authentication.

---

## 🌐 Deployment

### Option 1: Firebase Hosting (Recommended — Free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to: . (current folder)
# Configure as single-page app: No
firebase deploy
```

Your app will be live at `https://YOUR_PROJECT_ID.web.app`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the project folder onto the dashboard
3. Done — instant live URL

### Option 3: GitHub Pages (Free)

1. Push the project to a GitHub repository
2. Go to repo **Settings → Pages**
3. Set source to `main` branch, root folder
4. Visit `https://your-username.github.io/campuscare`

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | HTML5, CSS3, Vanilla JavaScript     |
| Database  | Firebase Firestore                  |
| Storage   | Firebase Storage (image uploads)    |
| Fonts     | Outfit + JetBrains Mono (Google Fonts) |
| Hosting   | Firebase Hosting / Netlify / GitHub Pages |

---

## 📋 Categories Supported

| Icon | Category       |
|------|----------------|
| 🏗️  | Infrastructure |
| 📚  | Academics      |
| 🏠  | Hostel / Mess  |
| 🚌  | Transport      |
| 📶  | WiFi           |
| 📖  | Library        |
| ⚽  | Sports         |
| 💬  | Other          |

---

## 🔮 Future Improvements

- [ ] Firebase Authentication for student login
- [ ] Email notifications when complaint status changes
- [ ] Student-specific complaint history (per login)
- [ ] Admin role management (multiple admins)
- [ ] Analytics charts for complaint trends
- [ ] Mobile app using React Native + Firebase

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

Made with ❤️ for campus communities.
