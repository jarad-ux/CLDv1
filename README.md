# HVAC Rebate Navigator

A Next.js 14 application for calculating federal HEAR/HOMES rebates and state energy incentives for HVAC upgrades.

## Overview

This application helps homeowners and contractors estimate rebates available for energy-efficient home improvements including:

- Heat pump HVAC systems
- Heat pump water heaters
- Electrical panel upgrades
- Electrical wiring upgrades

The calculator determines eligibility based on:
- Geographic location (state + ZIP code)
- Household income relative to Area Median Income (AMI)
- Household size
- Selected upgrade projects

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL via Prisma ORM
- **Validation**: Zod
- **State Management**: Zustand (for client-side state)

## Project Structure

```
/src
  /app
    layout.tsx              # Root layout
    page.tsx                # Homepage
    globals.css             # Global styles
    /api
      /calculate
        route.ts            # POST endpoint for rebate calculation
      /lead
        route.ts            # POST endpoint for lead capture
    /rebates
      page.tsx              # National calculator page
      /[stateCode]
        page.tsx            # State-specific calculator page

  /components
    StateSelector.tsx       # State selection dropdown
    IncomeForm.tsx          # Income/household input form
    UpgradeSelector.tsx     # Upgrade checkboxes with cost inputs
    ResultsPanel.tsx        # Results display
    CalculatorSteps.tsx     # Main calculator orchestration
    /ui                     # Reusable UI primitives
      Button.tsx
      Input.tsx
      Label.tsx
      Select.tsx
      Card.tsx
      Checkbox.tsx

  /lib
    calculator.ts           # Main calculation engine
    states.ts               # State metadata helpers
    ami.ts                  # ZIP → County → AMI lookup
    federal.ts              # Federal HEAR/HOMES constants
    validation.ts           # Zod schemas
    prisma.ts               # Prisma client singleton
    ai.ts                   # MCP hook placeholders
    /engine
      federalRules.ts       # Base federal rebate rules
      stateOverrides.ts     # State-specific rule overrides
      mergeRules.ts         # Rule merging logic

  /data
    states.json             # State metadata (status, program info)
    ami.json                # AMI by county and household size
    zip-to-county.json      # ZIP → county mapping

  /utils
    format.ts               # Formatting helpers
    logger.ts               # Logging utility

/prisma
  schema.prisma             # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hvac"
NEXT_PUBLIC_SITE_NAME="HVAC Rebate Navigator"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

3. **Initialize database**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Key Features

### Calculator Engine

The rebate calculator (`/lib/calculator.ts`) implements:

1. **AMI Lookup**: Converts ZIP → County → AMI for income eligibility
2. **Income Categorization**:
   - Low (≤80% AMI): 100% HEAR coverage
   - Moderate (81-150% AMI): 50% HEAR coverage
   - Over Limit (>150% AMI): No HEAR, but may qualify for tax credits
3. **Federal Rules**: Base HEAR caps and coverage percentages
4. **State Overrides**: State-specific enhanced caps or additional rebates
5. **Tax Credit Calculation**: Federal 25C tax credit estimation

### API Endpoints

#### POST `/api/calculate`

Calculate rebates for given inputs.

**Request Body:**
```json
{
  "stateCode": "md",
  "zip": "21201",
  "income": 82000,
  "householdSize": 3,
  "upgrades": {
    "heatPump": true,
    "waterHeater": true,
    "panel": false,
    "wiring": false
  },
  "estimatedCosts": {
    "heatPump": 12000,
    "waterHeater": 3500
  }
}
```

**Response:**
```json
{
  "incomeCategory": "moderate",
  "ami": 87400,
  "county": "Baltimore City",
  "lineItems": [...],
  "totalRebate": 7875,
  "federalTaxCredit": 3200,
  "notes": [...]
}
```

#### POST `/api/lead`

Capture lead information.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "4105551234",
  "consent": true,
  "stateCode": "md",
  "upgrades": {...},
  "result": {...}
}
```

### MCP & Automation Hooks

All AI and automation integration points live in `/src/lib/ai.ts`. **The app works immediately without any MCP server configured** — each function includes intelligent template-based fallback logic. When you're ready to wire in real AI or automation, the MCP integration points are clearly marked with TODO comments and example code.

#### 1. `enrichWithGuidance(result: CalculatorResult): Promise<EnrichedCalculatorResult>`

**Current Behavior (Template-based):**
- Generates personalized homeowner guidance based on income category (low/moderate/over-limit)
- Creates contractor notes about licensing, ENERGY STAR requirements, documentation
- Provides actionable next steps (gather docs, find contractors, apply for rebates)
- All logic is deterministic and works offline

**Returns:**
```typescript
{
  ...result,
  advice: {
    homeownerSummary: string,      // Plain-language explanation
    contractorNotes: string[],     // Project requirements
    nextSteps: string[]            // Actionable items
  }
}
```

