# Calendly Integration Setup Guide

## Quick Setup

1. **Get your Calendly URL**

   - Go to your Calendly account
   - Find your scheduling link (e.g., `https://calendly.com/your-username/interview`)
   - Copy this URL

2. **Update the configuration in src/pages/Index.tsx**

   ```javascript
   // Replace this line:
   const calendlyUrl = "https://calendly.com/your-company/interview";

   // With your actual Calendly URL:
   const calendlyUrl = "https://calendly.com/your-username/your-event-type";
   ```

## Advanced Setup (Multiple Interview Types)

If you want different Calendly event types for different interview stages:

1. **Create multiple event types in Calendly:**

   - Initial Screening (30 min)
   - Technical Interview (60 min)
   - Cultural Fit Interview (45 min)
   - Final Interview (30 min)

2. **Update the calendlyUrls object:**
   ```javascript
   const calendlyUrls = {
     initial: "https://calendly.com/your-username/initial-screening",
     technical: "https://calendly.com/your-username/technical-interview",
     cultural: "https://calendly.com/your-username/cultural-fit",
     final: "https://calendly.com/your-username/final-interview",
   };
   ```

## Calendly Event Configuration

### Recommended Event Settings:

- **Duration**:
  - Initial: 30 minutes
  - Technical: 60 minutes
  - Cultural: 45 minutes
  - Final: 30 minutes

### Custom Questions to Add:

1. **Position Applied For** (prefilled via `prefill_custom_1`)
2. **Key Skills** (prefilled via `prefill_custom_2`)
3. **Interview Type** (prefilled via `prefill_custom_3`)

### Prefill Fields:

The integration automatically prefills:

- Candidate name
- Position title
- Candidate skills
- Interview type (when using specific interview types)

## Features Included

✅ **Popup Scheduling** - Quick scheduling in a popup window
✅ **Inline Calendar** - Full calendar view in a modal
✅ **Multiple Interview Types** - Different event types for different stages
✅ **Bulk Scheduling** - Schedule all top candidates at once
✅ **Candidate Information** - Auto-filled candidate details
✅ **Hover Dropdown** - Easy access to scheduling options

## Testing

1. Click any "Schedule Interview" button on a ranked candidate
2. Choose between popup or inline scheduling
3. Select specific interview types from the dropdown
4. Test the "Schedule All Interviews" button for bulk scheduling

## Troubleshooting

**If Calendly popup doesn't work:**

- The system automatically falls back to opening Calendly in a new tab
- Ensure the Calendly widget script is loaded in index.html

**If prefill data doesn't appear:**

- Check that your Calendly event has the corresponding custom fields set up
- Verify the field names match the prefill parameters
