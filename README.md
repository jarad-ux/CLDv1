# HEIP Assessment Mobile App

A comprehensive mobile application for conducting Georgia Power HEIP (Home Energy Improvement Program) compliant home energy assessments. Built with React Native, TypeScript, and Firebase.

## 🎯 Overview

This mobile app enables energy advisors to conduct complete HEIP-compliant home energy assessments in the field, including:

- Step-by-step assessment workflow following HEIP requirements
- Mandatory photo documentation (HVAC, water heater, insulation, etc.)
- Digital signature capture (customer and advisor)
- Automatic 90+ minute duration tracking
- Offline capability with cloud sync
- PDF report generation matching exact HEIP compliance template
- Rebate calculation for HEIP, HEAR, HER, and Federal tax credits

## ✨ Key Features

### HEIP Compliance
- ✅ Enforces 90+ minute assessment duration requirement
- ✅ Mandatory photo checklist (7 categories, minimum photos per category)
- ✅ Room-by-room evaluation (minimum 3 rooms)
- ✅ Digital signatures for customer and energy advisor
- ✅ Complete customer acknowledgment workflow
- ✅ PDF report generation matching Georgia Power format

### Assessment Workflow (15 Steps)
1. **Customer Info** - Name, account number, property details
2. **Property Details** - Property type, status, location
3. **Energy Bills** - Current bills, trends, usage patterns
4. **Comfort Concerns** - Hot/cold areas, drafts, comfort issues
5. **HVAC System** - Type, age, SEER rating, condition
6. **Water Heater** - Type, age, UEF, capacity
7. **Insulation & Envelope** - Attic, walls, foundation
8. **Windows & Doors** - Count, type, condition
9. **Duct System** - Condition, testing, leakage
10. **Room-by-Room** - Minimum 3 rooms evaluated
11. **Photos** - Required photos for all categories
12. **Recommendations** - Energy efficiency improvements
13. **Rebates** - HEIP, HEAR, HER, Federal calculations
14. **Signatures** - Customer and advisor digital signatures
15. **Review & Submit** - Validation, PDF generation, sync

### Rebate Programs Supported
- **Georgia Power HEIP** - Up to $1,250 (whole house) or $750 (individual measures)
- **Georgia HEAR** - Up to $14,000 (income-based electrification rebates)
- **Georgia HER** - Up to $8,000 (whole-home efficiency rebates)
- **Federal IRS 25C** - Up to $7,050+ (equipment + envelope tax credits)

### Technical Features
- 📱 **Cross-platform** - Single codebase for iOS and Android
- 🔄 **Offline-first** - Complete assessments without internet, sync later
- ☁️ **Cloud sync** - Firebase Firestore and Storage integration
- 📸 **Camera integration** - Native camera for required photos
- ✍️ **Digital signatures** - Canvas-based signature capture
- 📄 **PDF generation** - HEIP-compliant report generation
- 📊 **State management** - Zustand for global state
- 🔍 **Search & filter** - Assessment history with search
- ✅ **Validation** - Real-time validation for HEIP compliance

## 🏗️ Architecture

```
CLDv1/
├── src/
│   ├── config/              # Firebase configuration
│   ├── models/              # TypeScript data models
│   │   └── Assessment.ts    # Complete assessment data model
│   ├── navigation/          # React Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── AssessmentFlowNavigator.tsx
│   ├── screens/             # UI screens
│   │   ├── HomeScreen.tsx
│   │   ├── AssessmentListScreen.tsx
│   │   └── assessment/      # 15-step assessment workflow
│   │       ├── CustomerInfoScreen.tsx
│   │       ├── PhotosScreen.tsx
│   │       ├── SignaturesScreen.tsx
│   │       ├── ReviewScreen.tsx
│   │       └── ...
│   ├── services/            # Business logic
│   │   ├── AssessmentService.ts  # CRUD, validation, sync
│   │   └── PDFService.ts         # PDF report generation
│   ├── store/               # State management (Zustand)
│   │   └── assessmentStore.ts
│   └── utils/               # Helper functions
├── App.tsx                  # Root component
├── package.json
└── tsconfig.json
```

