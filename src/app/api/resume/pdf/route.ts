import { loadContent } from "@/lib/content/loader";
import { generateResumePdf } from "@/lib/resume-pdf";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

export async function GET() {
  try {
    const content = await loadContent();

    if (!content.resume.trim()) {
      return new Response(JSON.stringify({ error: "Resume content not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pdf = await generateResumePdf(content.resume);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${siteConfig.resumePdfFilename}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF generation failed";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
