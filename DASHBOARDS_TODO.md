# Hospital ERP - Dashboard Implementation Guide

## 🎯 Overview

This document outlines the complete dashboard implementation for all user roles in the Hospital ERP system. Each dashboard should fetch real data from the backend API and display role-specific information.

## ✅ Completed

### Services Created
- ✅ `staffService.ts` - Staff management
- ✅ `patientService.ts` - Patient management
- ✅ `appointmentService.ts` - Appointment management
- ✅ `wardService.ts` - Ward and bed management
- ✅ `drugService.ts` - Pharmacy inventory
- ✅ `dashboardService.ts` - Dashboard statistics

### Main Dashboard
- ✅ Updated with real data fetching
- ✅ Auto-redirects to role-specific dashboards
- ✅ Fetches patients, appointments, stats from backend
- ✅ Loading states and error handling

## 📋 Dashboards To Implement

### 1. Super Admin Dashboard (`/dashboard/admin`)

**Purpose:** Comprehensive overview of entire hospital operations

**Key Features:**
- 📊 Hospital-wide statistics
  - Total patients, staff, doctors, nurses
  - Revenue metrics
  - Bed occupancy rates
  - Department-wise breakdown

- 👥 Staff Management Overview
  - Active staff count by role
  - Staff on leave
  - New hires this month
  - Performance metrics

- 📈 Real-time Activity Feed
  - Recent admissions
  - Ongoing surgeries
  - Critical alerts
  - System notifications

- 💰 Financial Summary
  - Today's revenue
  - Pending payments
  - Insurance claims
  - Monthly trends

- 🏥 Department Status
  - Each department's activity
  - Resource utilization
  - Staff allocation

**API Endpoints Needed:**
```typescript
GET /dashboard/admin/stats
GET /dashboard/admin/activity-feed
GET /dashboard/admin/financial-summary
GET /staff/count-by-role
GET /departments/summary
```

**Implementation:**
```typescript
// frontend/src/app/dashboard/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dashboardService from '@/services/dashboardService';
import staffService from '@/services/staffService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // Fetch all admin-specific data
    const adminStats = await dashboardService.getAdminStats();
    const staffStats = await staffService.getStaffStats();
    // ... more fetching
  };

  return (
    <div>
      {/* Hospital Overview Stats */}
      {/* Staff Management */}
      {/* Activity Feed */}
      {/* Financial Summary */}
      {/* Department Status */}
    </div>
  );
}
```

---

### 2. Doctor Dashboard (`/dashboard/doctor`)

**Purpose:** Doctor's daily workflow and patient management

**Key Features:**
- 📅 **Today's Schedule**
  - Upcoming appointments
  - Patient queue
  - Time remaining per appointment

- 👥 **My Patients**
  - Currently admitted patients
  - Patients under care
  - Follow-up required

- 📝 **Quick Actions**
  - Write prescription
  - Request lab test
  - Order imaging
  - Update patient notes

- 📊 **My Statistics**
  - Patients seen today
  - Total consultations this month
  - Average consultation time
  - Patient satisfaction rating

- 🔔 **Alerts & Notifications**
  - Lab results ready
  - Critical patient updates
  - Appointment reminders

**API Endpoints:**
```typescript
GET /dashboard/doctor/today-schedule
GET /dashboard/doctor/my-patients
GET /dashboard/doctor/stats
GET /appointments?doctorId={id}&date={today}
GET /patients/under-care/{doctorId}
```

**Sample UI:**
```
┌────────────────────────────────────────────┐
│ Good Morning, Dr. Sarah Johnson            │
│ 📅 12 appointments today | 🩺 3 in queue   │
└────────────────────────────────────────────┘

┌─────────────┬──────────────┬─────────────┐
│ Next: 10:00 │ Consultations│ Patients    │
│ John Smith  │ 45 (month)   │ Under Care  │
│ Check-up    │              │ 12 active   │
└─────────────┴──────────────┴─────────────┘
```

