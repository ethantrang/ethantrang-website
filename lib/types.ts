export type ContentStatus = 'draft' | 'private' | 'public';

export interface ContentFrontmatter {
  title: string;
  slug: string;
  section: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFile {
  frontmatter: ContentFrontmatter;
  body: string;
  filePath: string;
}

export interface MediaFrontmatter {
  description: string;
  src: string;
  status: ContentStatus;
  createdAt: string;
}

export interface MediaFile {
  frontmatter: MediaFrontmatter;
  filePath: string;
  slug: string;
}

export interface Section {
  id: string;
  label: string;
  order: number;
  isMedia?: boolean;
}

export interface SectionsConfig {
  sections: Section[];
}
