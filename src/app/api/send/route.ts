import { EmailTemplate } from "@/components/email-template";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEYS);

export async function POST(request: NextRequest) {
  // const { username, subject, email, content } = await request.json();

  const formData = await request.formData();

  const username = formData.get("username") as string;
  const subject = formData.get("subject") as string;
  const email = formData.get("email") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File;

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [process.env.EMAIL as string],
      subject,
      react: EmailTemplate({
        username,
        email,
        content,
      }) as React.ReactElement,
      attachments: [{ filename: file.name, content: buffer }],
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