---

### 3. Nurse Dashboard (`/dashboard/nurse`)

**Purpose:** Patient care management and ward duties

**Key Features:**
- 🛏️ **My Ward**
  - Assigned ward/beds
  - Patient list
  - Bed occupancy

- 📋 **Patient Care Tasks**
  - Vitals to be recorded
  - Medications due
  - Scheduled procedures
  - Patient assessments

- 🩺 **Vital Signs Tracking**
  - Quick vital entry
  - Abnormal readings alerts
  - Trending charts

- 📝 **Shift Handover**
  - Previous shift notes
  - Current shift tasks
  - Handover checklist

- 🚨 **Alerts**
  - Critical vitals
  - Call bell notifications
  - Doctor orders

**API Endpoints:**
```typescript
GET /dashboard/nurse/my-ward
GET /dashboard/nurse/tasks
GET /wards/{id}/patients
GET /vitals/pending
POST /vitals/record
```

---

### 4. Pharmacist Dashboard (`/dashboard/pharmacist`)

**Purpose:** Prescription management and inventory control

**Key Features:**
- 💊 **Pending Prescriptions**
  - New prescriptions to fill
  - Refill requests
  - Priority queue

- 📦 **Inventory Status**
  - Low stock alerts
  - Expiring drugs (30 days)
  - Out of stock items
  - Reorder suggestions

- 📊 **Today's Activity**
  - Prescriptions filled
  - Revenue generated
  - Popular medications

- 🔍 **Drug Information**
  - Quick drug lookup
  - Interaction checker
  - Substitute suggestions

**API Endpoints:**
```typescript
GET /dashboard/pharmacist/pending-prescriptions
GET /pharmacy/drugs/low-stock
GET /pharmacy/drugs/expiring
GET /dashboard/pharmacist/stats
POST /prescriptions/{id}/dispense
```

---

### 5. Lab Technician Dashboard (`/dashboard/lab`)

**Purpose:** Lab test management and results entry

**Key Features:**
- 🧪 **Test Queue**
  - Pending tests
  - In-progress tests
  - Priority (STAT, Urgent, Routine)

- 📊 **Sample Management**
  - Samples collected
  - Samples received
  - Pending collection

- ✅ **Results Entry**
  - Enter test results
  - Quality control checks
  - Awaiting verification

- 📈 **Lab Statistics**
  - Tests completed today
  - Average turnaround time
  - Pending results

**API Endpoints:**
```typescript
GET /dashboard/lab/pending-tests
GET /laboratory/tests?status=pending
GET /laboratory/samples
POST /laboratory/tests/{id}/results
GET /dashboard/lab/stats
```

---

### 6. Patient Portal (`/dashboard/patient`)

**Purpose:** Patient's personal health dashboard

**Key Features:**
- 👤 **My Health Summary**
  - Current medications
  - Chronic conditions
  - Allergies
  - Blood type

- 📅 **My Appointments**
  - Upcoming appointments
  - Past visits
  - Book new appointment

- 🧾 **Medical Records**
  - Lab results
  - Prescriptions
  - Imaging reports
  - Visit summaries

- 💳 **Billing**
  - Outstanding bills
  - Payment history
  - Insurance claims

- 📊 **Health Metrics**
  - Vital signs trends
  - Medication adherence
  - Visit frequency

**API Endpoints:**
```typescript
GET /dashboard/patient/{id}/summary
GET /patients/{id}/appointments
GET /patients/{id}/medical-records
GET /patients/{id}/prescriptions
GET /patients/{id}/lab-results
GET /patients/{id}/billing
```

---

### 7. Radiologist Dashboard (`/dashboard/radiology`)

**Purpose:** Imaging requests and report management

**Key Features:**
- 🖼️ **Imaging Queue**
  - Pending scans
  - Priority requests
  - Modality-wise breakdown

- 📝 **Report Writing**
  - Pending reports
  - Draft reports
  - Quick templates

