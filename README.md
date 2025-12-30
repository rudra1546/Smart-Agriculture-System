# 🌱 SMART AGRICULTURE SYSTEM - PROJECT INFORMATION

## PROJECT METADATA

### Team ID
`ID_86_IMPACTHIVE`  
*Please replace with your assigned Team ID*

### Track Number
`Track 3`  
*Please replace with your Track Number*

### Track Name
`Technology for Social Good & Sustainable Progress`  
*Example: AI/ML Track, Web Development Track, etc.*

---

## 📋 PROBLEM DEFINITION

### Problem Statement
Traditional agriculture faces significant challenges in maximizing crop yields and preventing crop loss due to diseases. Farmers often lack access to data-driven decision-making tools, leading to:
- Inefficient resource allocation
- Unexpected crop failures
- Difficulty in predicting yields
- Late disease detection causing significant losses
- Lack of personalized agricultural insights

### Solution
The Smart Agriculture System addresses key agricultural challenges by applying modern engineering and artificial intelligence techniques to promote sustainable and socially beneficial farming practices. The proposed solution includes:

**ML-Based Crop Yield Prediction**  
Uses machine learning models to predict crop yield based on soil nutrients, seasonal factors, field area, and historical agricultural data, helping farmers plan crops efficiently.

**AI-Powered Crop Health Analysis**  
Enables early detection of crop diseases through image-based analysis, reducing crop loss and minimizing excessive use of chemical pesticides.

**Personalized User Dashboards**  
Provides individual farmers with dashboards to view prediction history, analyze trends, and make informed agricultural decisions.

**Interactive Field Mapping Using GPS**  
Allows farmers to accurately select and measure their farmland using GPS-based mapping, improving prediction accuracy and resource planning.

**Multi-User and Scalable Platform**  
Supports multiple users securely, enabling wider adoption among farming communities and promoting inclusive access to smart farming technologies.

---

## 🛠️ TECHNOLOGY STACK

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| React Router | 6.x | Client-side routing |
| Vite | 5.x | Build tool & dev server |
| Leaflet | 1.9.x | Interactive maps |
| Geoman | 2.x | Polygon drawing on maps |
| Axios | 1.x | HTTP client |
| CSS3 | - | Styling & animations |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Programming language |
| Flask | 3.x | Web framework |
| MySQL | 8.0+ | Relational database |
| scikit-learn | 1.3.x | Machine learning |
| pandas | 2.x | Data manipulation |
| numpy | 1.x | Numerical computing |
| Pillow | 10.x | Image processing |

### External APIs & Libraries
- **OpenWeatherMap API** - Real-time weather data
- **OpenStreetMap** - Map tiles and geocoding
- **Turf.js** - Geospatial analysis

---

