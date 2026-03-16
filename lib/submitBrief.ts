import { FormPayload } from "./types";

export async function submitBrief(payload: FormPayload): Promise<void> {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK;
    if (!webhookUrl) {
        throw new Error("NEXT_PUBLIC_N8N_WEBHOOK is not set");
    }

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
}
