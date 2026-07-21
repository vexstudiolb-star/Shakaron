import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function getR2Config() {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return {
    accountId,
    bucket: requireEnv("R2_BUCKET_NAME"),
    publicUrl: requireEnv("R2_PUBLIC_URL").replace(/\/$/, ""),
    client: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      },
    }),
  };
}

export function buildR2Key(folder: string, fileName: string) {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const stamp = Date.now();
  return `${folder}/${stamp}-${safe}`;
}

export function publicUrlForKey(key: string) {
  const { publicUrl } = getR2Config();
  return `${publicUrl}/${key}`;
}

export async function uploadToR2(params: {
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
}) {
  const { client, bucket } = getR2Config();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    })
  );
  return publicUrlForKey(params.key);
}

export async function createPresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const { client, bucket } = getR2Config();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
  });
  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 300,
  });
  return { uploadUrl, publicUrl: publicUrlForKey(params.key), key: params.key };
}
