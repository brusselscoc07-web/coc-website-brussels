export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

const usingResend = !!process.env.RESEND_API_KEY;
const FROM_ADDRESS = process.env.EMAIL_FROM || "Church of Christ Brussels <onboarding@resend.dev>";

// No RESEND_API_KEY yet (no real email account bound) -> log the email instead
// of sending it. Callers never need to know which mode is active: the DB write
// that triggered the email has already succeeded either way.
export async function sendEmail(input: SendEmailInput): Promise<{ sent: boolean }> {
  if (!usingResend) {
    console.log(
      [
        "[dev email — not actually sent, RESEND_API_KEY unset]",
        `To: ${input.to}`,
        input.replyTo ? `Reply-To: ${input.replyTo}` : null,
        `Subject: ${input.subject}`,
        "",
        input.text,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    );
    return { sent: true };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: input.to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo,
    });
    if (error) {
      console.error("Resend send failed:", error);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("Resend send threw:", err);
    return { sent: false };
  }
}
