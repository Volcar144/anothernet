import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractStyleScheme(raw: string) {
  const match = raw.match(/<!--STYLE_SCHEME([\s\S]*?)STYLE_SCHEME-->/);
  const styleScheme = match ? JSON.parse(match[1]) : null;
  const html = raw.replace(/<!--STYLE_SCHEME[\s\S]*?STYLE_SCHEME-->\s*/, "");
  return { styleScheme, html };
}

export async function streamToString(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function getDomain(address: string): string {
  const withProtocol = address.startsWith("http://") || address.startsWith("https://")
      ? address
      : `https://${address}`;

  return new URL(withProtocol).hostname.replace(/^www\./, "");
}

export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, "");
}