## 🔧 IMPLEMENTATION DETAILS

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React SPA)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │
│   (Flask)       │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    │         │          │          │
┌───▼───┐ ┌──▼──┐  ┌────▼────┐ ┌──▼──────┐
│ MySQL │ │ ML  │  │ Weather │ │  Image  │
│  DB   │ │Model│  │   API   │ │Processor│
└───────┘ └─────┘  └─────────┘ └─────────┘
```

### Key Features Implementation

#### 1. Multi-User Authentication System
- **Database**: MySQL with `users` table
- **Security**: Password hashing (to be enhanced with bcrypt)
- **Session Management**: localStorage-based user sessions
- **Features**: Signup, Login, Logout, Profile management

#### 2. Crop Yield Prediction
- **Algorithm**: Random Forest Regression
- **Input Features**: 
  - Soil nutrients (N, P, K)
  - pH level
  - Crop type
  - Season
  - Area (hectares)
  - Weather data (rainfall, temperature)
  - State/location
- **Output**: Predicted yield per hectare and total yield
- **Accuracy**: [Add your model accuracy here]

#### 3. Crop Health Analysis
- **Algorithm**: Convolutional Neural Network (CNN) / Image Classification
- **Process**: 
  1. User uploads crop leaf image
  2. Image preprocessing and normalization
  3. Model inference for disease detection
  4. Confidence score calculation
  5. Treatment recommendations
- **Supported Diseases**: [List the diseases your model can detect]

#### 4. Interactive Field Mapping
- **Library**: Leaflet.js with Geoman plugin
- **Features**:
  - GPS location detection
  - Polygon drawing for field boundaries
  - Real-time area calculation using Turf.js
  - Area conversion to hectares
- **Accuracy**: GPS-accurate within device limitations

#### 5. Prediction History & Analytics
- **Database**: `predictions` table with foreign key to users
- **Features**:
  - Historical data storage
  - Pagination support
  - Date-based sorting
  - Profile dashboard integration

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predictions Table
CREATE TABLE predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100),
    season VARCHAR(50),
    area DECIMAL(10,2),
    N DECIMAL(10,2),
    P DECIMAL(10,2),
    K DECIMAL(10,2),
    ph DECIMAL(4,2),
    state VARCHAR(100),
    predicted_yield DECIMAL(10,2),
    total_yield DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
```

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### Predictions
- `POST /api/predict_yield` - Generate crop yield prediction
- `GET /api/predictions/history` - Fetch user's prediction history
- `GET /api/predictions/count` - Get total prediction count

#### Analysis
- `POST /api/health_analysis` - Analyze crop health from image
- `GET /api/weather` - Get weather data for location
- `GET /api/soil_nutrients` - Get soil nutrient recommendations

---

## 👥 TEAM MEMBER INFORMATION

### Team Members

