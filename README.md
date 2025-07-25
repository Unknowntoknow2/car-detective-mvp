# Car Detective MVP - Professional Vehicle Market Analysis

**100% Real Data Guarantee - Zero Synthetic Generation**

This professional vehicle market analysis platform guarantees accurate, real-time market data with zero synthetic data generation.

## 🎯 Professional Market Search Guarantees

- **100% Real Data Only**: All vehicle listings come from verified automotive marketplaces
- **URL Validation**: Every listing URL is validated with HTTP HEAD requests before display
- **Live Market Sources**: Direct integration with AutoTrader, Cars.com, CarGurus, CarMax, and other verified sources
- **No Synthetic Fallbacks**: Returns empty results instead of generated/estimated data when no real comps are found
- **Professional APIs**: Uses Bing Search API and OpenAI function calling for guaranteed accuracy

## 🔧 Configuration

Copy `.env.example` to `.env` and configure the required API keys:

```bash
# Required for real market data
BING_API_KEY=your_bing_cognitive_services_api_key

# Optional but recommended for enhanced intelligence
OPENAI_API_KEY=your_openai_api_key

# Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API Key Setup

1. **Bing Search API**: Get from [Microsoft Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
2. **OpenAI API**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

## 🚀 Technical Architecture

### Professional Market Search Pipeline

1. **OpenAI Function Calling**: Routes requests to appropriate search agents
2. **Bing Search Integration**: Searches real automotive marketplace websites
3. **URL Validation**: HTTP HEAD requests verify all listing URLs are live
4. **Quality Filtering**: Removes unrealistic prices, invalid data, placeholder content
5. **Real Data Only**: Returns empty results if no verified listings found

### Services

- `BingSearchService`: Microsoft Bing API integration for real marketplace search
- `OpenAIMarketAgent`: Function calling to route searches intelligently  
- `URLValidatorService`: HTTP validation of all listing URLs
- `MarketDataService`: Orchestrates the complete pipeline with quality guarantees

## Project info

**URL**: https://lovable.dev/projects/41200850-3625-4819-9176-e531ed23d3db

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the
[Lovable Project](https://lovable.dev/projects/41200850-3625-4819-9176-e531ed23d3db)
and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push
changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed -
[install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once
  you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open
[Lovable](https://lovable.dev/projects/41200850-3625-4819-9176-e531ed23d3db) and
click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect
Domain.

Read more here:
[Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
