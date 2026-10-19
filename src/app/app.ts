import { Location, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from './scroll-reveal.directive';

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  message: string;
}

interface Project {
  title: string;
  description: string;
  role: string;
  initials: string;
  technologies: string[];
  repository: string;
}

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';
type NavigationTarget = 'projects' | 'skills' | 'about' | 'contact';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ScrollRevealDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly location = inject(Location);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly apiUrl = 'http://localhost:5038/api/contact';

  protected menuOpen = false;
  protected readonly isSubmitting = signal(false);
  protected readonly submissionState = signal<SubmissionState>('idle');
  protected readonly submissionMessage = signal('');
  protected contact: ContactRequest = { name: '', email: '', message: '' };

  protected readonly projects: Project[] = [
    {
      title: 'Service & Supply Management System',
      description:
        'A full-stack system for service and supply management, with an Angular client and a modular .NET API.',
      role: 'Full-stack project',
      initials: 'SSMS',
      technologies: ['Angular', 'ASP.NET Core', '.NET 10', 'Entity Framework Core'],
      repository: 'https://github.com/henok1111/ssms_project',
    },
    {
      title: 'Training Management System',
      description:
        'A full-stack training management application with an Angular client and an ASP.NET Core API backed by PostgreSQL.',
      role: 'Full-stack project',
      initials: 'TMS',
      technologies: ['Angular', 'ASP.NET Core', '.NET 10', 'PostgreSQL'],
      repository: 'https://github.com/henok1111/TMS',
    },
    {
      title: 'Fix My Campus',
      description:
        'A team-built campus platform with an Angular frontend, ASP.NET Core API, and PostgreSQL data layer.',
      role: 'Team lead & pitch',
      initials: 'FMC',
      technologies: ['Angular', 'ASP.NET Core', 'PostgreSQL'],
      repository: 'https://github.com/henok1111/fix-my-campas-',
    },
    {
      title: 'Court Information System',
      description:
        'A court information management system built with a React frontend and a Node.js, Express, and MySQL backend.',
      role: 'Full-stack project',
      initials: 'CIS',
      technologies: ['React', 'Node.js', 'Express.js', 'MySQL'],
      repository: 'https://github.com/henok1111/fullproject/tree/master',
    },
  ];

  protected navigateTo(sectionId: NavigationTarget, event: Event): void {
    event.preventDefault();
    this.menuOpen = false;
    this.location.go(`#${sectionId}`);
    this.viewportScroller.scrollToAnchor(sectionId);
  }

  protected submitContact(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionState.set('sending');
    this.submissionMessage.set('');

    this.http.post<ContactResponse>(this.apiUrl, this.contact).subscribe({
      next: (response) => {
        this.submissionState.set('success');
        this.submissionMessage.set(response.message);
        this.contact = { name: '', email: '', message: '' };
        this.isSubmitting.set(false);
      },
      error: () => {
        this.submissionState.set('error');
        this.submissionMessage.set(
          'Your note could not be sent. Check that the ASP.NET Core API is running, then try again.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
