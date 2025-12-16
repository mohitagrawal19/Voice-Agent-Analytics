# Voice Agent Analytics Dashboard

A modern ReactJS + TypeScript web application displaying real-time call analytics for voice agents. Features interactive charts, email-based data persistence with Supabase, and customizable chart values.

## Features

- 📊 **Interactive Analytics Dashboards** - Beautiful charts showing call duration, success rates, and agent performance
- ✏️ **Customizable Charts** - Edit chart values and see real-time updates
- 📧 **Email-Based Data Persistence** - Save custom values against your email using Supabase
- 🔄 **Previous Values Alert** - Get notified of previous custom values before overwriting
- 🎨 **Modern UI Design** - Inspired by SuperBryn.com with gradient backgrounds and smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Supabase (optional)
- **Build Tool**: Vite
- **Storage**: Supabase PostgreSQL (with localStorage fallback)

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd voice-analytics-dashboard

# Install dependencies
npm install

# Create .env.local file with Supabase credentials (optional)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
# Start the development server
npm run dev

# The app will open at http://localhost:5173
```

## Building

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build first
npm run build

# Deploy using Netlify CLI or connect your GitHub repo on netlify.com
```

## Project Structure

```
src/
├── components/
│   ├── AnalyticsChart.tsx    # Reusable chart component
│   └── Modals.tsx             # Email and edit modals
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── storage.ts             # Data persistence logic
├── types/
│   └── index.ts               # TypeScript interfaces
├── App.tsx                     # Main application
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Features in Detail

### 1. Analytics Dashboard
- Displays three different chart types (line, pie, bar)
- Shows dummy data for call metrics
- Real-time statistics cards at the top

### 2. Custom Chart Values
- Click "Edit" button on any chart
- Modify values and submit
- Changes are saved to Supabase (or localStorage if not configured)

### 3. Email Authentication
- Enter email before saving custom data
- Email is stored in localStorage for persistence
- Sign out anytime to switch accounts

### 4. Previous Values Alert
- If custom values exist for a chart, you'll be prompted
- Shows previous values before allowing overwrite
- Prevents accidental data loss

## Supabase Setup (Optional)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a `chart_customizations` table with these columns:
   - `id` (uuid, primary key)
   - `email` (text)
   - `chartType` (text)
   - `customData` (jsonb)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

3. Add environment variables to `.env.local`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

If Supabase is not configured, the app will use localStorage as fallback.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
