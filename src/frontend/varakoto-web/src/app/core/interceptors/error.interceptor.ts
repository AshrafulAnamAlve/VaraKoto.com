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
        if (error.error?.messageBn) {
          friendlyMessage = error.error.messageBn;
        } else if (error.error?.message && typeof error.error.message === 'string') {
          friendlyMessage = error.error.message;
        } else if (error.error?.errors && typeof error.error.errors === 'object') {
          const firstKey = Object.keys(error.error.errors)[0];
          const firstVal = error.error.errors[firstKey];
          friendlyMessage = Array.isArray(firstVal) && firstVal.length > 0 ? firstVal[0] : 'প্রদত্ত তথ্যে ভুল রয়েছে। অনুগ্রহ করে তথ্য পরীক্ষা করুন।';
        } else {
          friendlyMessage = 'প্রদত্ত তথ্যে ভুল রয়েছে। অনুগ্রহ করে তথ্য পরীক্ষা করুন।';
        }
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
