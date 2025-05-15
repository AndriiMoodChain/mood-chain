# MoodChain — Mental Health NFT Journal on Solana

MoodChain is a decentralized mood journaling platform that allows users to reflect on their emotions and mint unique visual NFTs that represent their current mental state — securely stored on the Solana blockchain.

 Built with a focus on self-expression, emotional awareness, and Web3-powered digital identity.

##  Key Features

- **Mood Tracking**: Log your daily mood with a description and a custom image.
- **NFT Minting**: Each entry is minted as a 1-of-1 NFT on Solana and stored permanently on-chain.
- **User-Owned Assets**: Users sign transactions and fully own the NFTs they create.
- **Emotional Memory**: Your mood entries become collectible and reflective mental health artifacts.
- **Secure & Private**: No centralized database — all records are stored in wallets and on-chain.
- *Powered by Solana**: Fast, cheap, and eco-friendly blockchain ideal for journaling NFTs.

##  Why It Matters

Mental health often goes undocumented and unexpressed. MoodChain aims to:

- Help individuals reflect daily through visual and emotional expression.
- Build a Web3-native form of journaling that creates a positive habit loop.
- Explore how NFTs can be used beyond art or collectibles — for wellbeing and identity.

##  Tech Stack

| Layer               | Technology               |
|---------------------|--------------------------|
| Frontend            | Next.js, TypeScript, Tailwind |
| Blockchain          | Solana (Devnet)          |
| Wallet Integration  | Solana Wallet Adapter    |
| NFT Minting         | Metaplex JS SDK          |
| Hosting             | Vercel / Local Docker    |

##  How It Works

1. User selects mood (e.g. Happy, Sad, Calm).
2. Uploads an image (e.g. selfie, drawing, background).
3. Writes a short reflection (optional).
4. Signs a transaction using Phantom Wallet.
5. NFT is minted on Solana with:
   - Mood metadata
   - User's image (stored on Arweave)
   - Timestamp

User owns the NFT, forever visible in their wallet and public Solana explorers.

##  Ideas for Future

- **Mood analytics** and emotional trends over time.
- **Shareable mood NFTs** with friends or therapists.
- **Encrypted mood entries** (zkNFTs).
- **AI-generated art** based on mood & text.
- **Mobile-first journaling app**.

## Setup Instructions

```bash
git clone https://github.com/AndriiMoodChain/mood-chain.git
cd mood-chain
npm install
npm run dev