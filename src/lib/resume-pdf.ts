import PDFDocument from "pdfkit";
import { siteConfig } from "./site-config";

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^-\s+/gm, "• ")
    .trim();
}

export async function generateResumePdf(resumeMarkdown: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "LETTER",
      margins: { top: 54, bottom: 54, left: 54, right: 54 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .text(siteConfig.name, { align: "left" });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#555555")
      .text(
        `${siteConfig.location} · ${siteConfig.links.linkedin.replace("https://", "")} · ${siteConfig.links.github.replace("https://", "")}`,
      );
    doc.moveDown(1);
    doc.fillColor("#000000");

    const plainText = stripMarkdown(resumeMarkdown);
    const sections = plainText.split(/\n{2,}/);

    for (const section of sections) {
      const lines = section.split("\n");
      const heading = lines[0]?.trim();
      const body = lines.slice(1).join("\n").trim();

      if (!heading) continue;

      const isHeading =
        heading.length < 80 &&
        !heading.startsWith("•") &&
        (body.length > 0 || lines.length === 1);

      if (isHeading && body) {
        doc.moveDown(0.5).font("Helvetica-Bold").fontSize(12).text(heading);
        doc.font("Helvetica").fontSize(10).text(body, { lineGap: 3 });
      } else if (isHeading) {
        doc.moveDown(0.5).font("Helvetica-Bold").fontSize(12).text(heading);
      } else {
        doc.font("Helvetica").fontSize(10).text(section, { lineGap: 3 });
      }
    }

    doc.end();
  });
}