| Name | Role | Responsibilities | Email | GitHub |
|------|------|-----------------|-------|--------|
| [Member 1 Name] | Team Lead / Full Stack Developer | Backend API, ML Model Integration | member1@example.com | [@username1](https://github.com/username1) |
| [Member 2 Name] | Frontend Developer | React Components, UI/UX | member2@example.com | [@username2](https://github.com/username2) |
| [Member 3 Name] | ML Engineer | Model Training, Data Processing | member3@example.com | [@username3](https://github.com/username3) |
| [Member 4 Name] | Database Administrator | Schema Design, Optimization | member4@example.com | [@username4](https://github.com/username4) |

*Note: Update the table above with actual team member information*

### Contribution Summary
- **[Member 1]**: Backend development, API design, database integration
- **[Member 2]**: Frontend UI, React components, responsive design
- **[Member 3]**: ML model development, training, evaluation
- **[Member 4]**: Database design, query optimization, testing

---

## 📁 FILE STRUCTURE & NAMING CONVENTIONS

```
smart-agriculture-system/
├── README.md                          # Project overview & setup guide
├── PROJECT_INFO.md                    # This file (submission requirements)
├── LICENSE                            # MIT License
├── .gitignore                         # Git ignore rules
│
├── backend/                           # Backend application
│   ├── app.py                        # Main Flask application
│   ├── config.py                     # Configuration settings
│   ├── auth_db.py                    # Authentication & database logic
│   ├── db.py                         # Database utilities
│   ├── requirements.txt              # Python dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Backend-specific ignores
│   ├── routes/                       # API route handlers
│   │   ├── auth.py                   # Authentication routes
│   │   └── predictions.py            # Prediction routes
│   └── models/                       # ML models
│       └── yield_model.pkl           # Trained yield prediction model
│
└── frontend/                          # Frontend application
    ├── index.html                    # HTML entry point
    ├── package.json                  # npm dependencies
    ├── vite.config.js                # Vite configuration
    ├── .env.example                  # Frontend environment template
    ├── .gitignore                    # Frontend-specific ignores
    └── src/                          # Source code
        ├── main.jsx                  # Application entry
        ├── App.jsx                   # Main App component
        ├── index.css                 # Global styles
        ├── components/               # Reusable components
        │   ├── Navbar.jsx
        │   ├── InputForm.jsx
        │   └── MapComponent.jsx
        ├── pages/                    # Page components
        │   ├── Home.jsx
        │   ├── Predict.jsx
        │   ├── Profile.jsx
        │   ├── CropHealth.jsx
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── contexts/                 # React contexts
        │   └── AuthContext.jsx
        └── utils/                    # Utility functions
            └── api.js
```

---

## 🔗 SUBMISSION LINKS

### GitHub Repository
**Repository URL**: `https://github.com/[YOUR_USERNAME]/smart-agriculture-system`  
*Status*: ✅ Public / 🔒 Private  
*Last Updated*: [DATE]

### Google Drive
**Drive Folder URL**: `https://drive.google.com/drive/folders/[YOUR_FOLDER_ID]`  
*Access*: Anyone with the link can view  
*Contents*: Complete source code, documentation, presentation

### Live Demo (Optional)
**Demo URL**: `[YOUR_DEPLOYMENT_URL if deployed]`  
**Video Demo**: `[LINK_TO_VIDEO_DEMO if available]`

---

## 📖 SETUP & INSTALLATION

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MySQL Server (v8.0 or higher)
- Git

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/smart-agriculture-system.git
   cd smart-agriculture-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   
   # Configure .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Run backend
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Configure .env
   cp .env.example .env
   
   # Run frontend
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🧪 TESTING

### Unit Tests
- Backend: `pytest` (to be implemented)
- Frontend: `Vitest` (to be implemented)

### Test Coverage
- [Add coverage percentage once implemented]

### Manual Testing Checklist
- ✅ User registration and login
- ✅ Crop yield prediction with valid inputs
- ✅ Field area calculation on map
- ✅ Prediction history display
- ✅ Profile page functionality
- ✅ Responsive design on mobile/tablet/desktop

---

## 📊 PROJECT METRICS

### Development Timeline
- **Planning**: [START_DATE] - [END_DATE]
- **Development**: [START_DATE] - [END_DATE]
- **Testing**: [START_DATE] - [END_DATE]
- **Deployment**: [START_DATE] - [END_DATE]

### Code Statistics
- **Total Lines of Code**: ~[XXXX] lines
- **Frontend**: ~[XXXX] lines (JavaScript/JSX)
- **Backend**: ~[XXXX] lines (Python)
- **Configuration**: ~[XXX] lines

### Features Implemented
- ✅ Multi-user authentication
- ✅ Crop yield prediction
- ✅ Interactive field mapping
- ✅ Prediction history tracking
- ✅ User profile dashboard
- ✅ Responsive UI design
- ⏳ Crop health analysis (in progress/completed)
- ⏳ Weather API integration (in progress/completed)

---

## 📝 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 CONTACT & SUPPORT

### Project Maintainers
- **Primary Contact**: [Name] - [Email]
- **Project Repository**: [GitHub URL]
- **Issue Tracker**: [GitHub Issues URL]

### Documentation
- **README**: [Link to README.md]
- **API Documentation**: [Link if available]
- **User Guide**: [Link if available]

---

## ✅ SUBMISSION CHECKLIST

- [ ] README.md file created and complete
- [ ] PROJECT_INFO.md file created with all required sections
- [ ] All team member information filled in
- [ ] GitHub repository created and made public/accessible
- [ ] Complete source code pushed to GitHub
- [ ] .gitignore files properly configured
- [ ] Sensitive data (passwords, API keys) removed
- [ ] Google Drive folder created with proper permissions
- [ ] All files uploaded to Google Drive
- [ ] Links verified as accessible
- [ ] Code properly commented and documented
- [ ] File naming conventions followed
- [ ] All dependencies listed in requirements.txt/package.json

---

**Submission Date**: [DATE]  
**Academic Year**: [YEAR]  
**Course**: [COURSE_NAME]  
**Instructor**: [INSTRUCTOR_NAME]

---

*This document was generated for academic project submission purposes.*
