# GeeksforGeeks SRMIST Chapter - User Guide

> **Audience:** Club Admins & Team Leads  
> **Last Updated:** December 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [The Admin Dashboard](#the-admin-dashboard)
   - [My Profile Tab](#my-profile-tab)
   - [Event Management Tab](#event-management-tab)
   - [Recruitment Portal Tab](#recruitment-portal-tab)
3. [Public Features](#public-features)
   - [Team "Time Machine"](#team-time-machine)
   - [Events Page](#events-page)

---

## Getting Started

### How to Log In via Magic Link

The admin portal uses a **passwordless authentication** system for enhanced security. Here's how to access it:

1. **Navigate to the Login Page**  
   Go to `yoursite.com/login` or click the "Admin Login" link on the homepage.

2. **Enter Your Authorized Email**  
   Type your official email address (must be pre-authorized by the Chair/Vice-Chair).

3. **Click "Send Code"**  
   A 6-digit One-Time Password (OTP) will be sent to your email via Resend.

4. **Check Your Inbox**  
   Look for an email from the GFG SRMIST system. The code typically arrives within seconds.

5. **Enter the OTP**  
   Type the 6-digit code in the verification field and click "Verify & Login".

6. **Access Granted**  
   You'll be redirected to the Admin Dashboard automatically.

> **⚠️ Important:** Only emails in the authorized allowlist can receive OTPs. If you're a new lead, contact the Chair to add your email.

---

## The Admin Dashboard

Once logged in, you'll see the main dashboard at `/admin` with your email displayed and quick-access cards.

### My Profile Tab

> **Who can use this:** All authenticated Team Leads

This section allows you to update your public profile that appears on the Team page.

#### What You Can Edit:
- **Bio:** A short description about yourself
- **Social Links:** LinkedIn, GitHub, Instagram, and Email

#### How to Update Your Profile:

1. Navigate to your profile section (accessed via the API endpoint)
2. Modify your **Bio** text
3. Update your **Social Links** (full URLs for LinkedIn, GitHub, Instagram)
4. Click **Save Changes**

> **🔒 Security Note:** The system validates that your login email matches your Contentful profile email. You can ONLY edit your own profile—not anyone else's.

---

### Event Management Tab

> **Who can use this:** All authenticated admins

Access this section by clicking the **"Events"** card on the dashboard.

#### Viewing Events
- All events are displayed in a grid format
- Each card shows the event **Title**, **Date**, and **Venue**
- Click any event card to view/edit details

#### Creating a New Event

1. Click **"Create New Event"** (purple button, top right)
2. Fill in the required fields:
   - **Title** (required)
   - **Date** (required)
   - **Venue**
   - **Registration Link**
   - **Description**
3. Click **Submit**
4. The event is automatically published to Contentful

#### Managing Gallery Images

1. Open an existing event by clicking its card
2. **Upload Images:**
   - Drag and drop images into the upload zone, OR
   - Click to browse and select files
3. **Delete Images:**
   - Click on any gallery image to remove it from the event
   - The image is unlinked (not permanently deleted from Contentful assets)

#### Toggle Registration Status

Events can have registration enabled or disabled:
- Look for the **"Registration Open"** toggle on the event detail page
- Toggle ON to enable registrations
- Toggle OFF to close registrations

---

### Recruitment Portal Tab

> **Who can use this:** All authenticated admins

Access via the **"Recruitment"** card on the dashboard.

#### Recruitment Status Toggle

At the top of the Recruitment Portal, you'll find the master **"Recruitment Open"** switch:

- **Toggle ON:** The public recruitment form at `/pages/recruitment` becomes accessible
- **Toggle OFF:** The recruitment form is hidden from the public site

> **Note:** This setting is stored in Contentful's `globalSettings` and affects the entire site.

#### Viewing Applications

All submitted applications are displayed in a table format with:
- Applicant Name
- College Email
- Personal Email
- Phone Number
- Registration Number
- Year & Section
- Branch
- Team Preference
- Technical/Design Skills
- Description
- Submission Date

#### Filtering by Date

1. Use the **Start Date** picker to set the beginning of your date range
2. Use the **End Date** picker to set the end of your range
3. Click **Apply Filter** to view submissions within that period

#### Export to CSV

1. Apply any date filters if needed
2. Click the **"Export to CSV"** button
3. A `.csv` file will download containing all visible application data
4. Open in Excel, Google Sheets, or any spreadsheet application

---

## Public Features

These features are available to all visitors on the public-facing website.

### Team "Time Machine"

The Team page (`/pages/team`) features a unique **Year Toggle** system that acts as a "Time Machine" for viewing past and current team members.

#### How It Works:

1. **Year Selector:** Located at the top of the Team page
   - Toggle buttons for: **2025**, **2024**, **2023** (and future years as added)
   
2. **Click a Year:** The page dynamically loads team members from that year

3. **What's Displayed:**
   - **Leadership Section:** Chair, Vice-Chair, President roles (larger cards)
   - **Core Team:** All team leads with profile photos and social links
   - **Core Members Accordion:** Expandable sections showing general members per team

4. **Interactive Cards:**
   - Hover over member cards for a tilt effect
   - Click social icons to visit LinkedIn, GitHub, Instagram, or send an email
   - For 2025 members, click the card to view their detailed profile page

> **💡 Tip:** This feature is perfect for alumni to find their batch or for new members to explore the club's history.

---

### Events Page

The Events page (`/pages/events`) automatically organizes all club events into three categories.

#### The 3 Tabs:

| Tab | Description | Auto-Sort Logic |
|-----|-------------|-----------------|
| **Upcoming** | Events scheduled for the future | `eventDate > today` |
| **Current** | Events happening today | `eventDate === today` |
| **Completed** | Past events | `eventDate < today` |

#### How Auto-Sorting Works:

- Events are fetched from Contentful with the `date` field
- The system uses **Moment.js** to compare each event's date with the current date
- Events are automatically categorized—no manual sorting required!

#### Event Cards Display:

Each event card shows:
- Event title and description
- Date and venue
- Gallery images (if available)
- Registration link (if registration is open)

#### Navigation:

1. Click any tab to switch between Upcoming, Current, and Completed
2. The active tab is highlighted in green
3. If no events exist in a category, a friendly "No events found" message appears

---

## Need Help?

If you encounter any issues:

1. **Login Problems:** Contact the Chair to verify your email is in the allowlist
2. **Profile Updates Not Saving:** Ensure your login email matches your Contentful profile email exactly
3. **Technical Issues:** Reach out to the Technical Lead or check the `API_REFERENCE.md` documentation

---

*Document maintained by the GFG SRMIST Technical Team*