- 📊 **Statistics**
  - Scans performed today
  - Reports generated
  - Average report time

**API Endpoints:**
```typescript
GET /dashboard/radiology/pending-scans
GET /radiology/imaging-requests
POST /radiology/reports
```

---

### 8. Receptionist Dashboard (`/dashboard`)

**Purpose:** Front desk operations

**Key Features:**
- 📝 **Patient Registration**
  - Quick registration
  - Search patients
  - Update details

- 📅 **Appointment Management**
  - Schedule appointments
  - Check-in patients
  - Manage queue

- 💳 **Billing Support**
  - Generate invoices
  - Collect payments
  - Insurance verification

**Current Implementation:**
✅ Already implemented as main dashboard

---

## 🛠️ Implementation Steps

### For Each Dashboard:

1. **Create Page Component**
   ```bash
   touch frontend/src/app/dashboard/{role}/page.tsx
   ```

2. **Implement Data Fetching**
   ```typescript
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
     try {
       const data = await dashboardService.get{Role}Stats();
       setData(data);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   };
   ```

3. **Add Loading State**
   ```typescript
   if (loading) {
     return <div className="spinner"></div>;
   }
   ```

4. **Display Data**
   - Stats cards
   - Tables/lists
   - Charts (optional)
   - Action buttons

5. **Error Handling**
   ```typescript
   if (error) {
     return <div>Error loading data</div>;
   }
   ```

---

## 📡 Backend API Requirements

### For Each Dashboard, Create:

1. **Controller** (`backend/src/controllers/{module}/dashboardController.js`)
   ```javascript
   exports.getAdminStats = async (req, res) => {
     // Fetch and calculate stats
     res.json({ success: true, data: stats });
   };
   ```

2. **Route** (`backend/src/routes/{module}/dashboardRoutes.js`)
   ```javascript
   router.get('/admin/stats', protect, restrictTo('Admin'), getAdminStats);
   ```

3. **Add to Main Routes** (`backend/src/routes/index.js`)
   ```javascript
   router.use('/dashboard', dashboardRoutes);
   ```

---

## 🎨 UI Components Needed

### Reusable Components:

1. **StatCard** - Display statistics
2. **DataTable** - List data with sorting/filtering
3. **Chart** - Visual data representation
4. **ActionButton** - Quick actions
5. **AlertBadge** - Status indicators
6. **LoadingSpinner** - Loading states
7. **EmptyState** - No data state

---

## 🚀 Priority Order

1. ⭐ **Super Admin Dashboard** - Most comprehensive
2. ⭐ **Doctor Dashboard** - Core functionality
3. ⭐ **Nurse Dashboard** - Patient care
4. ⭐ **Patient Portal** - Patient engagement
5. **Pharmacist Dashboard**
6. **Lab Technician Dashboard**
7. **Radiologist Dashboard**

---

## ✅ Testing Checklist

For each dashboard:

- [ ] Loads without errors
- [ ] Displays real data from backend
- [ ] Shows loading state
- [ ] Handles errors gracefully
- [ ] Updates in real-time (if applicable)
- [ ] Responsive on mobile
- [ ] Role-based access control works
- [ ] Actions trigger correct API calls

---

## 📚 Resources

- **API Documentation:** `/API_DOCUMENTATION.md`
- **Service Files:** `/frontend/src/services/`
- **Existing Dashboard:** `/frontend/src/app/dashboard/page.tsx`
- **Auth Context:** `/frontend/src/contexts/AuthContext.tsx`

---

## 🎯 Next Steps

1. Create backend dashboard routes and controllers
2. Implement Super Admin dashboard (highest priority)
3. Implement Doctor dashboard
4. Implement Nurse dashboard
5. Add charts and visualizations
6. Implement real-time updates with Socket.io
7. Add export/print functionality
8. Create mobile-responsive views

---

**Last Updated:** 2024-11-05
**Status:** In Progress
**Completion:** 20% (Services + Main Dashboard)
