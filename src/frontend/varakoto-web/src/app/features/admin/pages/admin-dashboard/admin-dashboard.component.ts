import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { AdminStatsModel, AdminSubmissionModel } from '../../../../core/models/admin.model';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  readonly adminService = inject(AdminService);

  readonly stats = signal<AdminStatsModel | null>(null);
  readonly submissions = signal<AdminSubmissionModel[]>([]);
  readonly selectedFilter = signal<string>('Pending');
  readonly isLoading = signal<boolean>(false);
  readonly actionMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  ngOnInit(): void {
    this.loadStats();
    this.loadSubmissions(this.selectedFilter());
  }

  loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => {}
    });
  }

  loadSubmissions(status: string): void {
    this.selectedFilter.set(status);
    this.isLoading.set(true);
    this.adminService.getSubmissions(status).subscribe({
      next: (list) => {
        this.submissions.set(list);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onApprove(sub: AdminSubmissionModel): void {
    this.adminService.approveSubmission(sub.id, 'Approved via Admin Panel').subscribe({
      next: () => {
        this.actionMessage.set({
          type: 'success',
          text: `রুট "${sub.fromLocationName} ➔ ${sub.toLocationName}"-এর ৳${sub.userSubmittedFare} ভাড়া সফলভাবে অনুমোদিত হয়েছে!`
        });
        this.loadStats();
        this.loadSubmissions(this.selectedFilter());
        this.clearMessageAfterDelay();
      },
      error: () => {
        this.actionMessage.set({
          type: 'error',
          text: 'অনুমোদন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
        });
      }
    });
  }

  onReject(sub: AdminSubmissionModel): void {
    this.adminService.rejectSubmission(sub.id, 'Rejected by Admin').subscribe({
      next: () => {
        this.actionMessage.set({
          type: 'success',
          text: `রুট "${sub.fromLocationName} ➔ ${sub.toLocationName}"-এর সাবমিশনটি বাতিল করা হয়েছে।`
        });
        this.loadStats();
        this.loadSubmissions(this.selectedFilter());
        this.clearMessageAfterDelay();
      },
      error: () => {
        this.actionMessage.set({
          type: 'error',
          text: 'বাতিল করা সম্ভব হয়নি।'
        });
      }
    });
  }

  onDelete(sub: AdminSubmissionModel): void {
    if (!confirm(`আপনি কি নিশ্চিত যে এই সাবমিশনটি ডিলিট করতে চান?`)) {
      return;
    }
    this.adminService.deleteSubmission(sub.id).subscribe({
      next: () => {
        this.actionMessage.set({
          type: 'success',
          text: 'সাবমিশনটি স্থায়ীভাবে ডিলিট করা হয়েছে।'
        });
        this.loadStats();
        this.loadSubmissions(this.selectedFilter());
        this.clearMessageAfterDelay();
      }
    });
  }

  logout(): void {
    this.adminService.logout();
  }

  private clearMessageAfterDelay(): void {
    setTimeout(() => {
      this.actionMessage.set(null);
    }, 4000);
  }
}
