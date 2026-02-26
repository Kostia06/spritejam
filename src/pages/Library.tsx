import { useState, useEffect, useCallback } from 'preact/hooks';
import { PageTransition } from '@/components/ui/PageTransition';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { GlowCard } from '@/components/ui/GlowCard';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/signals/auth';

/* ============================================
   Types
   ============================================ */

interface LibraryProject {
  id: string;
  title: string;
  canvasWidth: number;
  canvasHeight: number;
  fps: number;
  thumbnailUrl: string | null;
  isPublic: boolean;
  updatedAt: string;
}

/* ============================================
   Project Card
   ============================================ */

function ProjectCard({
  project,
  index,
  onDelete,
}: {
  project: LibraryProject;
  index: number;
  onDelete: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const updatedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      class={`reveal stagger-${(index % 5) + 1} group relative rounded-xl overflow-hidden card-3d gradient-border transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(108,92,231,0.3)]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a href={`/editor/${project.id}`} class="block">
        <div class="aspect-square bg-[var(--bg-2)] flex items-center justify-center overflow-hidden">
          {project.thumbnailUrl ? (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              class="h-full w-full object-cover"
              loading="lazy"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div class="text-[var(--text-2)] font-pixel text-sm">
              {project.canvasWidth}x{project.canvasHeight}
            </div>
          )}
        </div>

        <div class="p-4 bg-[var(--bg-1)]">
          <h3 class="font-pixel text-sm font-semibold text-[var(--text-0)] truncate">
            {project.title}
          </h3>
          <div class="mt-1 flex items-center justify-between text-xs text-[var(--text-2)]">
            <span>{updatedDate}</span>
            <span class={project.isPublic ? 'text-[var(--success)]' : 'text-[var(--text-2)]'}>
              {project.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </a>

      {/* Delete button (visible on hover) */}
      {isHovered && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project.id);
          }}
          class="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[var(--error)]/80 text-white backdrop-blur-sm cursor-pointer transition-opacity"
          aria-label={`Delete ${project.title}`}
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ============================================
   Empty State
   ============================================ */

function EmptyState() {
  return (
    <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div class="mb-6 h-16 w-16 rounded-2xl bg-[var(--bg-2)] flex items-center justify-center">
        <svg class="w-8 h-8 text-[var(--text-2)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h3 class="font-pixel text-lg text-[var(--text-0)]">No projects yet</h3>
      <p class="mt-2 text-sm text-[var(--text-1)] max-w-xs">
        Create your first pixel art project and start animating.
      </p>
      <div class="mt-6">
        <a href="/editor">
          <Button variant="gradient">Create Project</Button>
        </a>
      </div>
    </div>
  );
}

/* ============================================
   Sign-In Prompt
   ============================================ */

function SignInPrompt() {
  return (
    <div class="flex min-h-[60dvh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h2 class="font-pixel text-2xl text-gradient">Sign in to view your library</h2>
      <p class="text-sm text-[var(--text-1)] max-w-xs">
        Your projects, assets, and purchased sprites live here.
      </p>
      <a href="/login">
        <Button variant="gradient" size="lg">Sign In</Button>
      </a>
    </div>
  );
}

/* ============================================
   Library Page
   ============================================ */

export function Library() {
  const [projects, setProjects] = useState<LibraryProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.get<LibraryProject[]>('/api/projects');
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated.value) return;
    fetchProjects();
  }, [fetchProjects]);

  async function handleDelete(projectId: string) {
    const confirmed = window.confirm('Delete this project? This cannot be undone.');
    if (!confirmed) return;

    try {
      await api.del(`/api/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch {
      // silently fail; could show toast
    }
  }

  if (!isAuthenticated.value) {
    return (
      <PageTransition>
        <SignInPrompt />
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section class="mx-auto max-w-6xl px-6 pt-28 pb-10">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="font-pixel text-2xl font-bold text-gradient sm:text-3xl md:text-4xl">
            My Library
          </h1>
          <a href="/editor">
            <Button variant="gradient">New Project</Button>
          </a>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 pb-24">
        <ScrollReveal>
          {isLoading ? (
            <div class="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : projects.length === 0 ? (
            <EmptyState />
          ) : (
            <div class="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      <Footer />
    </PageTransition>
  );
}

export default Library;
