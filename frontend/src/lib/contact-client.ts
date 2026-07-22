import { siteConfig } from "./site-config";

export type ContactFormInput = {
  name: string;
  email: string;
  message: string;
  engagementType?: string;
};

export type ContactFormResult = {
  id: string;
  status: "received";
};

type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

export async function submitContactForm(
  input: ContactFormInput,
  fetcher: Fetcher = fetch,
): Promise<ContactFormResult> {
  const response = await fetcher(`${siteConfig.backendApiUrl}/v1/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      message: input.message,
      engagement_type: input.engagementType || undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Contact submission failed");
  }

  return response.json() as Promise<ContactFormResult>;
}
