import { signal } from '@preact/signals';
import type { Project } from '@/types/canvas';

export const projects = signal<Project[]>([]);
export const projectsLoading = signal(false);
export const currentProject = signal<Project | null>(null);
