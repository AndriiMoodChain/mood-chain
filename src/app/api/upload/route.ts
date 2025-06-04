import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK(
  process.env.NEXT_PUBLIC_PINATA_API_KEY!,
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY!
);

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); 
  return stream;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('file') as File;
    const mood = formData.get('mood') as string;
    const description = formData.get('description') as string;
    const createdAt = formData.get('createdAt') as string;

    if (!imageFile || !mood) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readableStream = bufferToStream(buffer);

    const fileName = `mood-image-${Date.now()}.${imageFile.type.split('/')[1] || 'jpg'}`;

    const imageResult = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: {
        name: fileName,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });
    console.log(imageResult)

    const metadata = {
      name: `Mood NFT - ${mood}`,
      description: description || `Captured mood: ${mood}`,
      image: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,
      attributes: [
        { trait_type: 'Mood', value: mood },
        { trait_type: 'Date', value: createdAt },
        ...(description ? [{ trait_type: 'Note', value: description }] : []),
      ],
      properties: {
        files: [
          {
            uri: imageResult.IpfsHash,
            type: imageFile.type,
          },
        ],
      },
    };

    const metadataResult = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `mood-metadata-${Date.now()}`,
      },
    });

    const responseData = {
      metadataUri: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`,      
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
