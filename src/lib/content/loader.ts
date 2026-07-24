import fs from "fs/promises";
import path from "path";

export interface ContentBundle {
  resume: string;
  skills: string;
  projects: Record<string, string>;
  /** Combined text for prompt injection and eval grounding checks */
  fullText: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readFileIfExists(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

async function loadProjects(): Promise<Record<string, string>> {
  const projectsDir = path.join(CONTENT_DIR, "projects");
  const projects: Record<string, string> = {};

  try {
    const entries = await fs.readdir(projectsDir);
    for (const entry of entries) {
      if (!entry.endsWith(".md")) continue;
      const content = await fs.readFile(
        path.join(projectsDir, entry),
        "utf-8",
      );
      projects[entry.replace(/\.md$/, "")] = content;
    }
  } catch {
    // projects/ directory may not exist yet
  }

  return projects;
}

export async function loadContent(): Promise<ContentBundle> {
  const resume = await readFileIfExists(path.join(CONTENT_DIR, "resume.md"));
  const skills = await readFileIfExists(path.join(CONTENT_DIR, "skills.md"));
  const projects = await loadProjects();

  const projectSections = Object.entries(projects)
    .map(([name, content]) => `## Project: ${name}\n\n${content}`)
    .join("\n\n");

  const fullText = [
    resume && `# Resume\n\n${resume}`,
    skills && `# Skills\n\n${skills}`,
    projectSections && `# Projects\n\n${projectSections}`,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  return { resume, skills, projects, fullText };
}