**MCP Integration (Future):**
Replace the `generateTemplateGuidance()` call with:
```typescript
const mcpResponse = await mcpClient.callTool('generate_rebate_guidance', {
  result,
  context: { county: result.county, selectedUpgrades: result.lineItems.map(i => i.name) }
})
```

Expected MCP tool schema documented in ai.ts comments.

---

#### 2. `sendLeadToPipelines(lead): Promise<{ ok: boolean, errors?: string[] }>`

**Current Behavior (Logging only):**
- Logs structured lead data (contact info, property details, rebate estimate, consent)
- Returns `{ ok: true }` immediately
- Safe for production (no external calls)

**MCP Integration (Future):**
Fan out to 4 automation systems in parallel:
1. **Twilio** - Queue outbound call task
2. **Retell AI** - Start voice agent workflow
3. **CRM** - Upsert lead record (Salesforce/HubSpot/etc.)
4. **Email** - Send confirmation with next steps

Complete example code with error handling is in the ai.ts function comments.

**Required Environment Variables (when MCP is wired):**
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `RETELL_API_KEY`, `RETELL_WORKSPACE_ID`
- `CRM_API_KEY`, `CRM_TYPE`

---

#### 3. `generateStateContent(stateCode): Promise<StateContent>`

**Current Behavior (Template-based):**
- Reads state metadata from `/data/states.json`
- Generates hero title/subtitle based on program status
- Creates 4-5 relevant FAQs per state
- Returns rich content for state landing pages

**Returns:**
```typescript
{
  heroTitle: string,
  heroSubtitle: string,
  description: string,
  faq: Array<{ question: string, answer: string }>,
  additionalNotes: string[]
}
```

**MCP Integration (Future):**
```typescript
const mcpResponse = await mcpClient.callTool('generate_state_content', {
  stateCode,
  metadata: stateMetadata,
  context: { programStatus, hasStateProgram, existingNotes }
})
```

This would enable AI-generated, SEO-optimized content that adapts to program changes.

---

**How to Wire MCP:**

1. Configure your MCP server with the required tools (schemas in ai.ts comments)
2. Replace the template function calls with `mcpClient.callTool()` calls
3. Add environment variables to `.env.local`
4. Test each hook independently before deploying

The app will continue working during the migration since template logic remains as fallback.

## Data Files

### `/src/data/states.json`

State metadata with program status and notes:

```json
{
  "md": {
    "name": "Maryland",
    "status": "active",
    "hasHearProgram": true,
    "programName": "Maryland HEAR Rebates",
    "notes": ["Requires income documentation", "..."]
  }
}
```

### `/src/data/ami.json`

AMI data by county and household size:

```json
[
  {
    "state": "MD",
    "county": "Baltimore City",
    "householdSize": 3,
    "ami": 87400
  }
]
```

### `/src/data/zip-to-county.json`

ZIP code to county mapping:

```json
{
  "21201": {
    "state": "MD",
    "county": "Baltimore City"
  }
}
```

## Testing Locally

### Test the Calculator

1. Navigate to `http://localhost:3000/rebates`
2. Select a state (e.g., Maryland)
3. Enter:
   - ZIP: 21201
   - Income: 70000
   - Household Size: 3
4. Check upgrades (Heat Pump, Water Heater)
5. Click "Calculate My Rebates"

Expected result:
- Income category: Low (≤80% AMI)
- HEAR rebates: ~$9,750 (100% coverage up to caps)
- Tax credit: ~$3,200

### Test State-Specific Pages

Visit `http://localhost:3000/rebates/md` for Maryland-specific page.

## Deployment

### Vercel (Recommended)

1. **Import GitHub repository** in Vercel
2. **Framework preset**: Next.js (auto-detected)
3. **Environment variables**:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
4. **Deploy**

### Other Platforms

Compatible with any platform supporting Next.js 14:
- Railway
- Render
- AWS Amplify
- DigitalOcean App Platform

## Extending the Calculator

### Adding New States

1. Add state entry to `/src/data/states.json`
2. Add ZIP codes to `/src/data/zip-to-county.json`
3. Add AMI data to `/src/data/ami.json`
4. (Optional) Add state overrides in `/src/lib/engine/stateOverrides.ts`

### Adding State-Specific Rules

Edit `/src/lib/engine/stateOverrides.ts`:

```typescript
export const stateOverrides = {
  ca: {
    hearCaps: {
      heatPump: 10000, // Enhanced CA cap
      // ... other overrides
    },
    stateSpecificRebates: [
      {
        id: 'ca-bonus',
        name: 'California TECH Bonus',
        amount: 1000,
      }
    ]
  }
}
```

## Future Enhancements

- [ ] Wire MCP hooks to Claude AI
- [ ] Add HOMES program calculation (whole-home energy modeling)
- [ ] Integrate real-time utility rebate APIs
- [ ] Add contractor matching/referral system
- [ ] Implement lead nurture workflows
- [ ] Add multilingual support

## License

Proprietary - Internal Use Only

## Support

For issues or questions, contact the development team.
