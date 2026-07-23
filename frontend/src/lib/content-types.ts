export type ProjectStatus = "draft" | "published" | "archived";
export type ContentVisibility = "public" | "private";

export type ProjectMetric = {
  label: string;
  value: string;
  public: boolean;
};

export type ProjectSection = {
  heading: string;
  content: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  featured: boolean;
  status: ProjectStatus;
  visibility: ContentVisibility;
  year: number;
  categories: string[];
  technologies: string[];
  deployment: string[];
  metrics: ProjectMetric[];
  company: {
    name: string | null;
    discloseName: boolean;
  };
  sections: ProjectSection[];
  sourcePath: string;
};

export type Profile = {
  name: string;
  headline: string;
  location?: string;
  summary: string;
  contact: {
    email: string;
    whatsappUrl: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
  assistant: {
    displayName: string;
  };
};

export type SkillGroup = {
  name: string;
  skills: string[];
};

export type ExperienceItem = {
  title: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
};

export type LinkedInSection = {
  heading: string;
  content: string;
};

export type LinkedInCertification = {
  title: string;
  issuer: string;
  issued: string;
  credential: string;
};
