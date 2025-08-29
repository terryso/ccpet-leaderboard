# 🐾 CCPET Leaderboard

A beautiful, real-time leaderboard for Claude Code virtual pets, built with Next.js and Supabase. Track your pets' token usage, costs, and survival time in an engaging, competitive format!

![CCPET Leaderboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=🐾+CCPET+Leaderboard)

## ✨ Features

- 🏆 **Real-time Rankings** - Live leaderboard with token usage and cost tracking
- 🐾 **Pet Profiles** - Display pet names, types, and survival status with cute emojis
- 📊 **Multiple Time Periods** - Today, 7 days, 30 days, and all-time rankings
- 💰 **Cost Tracking** - Monitor spending on Claude API usage
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Real-time Updates** - Powered by Supabase for instant data sync
- 🎨 **Modern UI** - Built with Shadcn/ui components and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- NPM or similar package manager
- A running CCPET instance with Supabase configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ccpet-leaderboard
   cd ccpet-leaderboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase** 
   
   Update the Supabase configuration in `src/lib/supabase.ts`:
   ```typescript
   const supabaseUrl = 'your-supabase-url'
   const supabaseAnonKey = 'your-supabase-anon-key'
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your leaderboard!

## 🏗️ Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── page.tsx         # Main leaderboard page
│   └── layout.tsx       # Root layout
├── components/
│   └── ui/              # UI components (Shadcn/ui)
├── hooks/
│   └── useLeaderboard.ts # Custom hook for data fetching
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

## 📊 Data Structure

The leaderboard connects to your CCPET Supabase database with these main tables:

- **`pet_records`** - Pet information (name, type, birth/death times)
- **`token_usage`** - Token consumption and cost data

## 🎯 Features in Detail

### 🏆 Ranking System
- Pets are ranked by total token usage by default
- Special crown (👑), silver (🥈), and bronze (🥉) medals for top 3
- Real-time rank updates as data changes

### 📈 Time Period Filtering
- **Today**: Rankings for current day only
- **7 Days**: Weekly leaderboard 
- **30 Days**: Monthly competition
- **All Time**: Historical rankings

### 🐾 Pet Display
- Cute animal emojis for different pet types
- Pet names and age information
- Survival status (alive ✅ or dead 💀)
- Token usage and cost metrics

### 🔄 Real-time Updates
- Automatic refresh functionality
- Loading states and error handling
- Responsive data fetching with React hooks

## 🛠️ Technology Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Supabase](https://supabase.com/)** - Backend as a service
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

## 🎨 Customization

### Styling
The project uses Tailwind CSS and Shadcn/ui. You can customize:
- Color schemes in `tailwind.config.ts`
- Component styles in the `components/ui` directory
- Layout and spacing in the main page component

### Data Display
- Modify pet emoji mappings in `src/lib/supabase.ts`
- Adjust ranking logic in `src/hooks/useLeaderboard.ts`
- Add new time periods or sorting options

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables for Supabase (if using env vars)
3. Deploy with automatic builds on git push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for the CCPET community
- Inspired by competitive gaming leaderboards
- Thanks to all the pet owners who keep their virtual pets alive! 🐾

---

Made with ❤️ by the CCPET community. Keep your pets happy and climb the ranks! 🚀
