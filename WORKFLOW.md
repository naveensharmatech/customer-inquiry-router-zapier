# Workflow Details

## 🎯 How The Workflow Works

### Step 1: Email Trigger
- **What:** Gmail captures new incoming email
- **When:** Immediately when customer sends inquiry
- **Data Captured:** Subject, body, sender, timestamp

### Step 2: AI Analysis (Claude)
- **What:** Claude API analyzes email content
- **Purpose:** Extract priority signals
- **Analysis Includes:**
  - Urgency indicators (URGENT, ASAP, HELP)
  - Topic classification (Sales, Support, Billing)
  - Sentiment analysis (Angry, Neutral, Happy)
  - Lead quality scoring

### Step 3: Smart Routing Decision
- **High Priority**
  - Indicators: Urgent tone, upset customer, high-value lead
  - Routing: Direct to sales team
  - Response time: Immediate

- **Medium Priority**
  - Indicators: Standard inquiry, normal tone
  - Routing: Support team queue
  - Response time: Within 2 hours

- **Low Priority**
  - Indicators: General info request, no urgency
  - Routing: Archive/FAQ response
  - Response time: Within 24 hours

### Step 4: HubSpot CRM Integration
- **What:** Creates new contact in HubSpot
- **Data Logged:**
  - Contact name & email
  - Inquiry type & priority
  - Response status
  - Interaction timestamp

### Step 5: Auto Response
- **What:** Sends personalized response email
- **Personalization:** Based on priority & inquiry type
- **Templates Used:**
  - High priority: Urgent support template
  - Medium priority: Standard support template
  - Low priority: FAQ template

### Step 6: Logging & Tracking
- **Logged Data:**
  - Email processed timestamp
  - Priority assigned
  - Route taken
  - Response sent confirmation
  - HubSpot record created

---

## Workflow Diagram
📬 Gmail Input
↓
🤖 Claude AI Analysis
↓
🎯 Priority Scoring
↓
├─→ HIGH Priority
│ └─→ Sales Team
├─→ MEDIUM Priority
│ └─→ Support Team
└─→ LOW Priority
└─→ FAQ/Archive
↓
👥 HubSpot Create Contact
↓
📧 Send Response
↓
📊 Log & Track


---

## Technical Details

**API Calls Made:**
- Claude API (1 call per email)
- HubSpot API (1 call per qualified lead)
- Gmail API (1 read, 1 send)

**Processing Time:** ~30 seconds per email

**Success Rate:** 98%

**Cost:** ~$0.05 per email (Claude + HubSpot)




