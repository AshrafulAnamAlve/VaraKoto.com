import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let friendlyMessage = 'একটি সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';

      if (error.status === 0) {
        // Network drop / offline / CORS connection refusal
        friendlyMessage = 'ইন্টারনেট সংযোগ বিচ্ছিন্ন অথবা সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। অনুগ্রহ করে নেটওয়ার্ক চেক করুন।';
      } else if (error.status === 429) {
        // Rate limiting trigger
        friendlyMessage = 'অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
      } else if (error.status === 404) {
        friendlyMessage = error.error?.messageBn || error.error?.message || 'অনুরোধকৃত তথ্যটি পাওয়া যায়নি।';
      } else if (error.status === 400) {
        friendlyMessage = error.error?.messageBn || error.error?.message || 'প্রদত্ত তথ্যে ভুল রয়েছে।';
      } else if (error.status === 401) {
        friendlyMessage = error.error?.messageBn || 'অনুমতি নেই। পুনরায় লগইন করুন।';
      } else if (error.status >= 500) {
        friendlyMessage = 'সার্ভারে সাময়িক সমস্যা হয়েছে। আমাদের টেকনিক্যাল টিম কাজ করছে।';
      }

      // Display global notification unless request is silent search
      if (!req.url.includes('/locations/search')) {
        notificationService.showError(friendlyMessage);
      }

      return throwError(() => new Error(friendlyMessage));
    })
  );
};