## 📦 Tech Stack

### Core
- **React Native** 0.73.2 - Cross-platform mobile framework
- **TypeScript** 5.3.3 - Type safety and better DX
- **React Navigation** 6.x - Navigation and routing

### Backend & Storage
- **Firebase** 19.x - Backend as a Service
  - Firestore - Database
  - Storage - Photo and PDF storage
  - Auth - Authentication (future)
- **AsyncStorage** - Local offline storage

### UI & Components
- **React Native Elements** - UI component library
- **React Native Vector Icons** - Icon set
- **React Native Paper** - Material Design components

### Features
- **React Native Camera** - Photo capture
- **React Native Signature Canvas** - Digital signatures
- **React Native PDF** - PDF generation
- **React Native Share** - Share PDFs
- **React Hook Form** - Form validation
- **Yup** - Schema validation
- **Zustand** - Lightweight state management
- **date-fns** - Date formatting and manipulation

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CLDv1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS pods** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Set up Firebase**

   a. Create a Firebase project at https://console.firebase.google.com

   b. Add iOS and Android apps to your Firebase project

   c. Download configuration files:
      - `google-services.json` → Place in `android/app/`
      - `GoogleService-Info.plist` → Place in `ios/`

   d. Update Firebase config in `src/config/firebase.ts`:
      ```typescript
      export const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID",
      };
      ```

   e. Enable Firestore Database and Firebase Storage in Firebase Console

   f. Set up Firestore Security Rules (see `firestore.rules` section below)

5. **Run the app**

   ```bash
   # iOS
   npm run ios
   # or
   npx react-native run-ios

   # Android
   npm run android
   # or
   npx react-native run-android
   ```

## 🔥 Firebase Setup

### Firestore Security Rules

