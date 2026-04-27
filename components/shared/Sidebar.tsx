import { getSections } from '@/lib/sections';
import { getAllContent, getAllMedia } from '@/lib/content';
import { SidebarSection } from './SidebarSection';
import { FileItem } from './FileItem';
import { AddFileButton } from '@/components/admin/AddFileButton';

interface SidebarProps {
  mode: 'public' | 'admin';
}

export async function Sidebar({ mode }: SidebarProps) {
  const sections = getSections();
  const contentMap = getAllContent({ mode });
  const mediaFiles = getAllMedia({ mode });
  const isAdmin = mode === 'admin';
  const showMedia = isAdmin || mediaFiles.length > 0;

  return (
    <nav className="flex flex-col">
      {/* Root intro item */}
      <FileItem
        title="Ethan Trang"
        href={isAdmin ? '/admin/intro' : '/'}
        showDelete={false}
      />

      {/* Media — flat link below root item */}
      {showMedia && (
        <FileItem
          title="Media"
          href={isAdmin ? '/admin/media' : '/media'}
          showDelete={false}
        />
      )}

      {/* Content sections */}
      {sections.map((section) => {
        const files = contentMap.get(section.id) ?? [];
        return (
          <SidebarSection
          key={section.id}
          section={section}
          actions={isAdmin ? <AddFileButton sectionId={section.id} /> : undefined}
        >
            {files.length > 0 ? (
              files.map((file) => (
                <FileItem
                  key={file.slug}
                  title={file.title}
                  href={isAdmin ? `/admin/${file.slug}` : `/${file.slug}`}
                  status={file.status}
                  showStatus={isAdmin}
                  showDelete={isAdmin}
                  deleteSlug={file.slug}
                />
              ))
            ) : (
              <p className="px-3 py-1 text-xs text-muted-foreground pl-8">Nothing here yet</p>
            )}
          </SidebarSection>
        );
      })}

    </nav>
  );
}
