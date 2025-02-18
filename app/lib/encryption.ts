import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is not set');
}

// Derive a 32-byte key using scrypt
const keyBuffer = scryptSync(ENCRYPTION_KEY, 'salt', 32);

export async function encrypt(text: string): Promise<string> {
  // Generate a random initialization vector
  const iv = randomBytes(12);

  // Create cipher
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get the auth tag
  const authTag = cipher.getAuthTag();

  // Return IV + Auth Tag + Encrypted data
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export async function decrypt(encryptedText: string): Promise<string> {
  // Split the encrypted text into IV, Auth Tag, and data
  const [ivHex, authTagHex, encryptedData] = encryptedText.split(':');

  if (!ivHex || !authTagHex || !encryptedData) {
    throw new Error('Invalid encrypted text format');
  }

  // Convert hex strings back to buffers
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  // Create decipher
  const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv);
  decipher.setAuthTag(authTag);

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