Create the following security rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Assessments collection
    match /assessments/{assessmentId} {
      // For now, allow all authenticated users to read/write
      // TODO: Restrict based on contractor ID and user roles
      allow read, write: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /assessments/{assessmentId}/{allPaths=**} {
      // Allow authenticated users to upload photos and PDFs
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 App Usage

### Creating a New Assessment

1. Open the app and tap **"Start New Assessment"**
2. The app automatically starts the 90-minute timer
3. Follow the 15-step workflow to complete all required fields
4. Capture all required photos (minimum photos enforced per category)
5. Collect digital signatures from customer and advisor
6. Review assessment for validation errors
7. Generate PDF report
8. Sync to cloud when internet is available

### Assessment Status

- **Draft** - Assessment started but not completed
- **In Progress** - Assessment currently being worked on
- **Completed** - All required fields completed, ready for submission

### Offline Mode

- Assessments are saved locally using AsyncStorage
- Photos are stored locally
- When internet is available, use "Sync Now" to upload to Firebase
- Pending sync count is shown on the home screen

### Photo Requirements (HEIP Compliance)

1. **HVAC Nameplate** - 1 photo minimum
2. **Water Heater Nameplate** - 1 photo minimum
3. **Attic Insulation** - 3 photos minimum
4. **Foundation/Crawlspace** - 3 photos minimum
5. **Windows & Doors Exterior** - 1 photo minimum
6. **Room Interior** - 3 photos minimum (3 different rooms)
7. **Exterior Home** - 2 photos minimum (front and back)

## 📊 Data Model

The complete assessment data model is defined in `src/models/Assessment.ts`. Key interfaces:

- `Assessment` - Root assessment object
- `CustomerInfo` - Customer and property information
- `AssessmentMetadata` - Assessment ID, dates, duration, status
- `Photo` - Photo with category, URI, cloud sync status
- `Signature` - Digital signature with timestamp
- `RoomFinding` - Individual room evaluation
- `RecommendedMeasure` - Energy efficiency recommendations
- `RebateCalculation` - HEIP, HEAR, HER, Federal calculations

## 🔐 Security & Privacy

- All data is stored securely in Firebase with authentication
- Local data is stored in app-specific directories
- Photos are compressed before upload to reduce storage costs
- Signatures are stored as base64 encoded images
- Customer PII is protected according to HEIP requirements

## 🧪 Testing

```bash
# Run unit tests
npm test

# Type check
npm run tsc

# Lint code
npm run lint
```

## 📦 Building for Production

### iOS

```bash
# Build release version
cd ios
xcodebuild -workspace HEIPAssessment.xcworkspace \
  -scheme HEIPAssessment \
  -configuration Release \
  -archivePath build/HEIPAssessment.xcarchive \
  archive

# Upload to App Store Connect
xcodebuild -exportArchive \
  -archivePath build/HEIPAssessment.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

### Android

```bash
# Build release APK
cd android
./gradlew assembleRelease

# Build release AAB (for Google Play)
./gradlew bundleRelease
```

## 🎨 Customization

### Branding

Update the following files to customize branding:

- `src/assets/logo.png` - Company logo
- App colors in `src/styles/colors.ts`
- Contractor information in `AssessmentService.ts`

### Rebate Amounts

Update rebate amounts in `src/models/Assessment.ts`:

```typescript
export const MEASURE_REBATES = {
  HEIP: {
    HEAT_PUMP_HVAC: 1000,
    // ... update amounts as needed
  },
  // ...
};
```

## 📄 PDF Report

The generated PDF report matches the exact HEIP compliance document format including:

- All required sections (1-7)
- Customer and property information
- Photo documentation checklist
- Room-by-room findings
- Energy efficiency recommendations
- HEIP, HEAR, HER, and Federal tax credit calculations
- Customer acknowledgment
- Digital signatures

PDF generation is handled by `PDFService.ts` which converts the assessment data to HTML and then to PDF.

## 🤝 Contributing

This is a private project for Go Eco Energy Solutions. For internal development:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Commit with clear messages: `git commit -m "Add feature X"`
4. Push to branch: `git push origin feature/your-feature`
5. Create pull request for review

## 📝 License

Proprietary - © 2025 Go Eco Energy Solutions. All rights reserved.

## 🆘 Support

For technical support or questions:
- Email: support@ecoenergysolutions.org
- Phone: (555) 123-4567
- Hours: Monday-Friday, 9am-5pm EST

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Complete assessment workflow
- ✅ Photo capture and management
- ✅ Digital signatures
- ✅ PDF generation
- ✅ Offline sync

### v1.1 (Planned)
- [ ] Multi-user authentication
- [ ] Contractor management
- [ ] Web admin dashboard
- [ ] Direct Georgia Power API integration
- [ ] Advanced analytics and reporting
- [ ] CRM integration
- [ ] Financing portal integration

### v2.0 (Future)
- [ ] AI-powered recommendations
- [ ] Automated energy modeling
- [ ] Integration with utility billing data
- [ ] Customer mobile app (view reports)
- [ ] Scheduling and dispatch system
- [ ] Multi-language support

## 📚 Resources

- [Georgia Power HEIP Program](https://www.georgiapower.com/residential/save-money-and-energy/products-programs/home-energy-efficiency-programs.html)
- [Georgia HEAR/HER Programs](https://www.georgiaheip.com/)
- [Federal IRS Form 5695](https://www.irs.gov/forms-pubs/about-form-5695)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🙏 Acknowledgments

- Georgia Power for HEIP program guidelines
- State of Georgia for HEAR/HER program specifications
- React Native community for excellent tooling and libraries

---

**Version:** 1.0.0
**Last Updated:** December 2025
**Developed for:** Go Eco Energy Solutions
