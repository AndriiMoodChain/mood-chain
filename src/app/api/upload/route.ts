import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const projectId = process.env.PINATA_PROJECT_ID;
const projectSecret = process.env.PINATA_SECRET;
const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

const client = ipfsHttpClient({
  host: 'gateway.pinata.cloud',
  port: 443,
  protocol: 'https',
  headers: {
    Authorization: auth,
  },
});

export async function POST(req:NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const mood = formData.get('mood');
    const description = formData.get('description');

    if (!imageFile || typeof imageFile === 'string') {
      return NextResponse.json({ error: 'Missing image' }, { status: 400 });
    }

    
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageResult = await client.add(imageBuffer);

    const metadata = {
      name: `Mood NFT - ${mood}`,
      description: description || `Mood captured as NFT: ${mood}`,
      image: `https://gateway.pinata.cloud/ipfs/${imageResult.path}`,
      attributes: [
        { trait_type: 'Mood', value: mood },
        { trait_type: 'Timestamp', value: new Date().toISOString() },
      ],
    };

    
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    const metadataResult = await client.add(metadataBuffer);

    return NextResponse.json({ uri: `https://gateway.pinata.cloud/ipfs/${metadataResult.path}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}