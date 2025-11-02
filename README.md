# No Tricks, OnlyTreats
---
React + Next.js app integrating OpenAI API and public data from data.sfgov.org to help families discover San Francisco neighborhood quirks and the best streets for trick or treating!

---
Deployment: https://no-tricks-onlytreats.vercel.app/
---
Version 1 MVP Complete:
- Neighborhood selection and count input to return number of top count ranked streets
- Static map to show neighborhood division lines for search reference
- AI summary of neighborhood (description, demographics, family friendliness, activities)
- Clickable street rows for AI summary of street (description, safety, walkability)
---
## Algorithm

Factors in property sale date, density per property, and property type.

- Older sale dates, lower density, and single family homes are given a higher score.  
- Recent sale dates, higher density, and higher unit apartments are given a lower score.

- **Sale date:** (current year - year last sold) compared to metric  
- **Density:** (number of units on property) compared to metric  
- **Property type:** (property type) with assigned score

---
Future:
- Dynamic and interactive map marking street paths
- Map search box, click map to search neighborhood
- Online hosting
- AI prompt preferences for activities, age group

---
Dependencies:

- React 19.2.x
- Next.js 16.0.x
- OpenAI API 6.7.x
- data.sfgov.org
- Tailwind CSS 4.1.x 
---
To run:
- git clone https://github.com/yourusername/onlytreats.git
- cd onlytreats
- create .env file in root, add OPENAI_API_KEY="key" (needed for AI summaries)
- npm install
- npm run dev
- Local hosting: http://localhost:3000/
--- 

## Documentation Convention

### File / API Route

#### functionName
---

**Headers (if relevant):**

    - Content-Type: application/json


**HTTP Query Params (if relevant):**

    - param

**Request Body (if relevant):**

{
    "stuff": "stuff
}

**Function Params:**

    - param
    
**Behaviors:**

    - on fail
    - on success

**Response JSON:**

    - Success response

**Error:**

    - Error code: reason
    