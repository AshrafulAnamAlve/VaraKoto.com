import { District } from '../models/district.model';
import { LocationDto } from '../models/location.model';

export const BANGLADESH_DISTRICTS: District[] = [
  // Dhaka Division
  { id: 'dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.8103, lng: 90.4125 }, isPopular: true },
  { id: 'gazipur', nameEn: 'Gazipur', nameBn: 'গাজীপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.9989, lng: 90.4203 }, isPopular: true },
  { id: 'narayanganj', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.6238, lng: 90.5000 }, isPopular: true },
  { id: 'tangail', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 24.2513, lng: 89.9167 } },
  { id: 'narsingdi', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.9193, lng: 90.7176 } },
  { id: 'faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.6071, lng: 89.8429 } },
  { id: 'gopalganj', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.0051, lng: 89.8266 } },
  { id: 'kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 24.4449, lng: 90.7766 } },
  { id: 'madaripur', nameEn: 'Madaripur', nameBn: 'মাদারীপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.1641, lng: 90.1897 } },
  { id: 'manikganj', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.8644, lng: 90.0047 } },
  { id: 'munshiganj', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.5422, lng: 90.5305 } },
  { id: 'rajbari', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.7574, lng: 89.6445 } },
  { id: 'shariatpur', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা', center: { lat: 23.2423, lng: 90.4348 } },

  // Chattogram Division
  { id: 'chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 22.3569, lng: 91.7832 }, isPopular: true },
  { id: 'rangamati', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 22.6533, lng: 92.1753 }, isPopular: true },
  { id: 'coxsbazar', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 21.4272, lng: 92.0058 }, isPopular: true },
  { id: 'cumilla', nameEn: 'Cumilla', nameBn: 'কুমিল্লা', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 23.4682, lng: 91.1788 }, isPopular: true },
  { id: 'feni', nameEn: 'Feni', nameBn: 'ফেনী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 23.0186, lng: 91.3966 } },
  { id: 'brahmanbaria', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 23.9571, lng: 91.1119 } },
  { id: 'chandpur', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 23.2333, lng: 90.6667 } },
  { id: 'noakhali', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 22.8696, lng: 91.0994 } },
  { id: 'lakshmipur', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 22.9425, lng: 90.8412 } },
  { id: 'bandarban', nameEn: 'Bandarban', nameBn: 'বান্দরবান', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 22.1953, lng: 92.2184 } },
  { id: 'khagrachhari', nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম', center: { lat: 23.1193, lng: 91.9847 } },

  // Sylhet Division
  { id: 'sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', divisionEn: 'Sylhet', divisionBn: 'সিলেট', center: { lat: 24.8949, lng: 91.8687 }, isPopular: true },
  { id: 'moulvibazar', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionEn: 'Sylhet', divisionBn: 'সিলেট', center: { lat: 24.4829, lng: 91.7774 } },
  { id: 'habiganj', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট', center: { lat: 24.3749, lng: 91.4155 } },
  { id: 'sunamganj', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট', center: { lat: 25.0658, lng: 91.3950 } },

  // Rajshahi Division
  { id: 'rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.3745, lng: 88.6042 }, isPopular: true },
  { id: 'bogura', nameEn: 'Bogura', nameBn: 'বগুড়া', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.8465, lng: 89.3777 }, isPopular: true },
  { id: 'pabna', nameEn: 'Pabna', nameBn: 'পাবনা', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.0064, lng: 89.2372 } },
  { id: 'sirajganj', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.4534, lng: 89.7008 } },
  { id: 'naogaon', nameEn: 'Naogaon', nameBn: 'নওগাঁ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.7936, lng: 88.9318 } },
  { id: 'natore', nameEn: 'Natore', nameBn: 'নাটোর', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.4206, lng: 88.9324 } },
  { id: 'chapainawabganj', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 24.5965, lng: 88.2775 } },
  { id: 'joypurhat', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী', center: { lat: 25.1015, lng: 89.0270 } },

  // Khulna Division
  { id: 'khulna', nameEn: 'Khulna', nameBn: 'খুলনা', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 22.8456, lng: 89.5403 }, isPopular: true },
  { id: 'jashore', nameEn: 'Jashore', nameBn: 'যশোর', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.1664, lng: 89.2081 }, isPopular: true },
  { id: 'kushtia', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.9013, lng: 89.1204 } },
  { id: 'jhenaidah', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.5450, lng: 89.1726 } },
  { id: 'satkhira', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 22.7185, lng: 89.0705 } },
  { id: 'bagerhat', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 22.6516, lng: 89.7859 } },
  { id: 'chuadanga', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.6402, lng: 88.8418 } },
  { id: 'meherpur', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.7622, lng: 88.6318 } },
  { id: 'magura', nameEn: 'Magura', nameBn: 'মাগুরা', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.4873, lng: 89.4198 } },
  { id: 'narail', nameEn: 'Narail', nameBn: 'নড়াইল', divisionEn: 'Khulna', divisionBn: 'খুলনা', center: { lat: 23.1725, lng: 89.5127 } },

  // Barishal Division
  { id: 'barishal', nameEn: 'Barishal', nameBn: 'বরিশাল', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.7010, lng: 90.3535 }, isPopular: true },
  { id: 'patuakhali', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.3596, lng: 90.3299 } },
  { id: 'bhola', nameEn: 'Bhola', nameBn: 'ভোলা', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.6859, lng: 90.6481 } },
  { id: 'pirojpur', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.5841, lng: 89.9720 } },
  { id: 'barguna', nameEn: 'Barguna', nameBn: 'বরগুনা', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.0953, lng: 90.1121 } },
  { id: 'jhalokathi', nameEn: 'Jhalokathi', nameBn: 'ঝালকাঠি', divisionEn: 'Barishal', divisionBn: 'বরিশাল', center: { lat: 22.6406, lng: 90.1987 } },

  // Rangpur Division
  { id: 'rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.7439, lng: 89.2752 }, isPopular: true },
  { id: 'dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.6217, lng: 88.6355 } },
  { id: 'kurigram', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.8054, lng: 89.6362 } },
  { id: 'gaibandha', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.3288, lng: 89.5430 } },
  { id: 'nilphamari', nameEn: 'Nilphamari', nameBn: 'নীলফামারী', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.9318, lng: 88.8560 } },
  { id: 'lalmonirhat', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 25.9923, lng: 89.2847 } },
  { id: 'thakurgaon', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 26.0337, lng: 88.4617 } },
  { id: 'panchagarh', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionEn: 'Rangpur', divisionBn: 'রংপুর', center: { lat: 26.3411, lng: 88.5542 } },

  // Mymensingh Division
  { id: 'mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', center: { lat: 24.7471, lng: 90.4203 }, isPopular: true },
  { id: 'jamalpur', nameEn: 'Jamalpur', nameBn: 'জামালপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', center: { lat: 24.9375, lng: 89.9378 } },
  { id: 'netrokona', nameEn: 'Netrokona', nameBn: 'নেত্রকোণা', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', center: { lat: 24.8709, lng: 90.7279 } },
  { id: 'sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ', center: { lat: 25.0205, lng: 90.0153 } }
];

export const DISTRICT_HUBS: Record<string, LocationDto[]> = {
  dhaka: [
    { displayName: 'মিরপুর ১ গোলচত্বর ও বাস স্ট্যান্ড, ঢাকা', nameBn: 'মিরপুর ১', nameEn: 'Mirpur 1', latitude: 23.7956, longitude: 90.3537, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ২ (স্টেডিয়াম ও বোটানিক্যাল গার্ডেন), ঢাকা', nameBn: 'মিরপুর ২', nameEn: 'Mirpur 2', latitude: 23.8052, longitude: 90.3601, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ৬ কাঁচাবাজার মোড়, ঢাকা', nameBn: 'মিরপুর ৬', nameEn: 'Mirpur 6', latitude: 23.8115, longitude: 90.3582, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ৭ চলন্তিকা মোড়, ঢাকা', nameBn: 'মিরপুর ৭', nameEn: 'Mirpur 7', latitude: 23.8172, longitude: 90.3595, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১০ গোলচত্বর ও মেট্রো স্টেশন, ঢাকা', nameBn: 'মিরপুর ১০', nameEn: 'Mirpur 10', latitude: 23.8069, longitude: 90.3687, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১১ বাস স্ট্যান্ড ও মেট্রো স্টেশন, ঢাকা', nameBn: 'মিরপুর ১১', nameEn: 'Mirpur 11', latitude: 23.8185, longitude: 90.3664, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১১.৫ (পুরবী সিনেমা হল মোড়), ঢাকা', nameBn: 'মিরপুর ১১.৫', nameEn: 'Mirpur 11.5', latitude: 23.8224, longitude: 90.3658, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১২ বাস টার্মিনাল ও মেট্রো স্টেশন, ঢাকা', nameBn: 'মিরপুর ১২', nameEn: 'Mirpur 12', latitude: 23.8272, longitude: 90.3653, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১৩ (বিআরটিএ ও হার্ট ফাউন্ডেশন), ঢাকা', nameBn: 'মিরপুর ১৩', nameEn: 'Mirpur 13', latitude: 23.8041, longitude: 90.3785, district: 'Dhaka', thana: 'Kafrul', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ১৪ (ডেন্টাল কলেজ ও পুলিশ লাইন), ঢাকা', nameBn: 'মিরপুর ১৪', nameEn: 'Mirpur 14', latitude: 23.7997, longitude: 90.3872, district: 'Dhaka', thana: 'Kafrul', isHub: true, source: 'Hub' },
    { displayName: 'কাজীপাড়া মেট্রো স্টেশন ও বাস স্ট্যান্ড, ঢাকা', nameBn: 'কাজীপাড়া', nameEn: 'Kazipara', latitude: 23.7978, longitude: 90.3712, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'শেওড়াপাড়া মেট্রো স্টেশন ও বাস স্ট্যান্ড, ঢাকা', nameBn: 'শেওড়াপাড়া', nameEn: 'Shewrapara', latitude: 23.7905, longitude: 90.3734, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'পল্লবী মেট্রো স্টেশন ও আবাসিক এলাকা, ঢাকা', nameBn: 'পল্লবী', nameEn: 'Pallabi', latitude: 23.8241, longitude: 90.3639, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'রূপনগর আবাসিক এলাকা ও শিয়ালবাড়ি, ঢাকা', nameBn: 'রূপনগর আবাসিক', nameEn: 'Rupnagar R/A', latitude: 23.8179, longitude: 90.3512, district: 'Dhaka', thana: 'Rupnagar', isHub: true, source: 'Hub' },
    { displayName: 'ইব্রাহিমপুর বাজার মোড়, ঢাকা', nameBn: 'ইব্রাহিমপুর', nameEn: 'Ibrahimpur', latitude: 23.7942, longitude: 90.3854, district: 'Dhaka', thana: 'Kafrul', isHub: true, source: 'Hub' },
    { displayName: 'কচুক্ষেত বাজার ও ক্যান্টনমেন্ট গেট, ঢাকা', nameBn: 'কচুক্ষেত', nameEn: 'Kochukhet', latitude: 23.7915, longitude: 90.3912, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'কাফরুল থানা মোড়, ঢাকা', nameBn: 'কাফরুল', nameEn: 'Kafrul', latitude: 23.7958, longitude: 90.3812, district: 'Dhaka', thana: 'Kafrul', isHub: true, source: 'Hub' },
    { displayName: 'কালশী মোড় ও নতুন ফ্লাইওভার, ঢাকা', nameBn: 'কালশী', nameEn: 'Kalshi', latitude: 23.8248, longitude: 90.3752, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'বাউনিয়াবাঁধ মোড়, মিরপুর, ঢাকা', nameBn: 'বাউনিয়াবাঁধ', nameEn: 'Bauniabandh', latitude: 23.8315, longitude: 90.3712, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'মাজার রোড ও শাহ আলী মাজার, মিরপুর, ঢাকা', nameBn: 'মাজার রোড', nameEn: 'Mazar Road', latitude: 23.7989, longitude: 90.3478, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'পাইকপাড়া ডি-টাইপ কলোনি মোড়, ঢাকা', nameBn: 'পাইকপাড়া', nameEn: 'Paikpara', latitude: 23.7885, longitude: 90.3582, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'আনসার ক্যাম্প বাস স্ট্যান্ড, মিরপুর ১, ঢাকা', nameBn: 'আনসার ক্যাম্প', nameEn: 'Ansar Camp', latitude: 23.7912, longitude: 90.3521, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'টেকনিক্যাল মোড় (মিরপুর রোড), ঢাকা', nameBn: 'টেকনিক্যাল', nameEn: 'Technical', latitude: 23.7845, longitude: 90.3547, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'গাবতলী কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, ঢাকা', nameBn: 'গাবতলী', nameEn: 'Gabtoli', latitude: 23.7828, longitude: 90.3458, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'কল্যাণপুর বাস স্ট্যান্ড ও খালপাড়, ঢাকা', nameBn: 'কল্যাণপুর', nameEn: 'Kalyanpur', latitude: 23.7801, longitude: 90.3605, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'শ্যামলী স্কয়ার ও শিশু মেলা মোড়, ঢাকা', nameBn: 'শ্যামলী', nameEn: 'Shyamoli', latitude: 23.7712, longitude: 90.3644, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'মিরপুর ডিওএইচএস গেট ও শপিং কমপ্লেক্স, ঢাকা', nameBn: 'মিরপুর ডিওএইচএস', nameEn: 'Mirpur DOHS', latitude: 23.8379, longitude: 90.3754, district: 'Dhaka', thana: 'Pallabi', isHub: true, source: 'Hub' },
    { displayName: 'বাংলাদেশ জাতীয় চিড়িয়াখানা, মিরপুর, ঢাকা', nameBn: 'জাতীয় চিড়িয়াখানা', nameEn: 'National Zoo', latitude: 23.8125, longitude: 90.3465, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'জাতীয় বোটানিক্যাল গার্ডেন, মিরপুর, ঢাকা', nameBn: 'বোটানিক্যাল গার্ডেন', nameEn: 'Botanical Garden', latitude: 23.8089, longitude: 90.3498, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'সরকারি বাংলা ও কমার্স কলেজ মোড়, মিরপুর ২, ঢাকা', nameBn: 'কমার্স কলেজ', nameEn: 'Commerce College', latitude: 23.8015, longitude: 90.3589, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা রাজলক্ষ্মী কমপ্লেক্স মোড়, ঢাকা', nameBn: 'উত্তরা রাজলক্ষ্মী', nameEn: 'Uttara Rajlakshmi', latitude: 23.8681, longitude: 90.3995, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা হাউস বিল্ডিং মোড়, ঢাকা', nameBn: 'উত্তরা হাউস বিল্ডিং', nameEn: 'Uttara House Building', latitude: 23.8759, longitude: 90.3984, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা জসীমউদ্দীন এভিনিউ মোড়, ঢাকা', nameBn: 'উত্তরা জসীমউদ্দীন', nameEn: 'Uttara Jashimuddin', latitude: 23.8612, longitude: 90.4012, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা আজমপুর বাস স্ট্যান্ড, ঢাকা', nameBn: 'উত্তরা আজমপুর', nameEn: 'Uttara Azampur', latitude: 23.8648, longitude: 90.4005, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'আব্দুল্লাহপুর বাস টার্মিনাল ও ব্রিজ, ঢাকা', nameBn: 'আব্দুল্লাহপুর', nameEn: 'Abdullahpur', latitude: 23.8835, longitude: 90.3978, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১ আবাসিক এলাকা, ঢাকা', nameBn: 'উত্তরা সেক্টর ১', nameEn: 'Uttara Sector 1', latitude: 23.8562, longitude: 90.3985, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ৩ (ফ্রেন্ডস ক্লাব ও রবীন্দ্র সরণী), ঢাকা', nameBn: 'উত্তরা সেক্টর ৩', nameEn: 'Uttara Sector 3', latitude: 23.8645, longitude: 90.3965, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ৪ পার্ক ও বাজার, ঢাকা', nameBn: 'উত্তরা সেক্টর ৪', nameEn: 'Uttara Sector 4', latitude: 23.8698, longitude: 90.4032, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ৬ বাজার ও স্কুল মোড়, ঢাকা', nameBn: 'উত্তরা সেক্টর ৬', nameEn: 'Uttara Sector 6', latitude: 23.8765, longitude: 90.4045, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ৭ রবীন্দ্র সরণী মোড়, ঢাকা', nameBn: 'উত্তরা সেক্টর ৭', nameEn: 'Uttara Sector 7', latitude: 23.8715, longitude: 90.3932, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ৯ মডার্ন মোড়, ঢাকা', nameBn: 'উত্তরা সেক্টর ৯', nameEn: 'Uttara Sector 9', latitude: 23.8795, longitude: 90.3921, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১০ কামারপাড়া লিংক, ঢাকা', nameBn: 'উত্তরা সেক্টর ১০', nameEn: 'Uttara Sector 10', latitude: 23.8862, longitude: 90.3912, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১১ গরীবে নেওয়াজ এভিনিউ, ঢাকা', nameBn: 'উত্তরা সেক্টর ১১', nameEn: 'Uttara Sector 11', latitude: 23.8778, longitude: 90.3862, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১২ ও খালপাড় মোড়, ঢাকা', nameBn: 'উত্তরা সেক্টর ১২', nameEn: 'Uttara Sector 12', latitude: 23.8812, longitude: 90.3815, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১৩ গাউসুল আজম এভিনিউ, ঢাকা', nameBn: 'উত্তরা সেক্টর ১৩', nameEn: 'Uttara Sector 13', latitude: 23.8732, longitude: 90.3875, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১৪ লেক ড্রাইভ রোড, ঢাকা', nameBn: 'উত্তরা সেক্টর ১৪', nameEn: 'Uttara Sector 14', latitude: 23.8785, longitude: 90.3789, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১৫ দিয়াবাড়ী রোড, ঢাকা', nameBn: 'উত্তরা সেক্টর ১৫', nameEn: 'Uttara Sector 15', latitude: 23.8895, longitude: 90.3745, district: 'Dhaka', thana: 'Turag', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা সেক্টর ১৮ রাজউক অ্যাপার্টমেন্ট প্রজেক্ট, ঢাকা', nameBn: 'উত্তরা সেক্টর ১৮', nameEn: 'Uttara Sector 18', latitude: 23.8872, longitude: 90.3615, district: 'Dhaka', thana: 'Turag', isHub: true, source: 'Hub' },
    { displayName: 'দিয়াবাড়ী মেট্রো স্টেশন (উত্তরা উত্তর) ও বটতলা, ঢাকা', nameBn: 'দিয়াবাড়ী', nameEn: 'Diabari', latitude: 23.8887, longitude: 90.3789, district: 'Dhaka', thana: 'Turag', isHub: true, source: 'Hub' },
    { displayName: 'কামারপাড়া বাস স্ট্যান্ড ও তুরাগ নদী, ঢাকা', nameBn: 'কামারপাড়া', nameEn: 'Kamarpara', latitude: 23.8892, longitude: 90.3925, district: 'Dhaka', thana: 'Turag', isHub: true, source: 'Hub' },
    { displayName: 'মোহাম্মদপুর কেন্দ্রীয় বাস স্ট্যান্ড, ঢাকা', nameBn: 'মোহাম্মদপুর', nameEn: 'Mohammadpur', latitude: 23.7578, longitude: 90.3603, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'টাউন হল বাজার ও কাঁচাবাজার, মোহাম্মদপুর, ঢাকা', nameBn: 'টাউন হল', nameEn: 'Town Hall', latitude: 23.7612, longitude: 90.3638, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'শিয়া মসজিদ মোড় ও রিং রোড, মোহাম্মদপুর, ঢাকা', nameBn: 'শিয়া মসজিদ', nameEn: 'Shia Mosque', latitude: 23.7672, longitude: 90.3585, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'তাজমহল রোড মোড় ও মাঠ, মোহাম্মদপুর, ঢাকা', nameBn: 'তাজমহল রোড', nameEn: 'Tajmahal Road', latitude: 23.7645, longitude: 90.3612, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'নূরজাহান রোড মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'নূরজাহান রোড', nameEn: 'Noorjahan Road', latitude: 23.7628, longitude: 90.3645, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'বাবর রোড ও শহীদ সোহরাওয়ার্দী হাসপাতাল রোড, ঢাকা', nameBn: 'বাবর রোড', nameEn: 'Babar Road', latitude: 23.7635, longitude: 90.3689, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'হুমায়ুন রোড মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'হুমায়ুন রোড', nameEn: 'Humayun Road', latitude: 23.7621, longitude: 90.3712, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'আসাদগেট মোড় ও সেন্ট জোসেফ স্কুল, ঢাকা', nameBn: 'আসাদগেট', nameEn: 'Asad Gate', latitude: 23.7592, longitude: 90.3725, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'রিং রোড ও প্রিমিয়ার স্কয়ার মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'রিং রোড', nameEn: 'Ring Road', latitude: 23.7705, longitude: 90.3621, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'জাপান গার্ডেন সিটি গেট, রিং রোড, ঢাকা', nameBn: 'জাপান গার্ডেন সিটি', nameEn: 'Japan Garden City', latitude: 23.7718, longitude: 90.3598, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'পিসিকালচার হাউজিং সোসাইটি, মোহাম্মদপুর, ঢাকা', nameBn: 'পিসিকালচার হাউজিং', nameEn: 'PC Culture Housing', latitude: 23.7689, longitude: 90.3562, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'শেখেরটেক মোড় (১ থেকে ৮ নং রোড), আদাবর, ঢাকা', nameBn: 'শেখেরটেক', nameEn: 'Shekhertek', latitude: 23.7735, longitude: 90.3542, district: 'Dhaka', thana: 'Adabor', isHub: true, source: 'Hub' },
    { displayName: 'আদাবর বায়তুল আমান হাউজিং ও থানা মোড়, ঢাকা', nameBn: 'আদাবর', nameEn: 'Adabor', latitude: 23.7762, longitude: 90.3568, district: 'Dhaka', thana: 'Adabor', isHub: true, source: 'Hub' },
    { displayName: 'মনসুরাবাদ হাউজিং মোড়, আদাবর, ঢাকা', nameBn: 'মনসুরাবাদ', nameEn: 'Mansurabad', latitude: 23.7721, longitude: 90.3498, district: 'Dhaka', thana: 'Adabor', isHub: true, source: 'Hub' },
    { displayName: 'বসিলা ব্রিজ মোড় ও বাস স্ট্যান্ড, মোহাম্মদপুর, ঢাকা', nameBn: 'বসিলা', nameEn: 'Bosila', latitude: 23.7521, longitude: 90.3421, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'বসিলা ফিউচার টাউন ও গার্ডেন সিটি, ঢাকা', nameBn: 'বসিলা গার্ডেন সিটি', nameEn: 'Bosila Garden City', latitude: 23.7485, longitude: 90.3385, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'ঢাকা উদ্যান প্রধান গেট ও বাস স্ট্যান্ড, মোহাম্মদপুর, ঢাকা', nameBn: 'ঢাকা উদ্যান', nameEn: 'Dhaka Uddyan', latitude: 23.7625, longitude: 90.3478, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'চন্দ্রিমা মডেল টাউন গেট, মোহাম্মদপুর, ঢাকা', nameBn: 'চন্দ্রিমা মডেল টাউন', nameEn: 'Chandrima Model Town', latitude: 23.7658, longitude: 90.3452, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'চাঁদ উদ্যান হাউজিং মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'চাঁদ উদ্যান', nameEn: 'Chand Uddyan', latitude: 23.7595, longitude: 90.3492, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'নবোদয় হাউজিং মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'নবোদয় হাউজিং', nameEn: 'Naboday Housing', latitude: 23.7682, longitude: 90.3521, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'জেনেভা ক্যাম্প ও বাবর রোড মোড়, মোহাম্মদপুর, ঢাকা', nameBn: 'জেনেভা ক্যাম্প', nameEn: 'Geneva Camp', latitude: 23.7605, longitude: 90.3652, district: 'Dhaka', thana: 'Mohammadpur', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ২৭ (সোবহানবাগ ও রাপা প্লাজা), ঢাকা', nameBn: 'ধানমন্ডি ২৭', nameEn: 'Dhanmondi 27', latitude: 23.7534, longitude: 90.3768, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ৩২ (রাসেল স্কয়ার মোড়), ঢাকা', nameBn: 'ধানমন্ডি ৩২', nameEn: 'Dhanmondi 32', latitude: 23.7516, longitude: 90.3792, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ১৫ (স্টাফ কোয়ার্টার ও ৮/এ রোড), ঢাকা', nameBn: 'ধানমন্ডি ১৫', nameEn: 'Dhanmondi 15', latitude: 23.7505, longitude: 90.3654, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ২ (সীমান্ত স্কয়ার ও রাইফেলস স্কয়ার), ঢাকা', nameBn: 'ধানমন্ডি ২', nameEn: 'Dhanmondi 2', latitude: 23.7415, longitude: 90.3789, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ৪ (ল্যাবএইড হাসপাতাল ও সায়েন্স ল্যাব), ঢাকা', nameBn: 'ধানমন্ডি ৪', nameEn: 'Dhanmondi 4', latitude: 23.7445, longitude: 90.3785, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ৮/এ ব্রিজ মোড় ও আনোয়ার খান মডার্ন, ঢাকা', nameBn: 'ধানমন্ডি ৮/এ', nameEn: 'Dhanmondi 8/A', latitude: 23.7512, longitude: 90.3735, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি লেক ও রবীন্দ্র সরোবর মুক্তমঞ্চ, ঢাকা', nameBn: 'ধানমন্ডি লেক', nameEn: 'Dhanmondi Lake', latitude: 23.7482, longitude: 90.3775, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'শংকর বাস স্ট্যান্ড ও প্লাজা মোড়, ধানমন্ডি, ঢাকা', nameBn: 'শংকর', nameEn: 'Shankar', latitude: 23.7512, longitude: 90.3645, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'রায়েরবাজার বধ্যভূমি স্মৃতিসৌধ ও সাদেক খান মোড়, ঢাকা', nameBn: 'রায়েরবাজার', nameEn: 'Rayerbazar', latitude: 23.7485, longitude: 90.3582, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'ঝিগাতলা বাস স্ট্যান্ড ও চামড়ার মোড়, ঢাকা', nameBn: 'ঝিগাতলা', nameEn: 'Jhigatola', latitude: 23.7428, longitude: 90.3732, district: 'Dhaka', thana: 'Hazaribagh', isHub: true, source: 'Hub' },
    { displayName: 'কলাবাগান বাস স্ট্যান্ড ও মাঠ, ঢাকা', nameBn: 'কলাবাগান', nameEn: 'Kalabagan', latitude: 23.7492, longitude: 90.3812, district: 'Dhaka', thana: 'Kalabagan', isHub: true, source: 'Hub' },
    { displayName: 'শুক্রাবাদ মোড় (মেট্রো শপিং মল সংলগ্ন), ঢাকা', nameBn: 'শুক্রাবাদ', nameEn: 'Shukrabad', latitude: 23.7538, longitude: 90.3805, district: 'Dhaka', thana: 'Kalabagan', isHub: true, source: 'Hub' },
    { displayName: 'সোবহanবাগ মসজিদ ও ড্যাফোডিল বিশ্ববিদ্যালয় মোড়, ঢাকা', nameBn: 'সোবহানবাগ', nameEn: 'Sobhanbagh', latitude: 23.7548, longitude: 90.3775, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'সায়েন্স ল্যাব মোড় ও ঢাকা সিটি কলেজ, ঢাকা', nameBn: 'সায়েন্স ল্যাব', nameEn: 'Science Lab', latitude: 23.7397, longitude: 90.3831, district: 'Dhaka', thana: 'New Market', isHub: true, source: 'Hub' },
    { displayName: 'নিউ মার্কেট ও চন্দ্রিমা সুপার মার্কেট বাস স্ট্যান্ড, ঢাকা', nameBn: 'নিউ মার্কেট', nameEn: 'New Market', latitude: 23.7335, longitude: 90.3845, district: 'Dhaka', thana: 'New Market', isHub: true, source: 'Hub' },
    { displayName: 'নীলক্ষেত বই বাজার ও ঢাকা বিশ্ববিদ্যালয় গেট, ঢাকা', nameBn: 'নীলক্ষেত', nameEn: 'Nilkhet', latitude: 23.7328, longitude: 90.3882, district: 'Dhaka', thana: 'New Market', isHub: true, source: 'Hub' },
    { displayName: 'কাঁটাবন মোড় ও মসজিদ মার্কেট, ঢাকা', nameBn: 'কাঁটাবন', nameEn: 'Katabon', latitude: 23.7378, longitude: 90.3905, district: 'Dhaka', thana: 'New Market', isHub: true, source: 'Hub' },
    { displayName: 'পান্থপথ সিগন্যাল ও বসুন্ধরা সিটি শপিং মল, ঢাকা', nameBn: 'পান্থপথ', nameEn: 'Panthapath', latitude: 23.7512, longitude: 90.3895, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'গ্রিন রোড ও সেন্ট্রাল হাসপাতাল মোড়, ঢাকা', nameBn: 'গ্রিন রোড', nameEn: 'Green Road', latitude: 23.7475, longitude: 90.3862, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'হাতিরপুল কাঁচাবাজার ও মোতালেব প্লাজা, ঢাকা', nameBn: 'হাতিরপুল', nameEn: 'Hatirpool', latitude: 23.7435, longitude: 90.3915, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'এলিফ্যান্ট রোড বাটা সিগন্যাল মোড়, ঢাকা', nameBn: 'এলিফ্যান্ট রোড', nameEn: 'Elephant Road', latitude: 23.7392, longitude: 90.3885, district: 'Dhaka', thana: 'New Market', isHub: true, source: 'Hub' },
    { displayName: 'আজিমপুর বাস স্ট্যান্ড ও এতিমখানা মোড়, ঢাকা', nameBn: 'আজিমপুর', nameEn: 'Azimpur', latitude: 23.7275, longitude: 90.3871, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'গুলশান ১ গোলচত্বর ও পুলিশ প্লাজা, ঢাকা', nameBn: 'গুলশান ১', nameEn: 'Gulshan 1', latitude: 23.7785, longitude: 90.4178, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'গুলশান ২ গোলচত্বর ও ডিপ্লোমেটিক জোন, ঢাকা', nameBn: 'গুলশান ২', nameEn: 'Gulshan 2', latitude: 23.7949, longitude: 90.4143, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'পুলিশ প্লাজা কনকর্ড ও গুলশান শুটিং ক্লাব, ঢাকা', nameBn: 'পুলিশ প্লাজা কনকর্ড', nameEn: 'Police Plaza Concord', latitude: 23.7732, longitude: 90.4158, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'নিকেতন আবাসিক এলাকা গেট ১ ও ২, গুলশান, ঢাকা', nameBn: 'নিকেতন', nameEn: 'Niketan', latitude: 23.7752, longitude: 90.4112, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'বনানী গোলচত্বর (১১ নং রোড ও কামাল আতাতুর্ক), ঢাকা', nameBn: 'বনানী', nameEn: 'Banani', latitude: 23.7937, longitude: 90.4043, district: 'Dhaka', thana: 'Banani', isHub: true, source: 'Hub' },
    { displayName: 'বনানী কাকলী বাস স্ট্যান্ড ও এয়ারপোর্ট রোড, ঢাকা', nameBn: 'বনানী কাকলী', nameEn: 'Banani Kakoli', latitude: 23.7918, longitude: 90.4005, district: 'Dhaka', thana: 'Banani', isHub: true, source: 'Hub' },
    { displayName: 'বনানী ডিওএইচএস প্রধান গেট, ঢাকা', nameBn: 'বনানী ডিওএইচএস', nameEn: 'Banani DOHS', latitude: 23.7972, longitude: 90.3978, district: 'Dhaka', thana: 'Banani', isHub: true, source: 'Hub' },
    { displayName: 'মহাখালী আন্তঃজেলা বাস টার্মিনাল ও ফ্লাইওভার, ঢাকা', nameBn: 'মহাখালী', nameEn: 'Mohakhali', latitude: 23.7778, longitude: 90.4005, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { displayName: 'মহাখালী আমতলী মোড় ও ব্র্যাক সেন্টার, ঢাকা', nameBn: 'মহাখালী আমতলী', nameEn: 'Mohakhali Amtoli', latitude: 23.7765, longitude: 90.4028, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { displayName: 'মহাখালী রেলগেট ও রাওয়া ক্লাব মোড়, ঢাকা', nameBn: 'মহাখালী রেলগেট', nameEn: 'Mohakhali Railgate', latitude: 23.7792, longitude: 90.4018, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { displayName: 'মহাখালী ডিওএইচএস গেট ও কাঁচাবাজার, ঢাকা', nameBn: 'মহাখালী ডিওএইচএস', nameEn: 'Mohakhali DOHS', latitude: 23.7845, longitude: 90.3921, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { displayName: 'বারিধারা ডিপ্লোমেটিক জোন ও দূতাবাস এলাকা, ঢাকা', nameBn: 'বারিধারা ডিপ্লোমেটিক', nameEn: 'Baridhara Diplomatic', latitude: 23.7995, longitude: 90.4215, district: 'Dhaka', thana: 'Baridhara', isHub: true, source: 'Hub' },
    { displayName: 'বারিধারা ডিওএইচএস গেট ও আননূর মসজিদ, ঢাকা', nameBn: 'বারিধারা ডিওএইচএস', nameEn: 'Baridhara DOHS', latitude: 23.8115, longitude: 90.4128, district: 'Dhaka', thana: 'Baridhara', isHub: true, source: 'Hub' },
    { displayName: 'কালাচাঁদপুর মোড় ও গুলশান লেকপার্ক লিংক, ঢাকা', nameBn: 'কালাচাঁদপুর', nameEn: 'Kalachandpur', latitude: 23.8042, longitude: 90.4205, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'নদ্দা বাস স্ট্যান্ড ও প্রগতি সরণী মোড়, ঢাকা', nameBn: 'নদ্দা', nameEn: 'Norda', latitude: 23.8085, longitude: 90.4235, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'শাহজাদপুর বাস স্ট্যান্ড ও সুবাস্তু শপিং মল, ঢাকা', nameBn: 'শাহজাদপুর', nameEn: 'Shahjadpur', latitude: 23.7905, longitude: 90.4248, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'নতুন বাজার মোড় (১০০ ফিট রাস্তা শুরু), ঢাকা', nameBn: 'নতুন বাজার', nameEn: 'Notun Bazar', latitude: 23.7978, longitude: 90.4242, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'মাদানী এভিনিউ ১০০ ফিট রাস্তা মোড়, ঢাকা', nameBn: 'মাদানী এভিনিউ ১০০ ফিট', nameEn: 'Madani Avenue 100ft', latitude: 23.8005, longitude: 90.4325, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'উত্তর বাড্ডা বাস স্ট্যান্ড ও ফুজি ট্রেড সেন্টার, ঢাকা', nameBn: 'উত্তর বাড্ডা', nameEn: 'Uttar Badda', latitude: 23.7915, longitude: 90.4262, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'মধ্য বাড্ডা মোড় ও বাজার, ঢাকা', nameBn: 'মধ্য বাড্ডা', nameEn: 'Moddhya Badda', latitude: 23.7872, longitude: 90.4265, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'বাড্ডা লিংক রোড (গুলশান ১ সংযোগ), ঢাকা', nameBn: 'বাড্ডা লিংক রোড', nameEn: 'Badda Link Road', latitude: 23.7844, longitude: 90.4267, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'মেরুল বাড্ডা (ব্র্যাক বিশ্ববিদ্যালয় নতুন ক্যাম্পাস), ঢাকা', nameBn: 'মেরুল বাড্ডা', nameEn: 'Merul Badda', latitude: 23.7715, longitude: 90.4251, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'গুদারাঘাট বাড্ডা ও হাতিরঝিল ওয়াটার ট্যাক্সি ঘাট, ঢাকা', nameBn: 'গুদারাঘাট বাড্ডা', nameEn: 'Gudaraghat Badda', latitude: 23.7795, longitude: 90.4242, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'রামপুরা ব্রিজ ও হাতিরঝিল মোড়, ঢাকা', nameBn: 'রামপুরা ব্রিজ', nameEn: 'Rampura Bridge', latitude: 23.7634, longitude: 90.4258, district: 'Dhaka', thana: 'Rampura', isHub: true, source: 'Hub' },
    { displayName: 'রামপুরা বাজার ও টেলিভিশন ভবন মোড়, ঢাকা', nameBn: 'রামপুরা বাজার', nameEn: 'Rampura Bazar', latitude: 23.7592, longitude: 90.4245, district: 'Dhaka', thana: 'Rampura', isHub: true, source: 'Hub' },
    { displayName: 'উলন মোড় ও রামপুরা পাওয়ার গ্রিড, ঢাকা', nameBn: 'উলন', nameEn: 'Ulon', latitude: 23.7612, longitude: 90.4189, district: 'Dhaka', thana: 'Rampura', isHub: true, source: 'Hub' },
    { displayName: 'আফতাবনগর প্রধান গেট ও ইস্ট ওয়েস্ট বিশ্ববিদ্যালয়, ঢাকা', nameBn: 'আফতাবনগর', nameEn: 'Aftabnagar', latitude: 23.7665, longitude: 90.4298, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'আফতাবনগর হাউজিং প্রজেক্ট (ব্লক বি/সি), ঢাকা', nameBn: 'আফতাবনগর হাউজিং', nameEn: 'Aftabnagar Housing', latitude: 23.7698, longitude: 90.4385, district: 'Dhaka', thana: 'Badda', isHub: true, source: 'Hub' },
    { displayName: 'বনশ্রী প্রধান এভিনিউ ও রামপুরা ব্রিজ লিংক, ঢাকা', nameBn: 'বনশ্রী', nameEn: 'Banasree', latitude: 23.7645, longitude: 90.4285, district: 'Dhaka', thana: 'Rampura', isHub: true, source: 'Hub' },
    { displayName: 'বনশ্রী সি ব্লক ও ফরায়েজী হাসপাতাল মোড়, ঢাকা', nameBn: 'বনশ্রী ফরায়েজী হাসপাতাল', nameEn: 'Banasree Farazy Hospital', latitude: 23.7612, longitude: 90.4365, district: 'Dhaka', thana: 'Rampura', isHub: true, source: 'Hub' },
    { displayName: 'দক্ষিণ বনশ্রী বাস স্ট্যান্ড ও মেরাদিয়া বাজার, ঢাকা', nameBn: 'দক্ষিণ বনশ্রী', nameEn: 'Dakshin Banasree', latitude: 23.7523, longitude: 90.4402, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'খিলগাঁও তালতলা সুপার মার্কেট মোড়, ঢাকা', nameBn: 'খিলগাঁও তালতলা', nameEn: 'Khilgaon Taltola', latitude: 23.7538, longitude: 90.4228, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'খিলগাঁও ফ্লাইওভার ও পুলিশ ফাঁড়ি মোড়, ঢাকা', nameBn: 'খিলগাঁও ফ্লাইওভার', nameEn: 'Khilgaon Flyover', latitude: 23.7485, longitude: 90.4221, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'খিলগাঁও তিলপাপাড়া মোড়, ঢাকা', nameBn: 'খিলগাঁও তিলপাপাড়া', nameEn: 'Khilgaon Tilpapara', latitude: 23.7505, longitude: 90.4278, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'খিলগাঁও গোড়ান বাজার ও শান্তিপুর মোড়, ঢাকা', nameBn: 'খিলগাঁও গোড়ান', nameEn: 'Khilgaon Goran', latitude: 23.7545, longitude: 90.4352, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'বাসাবো গোলচত্বর ও বৌদ্ধ মন্দির মোড়, ঢাকা', nameBn: 'বাসাবো', nameEn: 'Basabo', latitude: 23.7421, longitude: 90.4305, district: 'Dhaka', thana: 'Sabujbagh', isHub: true, source: 'Hub' },
    { displayName: 'মাদারটেক বাজার ও চৌরাস্তা, ঢাকা', nameBn: 'মাদারটেক', nameEn: 'Madartek', latitude: 23.7385, longitude: 90.4389, district: 'Dhaka', thana: 'Sabujbagh', isHub: true, source: 'Hub' },
    { displayName: 'সিপাহীবাগ বাজার মোড়, খিলগাঁও, ঢাকা', nameBn: 'সিপাহীবাগ', nameEn: 'Sipahibagh', latitude: 23.7562, longitude: 90.4312, district: 'Dhaka', thana: 'Khilgaon', isHub: true, source: 'Hub' },
    { displayName: 'মগবাজার চৌরাস্তা ও ফ্লাইওভার, ঢাকা', nameBn: 'মগবাজার', nameEn: 'Moghbazar', latitude: 23.7485, longitude: 90.4072, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'মগবাজার ওয়্যারলেস মোড় ও মধুবাগ, ঢাকা', nameBn: 'মগবাজার ওয়্যারলেস', nameEn: 'Moghbazar Wireless', latitude: 23.7495, longitude: 90.4105, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'দিলু রোড ও নিউ ইস্কাটন রোড, ঢাকা', nameBn: 'দিলু রোড', nameEn: 'Dilu Road', latitude: 23.7462, longitude: 90.4021, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'বাংলামটর মোড় ও বিআইডব্লিউটিএ ভবন, ঢাকা', nameBn: 'বাংলামটর', nameEn: 'Banglamotor', latitude: 23.7461, longitude: 90.3954, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'মৌচাক মোড় ও মার্কেট, ঢাকা', nameBn: 'মৌচাক', nameEn: 'Mouchak', latitude: 23.7462, longitude: 90.4138, district: 'Dhaka', thana: 'Malibagh', isHub: true, source: 'Hub' },
    { displayName: 'মালিবাগ মোড় ও আবুজর গিফারী কলেজ, ঢাকা', nameBn: 'মালিবাগ', nameEn: 'Malibagh', latitude: 23.7468, longitude: 90.4158, district: 'Dhaka', thana: 'Malibagh', isHub: true, source: 'Hub' },
    { displayName: 'মালিবাগ রেলগেট ও বাজার, ঢাকা', nameBn: 'মালিবাগ রেলগেট', nameEn: 'Malibagh Railgate', latitude: 23.7511, longitude: 90.4182, district: 'Dhaka', thana: 'Malibagh', isHub: true, source: 'Hub' },
    { displayName: 'মালিবাগ চৌধুরীপাড়া মাটির মসজিদ মোড়, ঢাকা', nameBn: 'মালিবাগ চৌধুরীপাড়া', nameEn: 'Malibagh Chowdhury Para', latitude: 23.7568, longitude: 90.4195, district: 'Dhaka', thana: 'Malibagh', isHub: true, source: 'Hub' },
    { displayName: 'শান্তিনগর মোড় ও টুইন টাওয়ার কনকর্ড, ঢাকা', nameBn: 'শান্তিনগর', nameEn: 'Shantinagar', latitude: 23.7412, longitude: 90.4152, district: 'Dhaka', thana: 'Paltan', isHub: true, source: 'Hub' },
    { displayName: 'বেইলি রোড (অফিসার্স ক্লাব ও নাটক সরণী), ঢাকা', nameBn: 'বেইলি রোড', nameEn: 'Bailey Road', latitude: 23.7418, longitude: 90.4085, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'কাকরাইল মোড় ও রাজমনি ঈশা খাঁ মোড়, ঢাকা', nameBn: 'কাকরাইল', nameEn: 'Kakrail', latitude: 23.7389, longitude: 90.4105, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'বিজয়নগর পানির ট্যাংক মোড় ও হোটেল ৭১, ঢাকা', nameBn: 'বিজয়নগর', nameEn: 'Bijoynagar', latitude: 23.7348, longitude: 90.4132, district: 'Dhaka', thana: 'Paltan', isHub: true, source: 'Hub' },
    { displayName: 'পল্টন মোড় ও বায়তুল মোকাররম উত্তর গেট, ঢাকা', nameBn: 'পল্টন', nameEn: 'Paltan', latitude: 23.7312, longitude: 90.4121, district: 'Dhaka', thana: 'Paltan', isHub: true, source: 'Hub' },
    { displayName: 'জাতীয় প্রেস ক্লাব ও তোপখানা রোড, ঢাকা', nameBn: 'জাতীয় প্রেস ক্লাব', nameEn: 'National Press Club', latitude: 23.7298, longitude: 90.4075, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'সেগুনবাগিচা (শিল্পকলা একাডেমি ও এনবিআর), ঢাকা', nameBn: 'সেগুনবাগিচা', nameEn: 'Segunbagicha', latitude: 23.7335, longitude: 90.4055, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'দৈনিক বাংলা মোড় (মতিঝিল উত্তর গেট), ঢাকা', nameBn: 'দৈনিক বাংলা', nameEn: 'Dainik Bangla', latitude: 23.7298, longitude: 90.4158, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'ফকিরাপুল মোড় ও কালভার্ট রোড, ঢাকা', nameBn: 'ফকিরাপুল', nameEn: 'Fakirapool', latitude: 23.7328, longitude: 90.4185, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'আরামবাগ বাস টার্মিনাল ও নটর ডেম কলেজ, ঢাকা', nameBn: 'আরামবাগ', nameEn: 'Arambagh', latitude: 23.7315, longitude: 90.4212, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'মতিঝিল শাপলা চত্বর ও মেট্রো স্টেশন, ঢাকা', nameBn: 'মতিঝিল', nameEn: 'Motijheel', latitude: 23.7289, longitude: 90.4182, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'দিলকুশা বাণিজ্যিক এলাকা ও সাধারণ বীমা মোড়, ঢাকা', nameBn: 'দিলকুশা', nameEn: 'Dilkusha', latitude: 23.7275, longitude: 90.4172, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'কমলাপুর কেন্দ্রীয় রেলওয়ে স্টেশন ও আইসিডি, ঢাকা', nameBn: 'কমলাপুর রেলওয়ে স্টেশন', nameEn: 'Kamalapur Railway Station', latitude: 23.7314, longitude: 90.4255, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'টিটিপাড়া বাস স্ট্যান্ড ও সায়েদাবাদ ফ্লাইওভার লিংক, ঢাকা', nameBn: 'টিটিপাড়া', nameEn: 'TT Para', latitude: 23.7285, longitude: 90.4292, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'মুগদা মেডিকেল কলেজ ও হাসপাতাল মোড়, ঢাকা', nameBn: 'মুগদা', nameEn: 'Mugda', latitude: 23.7312, longitude: 90.4325, district: 'Dhaka', thana: 'Mugda', isHub: true, source: 'Hub' },
    { displayName: 'মানিকনগর বিশ্বরোড মোড়, ঢাকা', nameBn: 'মানিকনগর', nameEn: 'Maniknagar', latitude: 23.7258, longitude: 90.4298, district: 'Dhaka', thana: 'Mugda', isHub: true, source: 'Hub' },
    { displayName: 'গোপীবাগ মোড় ও ব্রাদার্স ইউনিয়ন মাঠ, ঢাকা', nameBn: 'গোপীবাগ', nameEn: 'Gopibagh', latitude: 23.7245, longitude: 90.4245, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'ওয়ারী (র‍্যাংকিন স্ট্রিট ও খাজা দেওয়ান), ঢাকা', nameBn: 'ওয়ারী', nameEn: 'Wari', latitude: 23.7185, longitude: 90.4195, district: 'Dhaka', thana: 'Wari', isHub: true, source: 'Hub' },
    { displayName: 'টিকাটুলি মোড় ও রাজধানী সুপার মার্কেট, ঢাকা', nameBn: 'টিকাটুলি', nameEn: 'Tikatuli', latitude: 23.7212, longitude: 90.4225, district: 'Dhaka', thana: 'Wari', isHub: true, source: 'Hub' },
    { displayName: 'ইত্তেফাক মোড় ও আরকে মিশন রোড, ঢাকা', nameBn: 'ইত্তেফাক মোড়', nameEn: 'Ittefaq Mor', latitude: 23.7218, longitude: 90.4202, district: 'Dhaka', thana: 'Wari', isHub: true, source: 'Hub' },
    { displayName: 'গুলিস্তান জিরো পয়েন্ট ও ফুলবাড়িয়া বাস টার্মিনাল, ঢাকা', nameBn: 'গুলিস্তান', nameEn: 'Gulistan', latitude: 23.7258, longitude: 90.4115, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'সদরঘাট কেন্দ্রীয় লঞ্চ টার্মিনাল ও বুড়িগঙ্গা ঘাট, ঢাকা', nameBn: 'সদরঘাট', nameEn: 'Sadarghat', latitude: 23.7058, longitude: 90.4112, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'জগন্নাথ বিশ্ববিদ্যালয় প্রধান গেট ও বাহাদুর শাহ পার্ক, ঢাকা', nameBn: 'জগন্নাথ বিশ্ববিদ্যালয়', nameEn: 'Jagannath University', latitude: 23.7092, longitude: 90.4125, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'ভিক্টোরিয়া পার্ক (বাহাদুর শাহ পার্ক মোড়), ঢাকা', nameBn: 'ভিক্টোরিয়া পার্ক', nameEn: 'Victoria Park', latitude: 23.7098, longitude: 90.4132, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বাবুবাজার ব্রিজ মোড় ও বাদামতলী চালের আড়ৎ, ঢাকা', nameBn: 'বাবুবাজার', nameEn: 'Babubazar', latitude: 23.7118, longitude: 90.4042, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'নয়াবাজার মোড় ও কাগজের মার্কেট, ঢাকা', nameBn: 'নয়াবাজার', nameEn: 'Nayabazar', latitude: 23.7152, longitude: 90.4082, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'তাঁতীবাজার স্বর্ণের মার্কেট মোড়, পুরান ঢাকা', nameBn: 'তাঁতীবাজার', nameEn: 'Tantibazar', latitude: 23.7125, longitude: 90.4072, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'শাঁখারীবাজার ঐতিহ্যবাহী গলি মোড়, পুরান ঢাকা', nameBn: 'শাঁখারীবাজার', nameEn: 'Shakhari Bazar', latitude: 23.7112, longitude: 90.4115, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'ইসলামপুর পাইকারি কাপড়ের মার্কেট, পুরান ঢাকা', nameBn: 'ইসলামপুর', nameEn: 'Islampur', latitude: 23.7085, longitude: 90.4095, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'পাটুয়াটুলী চশমা ও ইলেকট্রনিক্স মার্কেট, ঢাকা', nameBn: 'পাটুয়াটুলী', nameEn: 'Patuatuli', latitude: 23.7095, longitude: 90.4118, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'স্যার সলিমুল্লাহ মেডিকেল কলেজ ও মিটফোর্ড হাসপাতাল, ঢাকা', nameBn: 'মিটফোর্ড হাসপাতাল', nameEn: 'Mitford Hospital', latitude: 23.7112, longitude: 90.4018, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'লালবাগ কেল্লা ও চৌরাস্তা মোড়, পুরান ঢাকা', nameBn: 'লালবাগ কেল্লা', nameEn: 'Lalbagh Fort', latitude: 23.7198, longitude: 90.3882, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'চকবাজার শাহী মসজিদ ও ইফতার বাজার মোড়, পুরান ঢাকা', nameBn: 'চকবাজার', nameEn: 'Chawkbazar', latitude: 23.7172, longitude: 90.3985, district: 'Dhaka', thana: 'Chawkbazar', isHub: true, source: 'Hub' },
    { displayName: 'চক মোগলটুলী ও কাঁচাবাজার, পুরান ঢাকা', nameBn: 'মোগলটুলী', nameEn: 'Moghaltuli', latitude: 23.7155, longitude: 90.4012, district: 'Dhaka', thana: 'Chawkbazar', isHub: true, source: 'Hub' },
    { displayName: 'বংশাল মোড় ও সাইকেল মার্কেট, পুরান ঢাকা', nameBn: 'বংশাল', nameEn: 'Bangshal', latitude: 23.7185, longitude: 90.4065, district: 'Dhaka', thana: 'Bangshal', isHub: true, source: 'Hub' },
    { displayName: 'আরমানিটোলা তারা মসজিদ মোড়, পুরান ঢাকা', nameBn: 'আরমানিটোলা', nameEn: 'Armanitola', latitude: 23.7162, longitude: 90.4035, district: 'Dhaka', thana: 'Armanitola', isHub: true, source: 'Hub' },
    { displayName: 'নারিন্দা মোড় ও মশুরীখোলা দরবার শরীফ, ঢাকা', nameBn: 'নারিন্দা', nameEn: 'Narinda', latitude: 23.7128, longitude: 90.4195, district: 'Dhaka', thana: 'Sutrapur', isHub: true, source: 'Hub' },
    { displayName: 'ধোলাইখাল অটোমোবাইল পার্টস মার্কেট মোড়, ঢাকা', nameBn: 'ধোলাইখাল', nameEn: 'Dholaikhal', latitude: 23.7105, longitude: 90.4198, district: 'Dhaka', thana: 'Sutrapur', isHub: true, source: 'Hub' },
    { displayName: 'সূত্রাপুর থানা ও লোহারপুল বাজার, পুরান ঢাকা', nameBn: 'সূত্রাপুর', nameEn: 'Sutrapur', latitude: 23.7082, longitude: 90.4182, district: 'Dhaka', thana: 'Sutrapur', isHub: true, source: 'Hub' },
    { displayName: 'শ্যামবাজার পাইকারি ফলের ও সবজির আড়ৎ, ঢাকা', nameBn: 'শ্যামবাজার', nameEn: 'Shyambazar', latitude: 23.7045, longitude: 90.4145, district: 'Dhaka', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'শাহবাগ মোড় ও বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU), ঢাকা', nameBn: 'শাহবাগ', nameEn: 'Shahbagh', latitude: 23.7383, longitude: 90.3957, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'ঢাকা মেডিকেল কলেজ হাসপাতাল (DMCH) জরুরি বিভাগ, ঢাকা', nameBn: 'ঢাকা মেডিকেল', nameEn: 'Dhaka Medical', latitude: 23.7262, longitude: 90.3978, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'টিএসসি ও ঢাকা বিশ্ববিদ্যালয় ছাত্র শিক্ষক কেন্দ্র, ঢাকা', nameBn: 'টিএসসি', nameEn: 'TSC', latitude: 23.7325, longitude: 90.3962, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'কার্জন হল ও শহীদুল্লাহ হল মোড় (ঢাবি), ঢাকা', nameBn: 'কার্জন হল', nameEn: 'Curzon Hall', latitude: 23.7275, longitude: 90.4025, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'কেন্দ্রীয় শহীদ মিনার চত্বর, ঢাকা বিশ্ববিদ্যালয়', nameBn: 'কেন্দ্রীয় শহীদ মিনার', nameEn: 'Central Shaheed Minar', latitude: 23.7272, longitude: 90.3982, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'পলাশী মোড় ও বুয়েট দক্ষিণ গেট, ঢাকা', nameBn: 'পলাশী', nameEn: 'Palashi', latitude: 23.7265, longitude: 90.3912, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'বুয়েট মেইন ক্যাম্পাস ও ক্যাফেটেরিয়া মোড়, ঢাকা', nameBn: 'বুয়েট', nameEn: 'BUET', latitude: 23.7272, longitude: 90.3925, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'বকশীবাজার মোড় ও আলিয়া মাদ্রাসা, ঢাকা', nameBn: 'বকশীবাজার', nameEn: 'Bakshibazar', latitude: 23.7235, longitude: 90.3952, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'চাঁনখারপুল মোড় ও জাতীয় বার্ন ইনস্টিটিউট, ঢাকা', nameBn: 'চাঁনখারপুল', nameEn: 'Chankharpul', latitude: 23.7238, longitude: 90.3995, district: 'Dhaka', thana: 'Lalbagh', isHub: true, source: 'Hub' },
    { displayName: 'রমনা পার্ক ও ইঞ্জিনিয়ারিং ইনস্টিটিউট গেট, ঢাকা', nameBn: 'রমনা পার্ক', nameEn: 'Ramna Park', latitude: 23.7375, longitude: 90.4012, district: 'Dhaka', thana: 'Ramna', isHub: true, source: 'Hub' },
    { displayName: 'কারওয়ান বাজার সার্ক ফোয়ারা ও পেট্রোবাংলা মোড়, ঢাকা', nameBn: 'কারওয়ান বাজার', nameEn: 'Karwan Bazar', latitude: 23.7505, longitude: 90.3934, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'প্যান প্যাসিফিক সোনারগাঁও হোটেল মোড়, ঢাকা', nameBn: 'সোনারগাঁও হোটেল', nameEn: 'Pan Pacific Sonargaon', latitude: 23.7485, longitude: 90.3942, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'ফার্মগেট মোড় ও আনন্দ সিনেমা হল, ঢাকা', nameBn: 'ফার্মগেট', nameEn: 'Farmgate', latitude: 23.7561, longitude: 90.3872, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'খামারবাড়ি গোলচত্বর ও কৃষিবিদ ইনস্টিটিউশন, ঢাকা', nameBn: 'খামারবাড়ি', nameEn: 'Khamarbari', latitude: 23.7578, longitude: 90.3832, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'আগারগাঁও মেট্রো স্টেশন ও পাসপোর্ট অফিস, ঢাকা', nameBn: 'আগারগাঁও', nameEn: 'Agargaon', latitude: 23.7781, longitude: 90.3798, district: 'Dhaka', thana: 'Sher-e-Bangla Nagar', isHub: true, source: 'Hub' },
    { displayName: 'তেজগাঁও সাতরাস্তা ফ্লাইওভার মোড়, ঢাকা', nameBn: 'তেজগাঁও সাতরাস্তা', nameEn: 'Tejgaon Satrasta', latitude: 23.7612, longitude: 90.3985, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'নাবিস্কো মোড় ও শহীদ তাজউদ্দীন রোড, তেজগাঁও, ঢাকা', nameBn: 'নাবিস্কো', nameEn: 'Nabisco', latitude: 23.7685, longitude: 90.4012, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'তিব্বত মোড়, তেজগাঁও শিল্প এলাকা, ঢাকা', nameBn: 'তিব্বত', nameEn: 'Tibet', latitude: 23.7645, longitude: 90.4005, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'তেজকুনিপাড়া বিজয় সরণী লিংক রোড, ঢাকা', nameBn: 'তেজকুনিপাড়া', nameEn: 'Tejkunipara', latitude: 23.7578, longitude: 90.3912, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'নাখালপাড়া মোড় ও লুকাস মোড়, তেজগাঁও, ঢাকা', nameBn: 'নাখালপাড়া', nameEn: 'Nakhalpara', latitude: 23.7652, longitude: 90.3935, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'শাহীনবাগ বিমান বাহিনী জাদুঘর সংলগ্ন মোড়, ঢাকা', nameBn: 'শাহীনবাগ', nameEn: 'Shaheenbagh', latitude: 23.7715, longitude: 90.3921, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'বিজয় সরণী মোড় ও সামরিক জাদুঘর, ঢাকা', nameBn: 'বিজয় সরণী', nameEn: 'Bijoy Sarani', latitude: 23.7625, longitude: 90.3865, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'জাহাঙ্গীর গেট ও ক্যান্টনমেন্ট প্রবেশদ্বার, ঢাকা', nameBn: 'জাহাঙ্গীর গেট', nameEn: 'Jahangir Gate', latitude: 23.7735, longitude: 90.3895, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'ঢাকা সেনানিবাস সিএমএইচ হাসপাতাল ও চত্বর, ঢাকা', nameBn: 'সিএমএইচ ক্যান্টনমেন্ট', nameEn: 'CMH Cantonment', latitude: 23.8185, longitude: 90.4012, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'ইসিবি চত্বর (ক্যান্টনমেন্ট ও মিরপুর ফ্লাইওভার মোড়), ঢাকা', nameBn: 'ইসিবি চত্বর', nameEn: 'ECB Chattar', latitude: 23.8236, longitude: 90.3912, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'মাটিকাটা মোড় ও মানিকদী রোড, ক্যান্টনমেন্ট, ঢাকা', nameBn: 'মাটিকাটা', nameEn: 'Matikata', latitude: 23.8265, longitude: 90.3932, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'ভাসানটেক বাজার ও পুনর্বাসন মোড়, ঢাকা', nameBn: 'ভাসানটেক', nameEn: 'Bhasantek', latitude: 23.8152, longitude: 90.3885, district: 'Dhaka', thana: 'Cantonment', isHub: true, source: 'Hub' },
    { displayName: 'কুড়িল বিশ্বরোড ও ৩০০ ফিট এক্সপ্রেসওয়ে মোড়, ঢাকা', nameBn: 'কুড়িল বিশ্বরোড', nameEn: 'Kuril Bishwa Road', latitude: 23.8164, longitude: 90.4208, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'কুড়াতলী মোড় ও আমেরিকান ইন্টারন্যাশনাল বিশ্ববিদ্যালয় (AIUB), ঢাকা', nameBn: 'কুড়াতলী', nameEn: 'Kuratoli', latitude: 23.8215, longitude: 90.4235, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'বসুন্ধরা আবাসিক এলাকা প্রধান গেট ও এভারকেয়ার রোড, ঢাকা', nameBn: 'বসুন্ধরা', nameEn: 'Bashundhara', latitude: 23.8138, longitude: 90.4248, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'নর্থ সাউথ বিশ্ববিদ্যালয় (NSU) ও আইইউবি গেট, বসুন্ধরা, ঢাকা', nameBn: 'নর্থ সাউথ বিশ্ববিদ্যালয়', nameEn: 'North South University', latitude: 23.8152, longitude: 90.4275, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'এভারকেয়ার হাসপাতাল (অ্যাপোলো গেট), বসুন্ধরা, ঢাকা', nameBn: 'এভারকেয়ার হাসপাতাল', nameEn: 'Evercare Hospital', latitude: 23.8105, longitude: 90.4318, district: 'Dhaka', thana: 'Vatara', isHub: true, source: 'Hub' },
    { displayName: 'ইন্টারন্যাশনাল কনভেনশন সিটি বসুন্ধরা (ICCB), ঢাকা', nameBn: 'আইসিসিবি', nameEn: 'ICCB', latitude: 23.8258, longitude: 90.4312, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: '৩০০ ফিট পূর্বাচল এক্সপ্রেসওয়ে মোড়, কুড়িল, ঢাকা', nameBn: '৩০০ ফিট এক্সপ্রেসওয়ে', nameEn: '300 Feet Express Highway', latitude: 23.8242, longitude: 90.4278, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'নীলা মার্কেট ও কাশবনের মাঠ, ৩০০ ফিট পূর্বাচল, ঢাকা', nameBn: 'নীলা মার্কেট ৩০০ ফিট', nameEn: 'Nila Market 300ft', latitude: 23.8345, longitude: 90.4952, district: 'Dhaka', thana: 'Rupganj', isHub: true, source: 'Hub' },
    { displayName: 'বঙ্গবন্ধু বাংলাদেশ-চীন মৈত্রী প্রদর্শনী কেন্দ্র (BBCFEC), পূর্বাচল', nameBn: 'পূর্বাচল বাণিজ্য মেলা', nameEn: 'Purbachal Expo Center', latitude: 23.8365, longitude: 90.5185, district: 'Dhaka', thana: 'Rupganj', isHub: true, source: 'Hub' },
    { displayName: 'খিলক্ষেত বাস স্ট্যান্ড ও ফুটওভার ব্রিজ, ঢাকা', nameBn: 'খিলক্ষেত', nameEn: 'Khilkhet', latitude: 23.8305, longitude: 90.4182, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'নিকুঞ্জ ১ গেট ও ডিএসই টাওয়ার, ঢাকা', nameBn: 'নিকুঞ্জ ১', nameEn: 'Nikunja 1', latitude: 23.8262, longitude: 90.4152, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'নিকুঞ্জ ২ প্রধান গেট ও হোটেল রেডিসন সংলগ্ন, ঢাকা', nameBn: 'নিকুঞ্জ ২', nameEn: 'Nikunja 2', latitude: 23.8285, longitude: 90.4172, district: 'Dhaka', thana: 'Khilkhet', isHub: true, source: 'Hub' },
    { displayName: 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর টার্মিনাল ১ ও ২, ঢাকা', nameBn: 'বিমানবন্দর', nameEn: 'Airport', latitude: 23.8512, longitude: 90.4074, district: 'Dhaka', thana: 'Airport', isHub: true, source: 'Hub' },
    { displayName: 'বিমানবন্দর ৩য় টার্মিনাল ও এক্সপ্রেসওয়ে সংযোগ, ঢাকা', nameBn: 'বিমানবন্দর টার্মিনাল ৩', nameEn: 'Airport Terminal 3', latitude: 23.8445, longitude: 90.4112, district: 'Dhaka', thana: 'Airport', isHub: true, source: 'Hub' },
    { displayName: 'বিমানবন্দর রেলওয়ে স্টেশন ও গোলচত্বর, ঢাকা', nameBn: 'বিমানবন্দর রেলওয়ে স্টেশন', nameEn: 'Airport Railway Station', latitude: 23.8525, longitude: 90.4042, district: 'Dhaka', thana: 'Airport', isHub: true, source: 'Hub' },
    { displayName: 'আশকোনা হজ ক্যাম্প ও কাঁচাবাজার মোড়, ঢাকা', nameBn: 'আশকোনা', nameEn: 'Ashkona', latitude: 23.8562, longitude: 90.4115, district: 'Dhaka', thana: 'Airport', isHub: true, source: 'Hub' },
    { displayName: 'কাওলা বাস স্ট্যান্ড ও এলিভেটেড এক্সপ্রেসওয়ে টোলপ্লাজা, ঢাকা', nameBn: 'কাওলা', nameEn: 'Kawla', latitude: 23.8421, longitude: 90.4135, district: 'Dhaka', thana: 'Airport', isHub: true, source: 'Hub' },
    { displayName: 'দক্ষিণখান বাজার ও থানা মোড়, ঢাকা', nameBn: 'দক্ষিণখান', nameEn: 'Dakshinkhan', latitude: 23.8615, longitude: 90.4285, district: 'Dhaka', thana: 'Dakshinkhan', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরখান মাজার মোড় ও চানপাড়া, ঢাকা', nameBn: 'উত্তরখান', nameEn: 'Uttarkhan', latitude: 23.8745, longitude: 90.4312, district: 'Dhaka', thana: 'Uttarkhan', isHub: true, source: 'Hub' },
    { displayName: 'সায়েদাবাদ কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, ঢাকা', nameBn: 'সায়েদাবাদ', nameEn: 'Sayedabad', latitude: 23.7153, longitude: 90.4286, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'যাত্রাবাড়ী চৌরাস্তা ও মেয়র হানিফ ফ্লাইওভার, ঢাকা', nameBn: 'যাত্রাবাড়ী', nameEn: 'Jatrabari', latitude: 23.7118, longitude: 90.4344, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'কাজলা বাস স্ট্যান্ড ও ডেমরা রোড মোড়, ঢাকা', nameBn: 'কাজলা', nameEn: 'Kajla', latitude: 23.7085, longitude: 90.4412, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'শনির আখড়া বাস স্ট্যান্ড ও ফুটওভার ব্রিজ, ঢাকা', nameBn: 'শনির আখড়া', nameEn: 'Shonir Akhra', latitude: 23.7042, longitude: 90.4498, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'রায়েরবাগ বাস স্ট্যান্ড ও ঢাকা-চট্টগ্রাম মহাসড়ক, ঢাকা', nameBn: 'রায়েরবাগ', nameEn: 'Rayerbagh', latitude: 23.6995, longitude: 90.4572, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'মাতুয়াইল মেডিকেল ও শিশু মাতৃসদন মোড়, ঢাকা', nameBn: 'মাতুয়াইল', nameEn: 'Matuail', latitude: 23.6962, longitude: 90.4665, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' },
    { displayName: 'সাইনবোর্ড মোড় (ঢাকা-চট্টগ্রাম ও নারায়ণগঞ্জ সংযোগ), ঢাকা', nameBn: 'সাইনবোর্ড', nameEn: 'Signboard', latitude: 23.6845, longitude: 90.4782, district: 'Dhaka', thana: 'Siddhirganj', isHub: true, source: 'Hub' },
    { displayName: 'ধোলাইপাড় মোড় ও পদ্মা সেতু এক্সপ্রেসওয়ে গোলচত্বর, ঢাকা', nameBn: 'ধোলাইপাড়', nameEn: 'Dholairpar', latitude: 23.7012, longitude: 90.4312, district: 'Dhaka', thana: 'Shyampur', isHub: true, source: 'Hub' },
    { displayName: 'জুরাইন রেলগেট ও কাঁচাবাজার মোড়, ঢাকা', nameBn: 'জুরাইন', nameEn: 'Jurain', latitude: 23.6985, longitude: 90.4345, district: 'Dhaka', thana: 'Shyampur', isHub: true, source: 'Hub' },
    { displayName: 'পোস্তগোলা বুড়িগঙ্গা প্রথম সেতু মোড়, ঢাকা', nameBn: 'পোস্তগোলা', nameEn: 'Postogola', latitude: 23.6912, longitude: 90.4318, district: 'Dhaka', thana: 'Shyampur', isHub: true, source: 'Hub' },
    { displayName: 'দয়াগঞ্জ মোড় ও কাঁচাবাজার, ঢাকা', nameBn: 'দয়াগঞ্জ', nameEn: 'Dayaganj', latitude: 23.7135, longitude: 90.4225, district: 'Dhaka', thana: 'Gandaria', isHub: true, source: 'Hub' },
    { displayName: 'গেণ্ডারিয়া রেলওয়ে স্টেশন ও সাধনা মোড়, ঢাকা', nameBn: 'গেণ্ডারিয়া', nameEn: 'Gendaria', latitude: 23.7085, longitude: 90.4265, district: 'Dhaka', thana: 'Gandaria', isHub: true, source: 'Hub' },
    { displayName: 'ডেমরা স্টাফ কোয়ার্টার বাস টার্মিনাল, ঢাকা', nameBn: 'ডেমরা স্টাফ কোয়ার্টার', nameEn: 'Demra Staff Quarter', latitude: 23.7245, longitude: 90.4895, district: 'Dhaka', thana: 'Demra', isHub: true, source: 'Hub' },
    { displayName: 'সুলতana কামাল সেতু ও ডেমরা ঘাট মোড়, ঢাকা', nameBn: 'ডেমরা ঘাট', nameEn: 'Demra Ghat', latitude: 23.7212, longitude: 90.5012, district: 'Dhaka', thana: 'Demra', isHub: true, source: 'Hub' },
    { displayName: 'কোনাপাড়া বাস স্ট্যান্ড, ডেমরা রোড, ঢাকা', nameBn: 'কোনাপাড়া', nameEn: 'Konapara', latitude: 23.7152, longitude: 90.4685, district: 'Dhaka', thana: 'Demra', isHub: true, source: 'Hub' },
    { displayName: 'কামরাঙ্গীরচর লোহারপুল মোড় ও প্রধান বাজার, ঢাকা', nameBn: 'কামরাঙ্গীরচর', nameEn: 'Kamrangirchar', latitude: 23.7225, longitude: 90.3785, district: 'Dhaka', thana: 'Kamrangirchar', isHub: true, source: 'Hub' },
    { displayName: 'জিনজিরা বাস স্ট্যান্ড ও ফেরিঘাট মোড়, কেরানীগঞ্জ', nameBn: 'জিনজিরা', nameEn: 'Jinjira', latitude: 23.7065, longitude: 90.3952, district: 'Dhaka', thana: 'Keraniganj', isHub: true, source: 'Hub' },
    { displayName: 'কদমতলী গোলচত্বর ও বাবুবাজার ব্রিজ সংযোগ, কেরানীগঞ্জ', nameBn: 'কদমতলী কেরানীগঞ্জ', nameEn: 'Kadamtoli Keraniganj', latitude: 23.6985, longitude: 90.3912, district: 'Dhaka', thana: 'Keraniganj', isHub: true, source: 'Hub' },
    { displayName: 'হাসনাবাদ বাস স্ট্যান্ড ও বুড়িগঙ্গা সেতু সংযোগ, কেরানীগঞ্জ', nameBn: 'হাসনাবাদ', nameEn: 'Hasnabad', latitude: 23.6812, longitude: 90.4258, district: 'Dhaka', thana: 'Keraniganj', isHub: true, source: 'Hub' },
    { displayName: 'রুহিতপুর বাজার ও বাস স্ট্যান্ড, কেরানীগঞ্জ', nameBn: 'রুহিতপুর', nameEn: 'Rohitpur', latitude: 23.6895, longitude: 90.3125, district: 'Dhaka', thana: 'Keraniganj', isHub: true, source: 'Hub' },
    { displayName: 'আটি বাজার মোড়, কেরানীগঞ্জ, ঢাকা', nameBn: 'আটি বাজার', nameEn: 'Ati Bazar', latitude: 23.7185, longitude: 90.3245, district: 'Dhaka', thana: 'Keraniganj', isHub: true, source: 'Hub' },
    { displayName: 'আমিনবাজার বাস স্ট্যান্ড ও গাবতলী ব্রিজ সংযোগ, সাভার', nameBn: 'আমিনবাজার', nameEn: 'Aminbazar', latitude: 23.7842, longitude: 90.3345, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'হেমায়েতপুর বাস স্ট্যান্ড ও সিংগাইর রোড মোড়, সাভার', nameBn: 'হেমায়েতপুর', nameEn: 'Hemayetpur', latitude: 23.7965, longitude: 90.2685, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'সাভার বাস স্ট্যান্ড ও বাজার মোড়, সাভার', nameBn: 'সাভার বাস স্ট্যান্ড', nameEn: 'Savar Bus Stand', latitude: 23.8445, longitude: 90.2582, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'জাতীয় স্মৃতিসৌধ প্রধান গেট, সাভার', nameBn: 'জাতীয় স্মৃতিসৌধ', nameEn: 'National Memorial Savar', latitude: 23.9112, longitude: 90.2542, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (JU) ডেইরি গেট, সাভার', nameBn: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', nameEn: 'Jahangirnagar University', latitude: 23.8812, longitude: 90.2685, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'নবীনগর বাস টার্মিনাল ও স্মৃতিসৌধ মোড়, সাভার', nameBn: 'নবীনগর', nameEn: 'Nabinagar', latitude: 23.9185, longitude: 90.2482, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'বাইপাইল মোড় ও ঢাকা ইপিজেড সংযোগ, সাভার', nameBn: 'বাইপাইল', nameEn: 'Baipail', latitude: 23.9452, longitude: 90.2745, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'ঢাকা ইপিজেড (DEPZ) প্রধান ফটক, সাভার', nameBn: 'ঢাকা ইপিজেড', nameEn: 'DEPZ Savar', latitude: 23.9512, longitude: 90.2785, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'আশুলিয়া বাজার ও বেড়িবাঁধ মোড়, ঢাকা', nameBn: 'আশুলিয়া', nameEn: 'Ashulia', latitude: 23.9012, longitude: 90.3245, district: 'Dhaka', thana: 'Ashulia', isHub: true, source: 'Hub' },
    { displayName: 'ফ্যান্টাসি কিংডম মোড়, জামগড়া, আশুলিয়া', nameBn: 'ফ্যান্টাসি কিংডম', nameEn: 'Fantasy Kingdom', latitude: 23.9345, longitude: 90.2985, district: 'Dhaka', thana: 'Ashulia', isHub: true, source: 'Hub' },
    { displayName: 'জিরানী বাজার মোড় ও বিকেএসপি, সাভার', nameBn: 'জিরানী বাজার', nameEn: 'Jirani Bazar', latitude: 23.9785, longitude: 90.2585, district: 'Dhaka', thana: 'Savar', isHub: true, source: 'Hub' },
    { displayName: 'ধামরাই বাস স্ট্যান্ড ও বাজার মোড়, ঢাকা', nameBn: 'ধামরাই', nameEn: 'Dhamrai', latitude: 23.9212, longitude: 90.2152, district: 'Dhaka', thana: 'Dhamrai', isHub: true, source: 'Hub' }
  ],
  gazipur: [
    { displayName: 'চান্দনা চৌরাস্তা ও ফ্লাইওভার, গাজীপুর', nameBn: 'চৌরাস্তা গাজীপুর', nameEn: 'Chandana Chowrasta', latitude: 23.9989, longitude: 90.3842, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'জয়দেবপুর বাস স্ট্যান্ড ও রেলওয়ে জংশন, গাজীপুর', nameBn: 'জয়দেবপুর', nameEn: 'Joydebpur', latitude: 24.0015, longitude: 90.4285, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'শিববাড়ি মোড় ও জেলা পরিষদ, গাজীপুর', nameBn: 'শিববাড়ি', nameEn: 'Shibbari Gazipur', latitude: 24.0042, longitude: 90.4215, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'রাজবাড়ী মাঠ ও গাজীপুর ডিসি অফিস মোড়', nameBn: 'রাজবাড়ী মাঠ', nameEn: 'Rajbari Math', latitude: 24.0085, longitude: 90.4262, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'টঙ্গী স্টেশন রোড ও রেলওয়ে জংশন, গাজীপুর', nameBn: 'টঙ্গী স্টেশন রোড', nameEn: 'Tongi Station Road', latitude: 23.8967, longitude: 90.4042, district: 'Gazipur', thana: 'Tongi', isHub: true, source: 'Hub' },
    { displayName: 'টঙ্গী বাজার ও তুরাগ নদী সেতু, গাজীপুর', nameBn: 'টঙ্গী বাজার', nameEn: 'Tongi Bazar', latitude: 23.8912, longitude: 90.4015, district: 'Gazipur', thana: 'Tongi', isHub: true, source: 'Hub' },
    { displayName: 'টঙ্গী সরকারি কলেজ গেট ও মিলগেট মোড়, গাজীপুর', nameBn: 'টঙ্গী কলেজ গেট', nameEn: 'Tongi College Gate', latitude: 23.9085, longitude: 90.4021, district: 'Gazipur', thana: 'Tongi', isHub: true, source: 'Hub' },
    { displayName: 'চেরাগআলী মার্কেট মোড় ও বাস স্ট্যান্ড, টঙ্গী, গাজীপুর', nameBn: 'চেরাগআলী', nameEn: 'Cherag Ali', latitude: 23.9152, longitude: 90.4012, district: 'Gazipur', thana: 'Tongi', isHub: true, source: 'Hub' },
    { displayName: 'গাজীপুরা বাস স্ট্যান্ড ও সাতাইশ রোড, টঙ্গী, গাজীপুর', nameBn: 'গাজীপুরা', nameEn: 'Gazipura', latitude: 23.9285, longitude: 90.3985, district: 'Gazipur', thana: 'Tongi', isHub: true, source: 'Hub' },
    { displayName: 'বড়বাড়ী বাস স্ট্যান্ড ও বাজার, গাজীপুর', nameBn: 'বড়বাড়ী', nameEn: 'Barobari', latitude: 23.9512, longitude: 90.3935, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'বোর্ড বাজার ও ইসলামিক প্রযুক্তি বিশ্ববিদ্যালয় (IUT), গাজীপুর', nameBn: 'বোর্ড বাজার', nameEn: 'Board Bazar', latitude: 23.9634, longitude: 90.3921, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' },
    { displayName: 'কোনাবাড়ী বাস স্ট্যান্ড ও ফ্লাইওভার, গাজীপুর', nameBn: 'কোনাবাড়ী', nameEn: 'Konabari', latitude: 24.0182, longitude: 90.3278, district: 'Gazipur', thana: 'Konabari', isHub: true, source: 'Hub' },
    { displayName: 'কাশিমপুর কেন্দ্রীয় কারাগার মোড় ও বাজার, গাজীপুর', nameBn: 'কাশিমপুর', nameEn: 'Kashimpur', latitude: 24.0085, longitude: 90.3012, district: 'Gazipur', thana: 'Konabari', isHub: true, source: 'Hub' },
    { displayName: 'চন্দ্রা ত্রিমোড় ও কালিয়াকৈর হাইটেক পার্ক, গাজীপুর', nameBn: 'চন্দ্রা', nameEn: 'Chandra', latitude: 24.0512, longitude: 90.2452, district: 'Gazipur', thana: 'Kaliakair', isHub: true, source: 'Hub' },
    { displayName: 'সফিপুর আনসার ও ভিডিপি একাডেমি গেট, গাজীপুর', nameBn: 'সফিপুর', nameEn: 'Safipur', latitude: 24.0385, longitude: 90.2685, district: 'Gazipur', thana: 'Kaliakair', isHub: true, source: 'Hub' },
    { displayName: 'কালিয়াকৈর বাস স্ট্যান্ড ও বাজার, গাজীপুর', nameBn: 'কালিয়াকৈর', nameEn: 'Kaliakair', latitude: 24.0745, longitude: 90.2215, district: 'Gazipur', thana: 'Kaliakair', isHub: true, source: 'Hub' },
    { displayName: 'নাওজোর হাইওয়ে মোড় ও কড্ডার মোড় লিংক, গাজীপুর', nameBn: 'নাওজোর', nameEn: 'Nowjor', latitude: 24.0012, longitude: 90.3645, district: 'Gazipur', thana: 'Joydebpur', isHub: true, source: 'Hub' }
  ],
  narayanganj: [
    { displayName: 'চাষাড়া গোলচত্বর ও কেন্দ্রীয় শহীদ মিনার, নারায়ণগঞ্জ', nameBn: 'চাষাড়া', nameEn: 'Chashara', latitude: 23.6238, longitude: 90.4998, district: 'Narayanganj', thana: 'Narayanganj Sadar', isHub: true, source: 'Hub' },
    { displayName: '২ নং রেলগেট বাস স্ট্যান্ড ও ফলপট্টি, নারায়ণগঞ্জ', nameBn: '২ নং রেলগেট', nameEn: '2 No Railgate', latitude: 23.6189, longitude: 90.5054, district: 'Narayanganj', thana: 'Narayanganj Sadar', isHub: true, source: 'Hub' },
    { displayName: '১ নং রেলগেট ও নারায়ণগঞ্জ লঞ্চ ঘাট, নারায়ণগঞ্জ', nameBn: '১ নং রেলগেট', nameEn: '1 No Railgate', latitude: 23.6145, longitude: 90.5085, district: 'Narayanganj', thana: 'Narayanganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'টানবাজার সুতার আড়ৎ ও প্রধান বাজার, নারায়ণগঞ্জ', nameBn: 'টানবাজার', nameEn: 'Tanbazar', latitude: 23.6198, longitude: 90.5021, district: 'Narayanganj', thana: 'Narayanganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'নিতাইগঞ্জ পাইকারি খাদ্যশস্যের আড়ৎ, নারায়ণগঞ্জ', nameBn: 'নিতাইগঞ্জ', nameEn: 'Nitaiganj', latitude: 23.6085, longitude: 90.5095, district: 'Narayanganj', thana: 'Narayanganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'বন্দর খেয়াঘাট ও কদম রসুল দরগা মোড়, নারায়ণগঞ্জ', nameBn: 'বন্দর খেয়াঘাট', nameEn: 'Bandar Kheya Ghat', latitude: 23.6175, longitude: 90.5185, district: 'Narayanganj', thana: 'Bandar', isHub: true, source: 'Hub' },
    { displayName: 'পঞ্চবটী মোড় ও বিসিক শিল্পনগরী, ফতুল্লা, নারায়ণগঞ্জ', nameBn: 'পঞ্চবটী', nameEn: 'Panchabati', latitude: 23.6452, longitude: 90.4862, district: 'Narayanganj', thana: 'Fatullah', isHub: true, source: 'Hub' },
    { displayName: 'ফতুল্লা বাস স্ট্যান্ড ও স্টেডিয়াম মোড়, নারায়ণগঞ্জ', nameBn: 'ফতুল্লা', nameEn: 'Fatullah', latitude: 23.6385, longitude: 90.4912, district: 'Narayanganj', thana: 'Fatullah', isHub: true, source: 'Hub' },
    { displayName: 'পাগলা বাজার বাস স্ট্যান্ড ও ওয়াবদা মোড়, নারায়ণগঞ্জ', nameBn: 'পাগলা', nameEn: 'Pagla', latitude: 23.6652, longitude: 90.4685, district: 'Narayanganj', thana: 'Fatullah', isHub: true, source: 'Hub' },
    { displayName: 'শিমরাইল মোড় ও কাঁচপুর ব্রিজ সংযোগ, নারায়ণগঞ্জ', nameBn: 'শিমরাইল কাঁচপুর', nameEn: 'Shimrail Kanchpur', latitude: 23.6998, longitude: 90.5187, district: 'Narayanganj', thana: 'Siddhirganj', isHub: true, source: 'Hub' },
    { displayName: 'চিটাগাং রোড বাস স্ট্যান্ড ও সিদ্ধিরগঞ্জ, নারায়ণগঞ্জ', nameBn: 'চিটাগাং রোড', nameEn: 'Chittagong Road', latitude: 23.6985, longitude: 90.5125, district: 'Narayanganj', thana: 'Siddhirganj', isHub: true, source: 'Hub' },
    { displayName: 'আদমজী ইপিজেড প্রধান ফটক, সিদ্ধিরগঞ্জ, নারায়ণগঞ্জ', nameBn: 'আদমজী ইপিজেড', nameEn: 'Adamjee EPZ', latitude: 23.6654, longitude: 90.5289, district: 'Narayanganj', thana: 'Siddhirganj', isHub: true, source: 'Hub' },
    { displayName: 'মদনপুর বাস স্ট্যান্ড ও ঢাকা বাইপাস মোড়, নারায়ণগঞ্জ', nameBn: 'মদনপুর', nameEn: 'Madanpur', latitude: 23.6885, longitude: 90.5625, district: 'Narayanganj', thana: 'Bandar', isHub: true, source: 'Hub' },
    { displayName: 'সোনারগাঁও পানাম নগর ও লোকশিল্প জাদুঘর, নারায়ণগঞ্জ', nameBn: 'সোনারগাঁও পানাম নগর', nameEn: 'Panam City', latitude: 23.6485, longitude: 90.6012, district: 'Narayanganj', thana: 'Sonargaon', isHub: true, source: 'Hub' },
    { displayName: 'মোগরাপাড়া চৌরাস্তা, সোনারগাঁও, নারায়ণগঞ্জ', nameBn: 'মোগরাপাড়া', nameEn: 'Mograpara', latitude: 23.6395, longitude: 90.5895, district: 'Narayanganj', thana: 'Sonargaon', isHub: true, source: 'Hub' },
    { displayName: 'মেঘনা ঘাট বাস স্ট্যান্ড ও মেঘনা সেতু, সোনারগাঁও', nameBn: 'মেঘনা ঘাট', nameEn: 'Meghna Ghat', latitude: 23.6085, longitude: 90.6285, district: 'Narayanganj', thana: 'Sonargaon', isHub: true, source: 'Hub' },
    { displayName: 'ভুলতা গাউছিয়া পাইকারি কাপড়ের মার্কেট, রূপগঞ্জ, নারায়ণগঞ্জ', nameBn: 'ভুলতা গাউছিয়া', nameEn: 'Bhulta Gausia', latitude: 23.7845, longitude: 90.5842, district: 'Narayanganj', thana: 'Rupganj', isHub: true, source: 'Hub' },
    { displayName: 'কাঞ্চন ব্রিজ ও ৩০০ ফিট এক্সপ্রেসওয়ে শেষ মাথা, নারায়ণগঞ্জ', nameBn: 'কাঞ্চন ব্রিজ', nameEn: 'Kanchan Bridge', latitude: 23.8312, longitude: 90.5485, district: 'Narayanganj', thana: 'Rupganj', isHub: true, source: 'Hub' }
  ],
  chattogram: [
    { displayName: 'জিইসি মোড় ও সেন্ট্রাল প্লাজা, চট্টগ্রাম', nameBn: 'জিইসি মোড়', nameEn: 'GEC Circle', latitude: 22.3585, longitude: 91.8222, district: 'Chattogram', thana: 'Panchlaish', isHub: true, source: 'Hub' },
    { displayName: '২ নং গেট মোড় ও বিপ্লব উদ্যান, চট্টগ্রাম', nameBn: '২ নং গেট', nameEn: '2 No Gate', latitude: 22.3652, longitude: 91.8265, district: 'Chattogram', thana: 'Panchlaish', isHub: true, source: 'Hub' },
    { displayName: 'চকবাজার মোড় ও গুলজার টাওয়ার, চট্টগ্রাম', nameBn: 'চকবাজার', nameEn: 'Chawkbazar', latitude: 22.3589, longitude: 91.8398, district: 'Chattogram', thana: 'Chawkbazar', isHub: true, source: 'Hub' },
    { displayName: 'আন্দরকিল্লা শাহী জামে মসজিদ মোড়, চট্টগ্রাম', nameBn: 'আন্দরকিল্লা', nameEn: 'Andarkilla', latitude: 22.3395, longitude: 91.8385, district: 'Chattogram', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'নিউ মার্কেট মোড় ও কোতোয়ালী জংশন, চট্টগ্রাম', nameBn: 'নিউ মার্কেট', nameEn: 'New Market', latitude: 22.3353, longitude: 91.8329, district: 'Chattogram', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'লালখান বাজার মোড় ও ফ্লাইওভার, চট্টগ্রাম', nameBn: 'লালখান বাজার', nameEn: 'Lalkhan Bazar', latitude: 22.3512, longitude: 91.8175, district: 'Chattogram', thana: 'Khulshi', isHub: true, source: 'Hub' },
    { displayName: 'টাইগারপাস মোড় ও আমবাগান লিংক, চট্টগ্রাম', nameBn: 'টাইগারপাস', nameEn: 'Tiger Pass', latitude: 22.3445, longitude: 91.8152, district: 'Chattogram', thana: 'Khulshi', isHub: true, source: 'Hub' },
    { displayName: 'আগ্রাবাদ বাদামতলী বাণিজ্যিক এলাকা, চট্টগ্রাম', nameBn: 'আগ্রাবাদ', nameEn: 'Agrabad', latitude: 22.3276, longitude: 91.8123, district: 'Chattogram', thana: 'Double Mooring', isHub: true, source: 'Hub' },
    { displayName: 'দেওয়ানহাট মোড় ও ওভারব্রিজ, চট্টগ্রাম', nameBn: 'দেওয়ানহাট', nameEn: 'Dewanhat', latitude: 22.3412, longitude: 91.8085, district: 'Chattogram', thana: 'Double Mooring', isHub: true, source: 'Hub' },
    { displayName: 'অলংকার মোড় ও বাস টার্মিনাল, চট্টগ্রাম', nameBn: 'অলংকার মোড়', nameEn: 'Alankar Circle', latitude: 22.3705, longitude: 91.7828, district: 'Chattogram', thana: 'Pahartali', isHub: true, source: 'Hub' },
    { displayName: 'এ কে খান আন্তঃজেলা বাস টার্মিনাল গেট, চট্টগ্রাম', nameBn: 'এ কে খান গেট', nameEn: 'A.K. Khan Gate', latitude: 22.3789, longitude: 91.7778, district: 'Chattogram', thana: 'Pahartali', isHub: true, source: 'Hub' },
    { displayName: 'কর্নেল হাট ও সিটি গেট সংযোগ, চট্টগ্রাম', nameBn: 'কর্নেল হাট', nameEn: 'Colonel Hat', latitude: 22.3945, longitude: 91.7685, district: 'Chattogram', thana: 'Akbar Shah', isHub: true, source: 'Hub' },
    { displayName: 'হালিশহর বড়পোল মোড় ও এক্সেস রোড, চট্টগ্রাম', nameBn: 'হালিশহর', nameEn: 'Halishahar', latitude: 22.3412, longitude: 91.7825, district: 'Chattogram', thana: 'Halishahar', isHub: true, source: 'Hub' },
    { displayName: 'বহদ্দারহাট কেন্দ্রীয় বাস টার্মিনাল ও ফ্লাইওভার, চট্টগ্রাম', nameBn: 'বহদ্দারহাট', nameEn: 'Bahaddarhat', latitude: 22.3683, longitude: 91.8443, district: 'Chattogram', thana: 'Chandgaon', isHub: true, source: 'Hub' },
    { displayName: 'মুরাদপুর মোড় ও ফ্লাইওভার জংশন, চট্টগ্রাম', nameBn: 'মুরাদপুর', nameEn: 'Muradpur', latitude: 22.3645, longitude: 91.8389, district: 'Chattogram', thana: 'Panchlaish', isHub: true, source: 'Hub' },
    { displayName: 'অক্সিজেন মোড় (রাঙ্গামাটি ও হাটহাজারী রোড), চট্টগ্রাম', nameBn: 'অক্সিজেন মোড়', nameEn: 'Oxygen Mor', latitude: 22.3912, longitude: 91.8285, district: 'Chattogram', thana: 'Bayezid', isHub: true, source: 'Hub' },
    { displayName: 'কাপ্তাই রাস্তার মাথা ও চান্দগাঁও আবাসিক, চট্টগ্রাম', nameBn: 'কাপ্তাই রাস্তার মাথা', nameEn: 'Kaptai Rastar Matha', latitude: 22.3712, longitude: 91.8685, district: 'Chattogram', thana: 'Chandgaon', isHub: true, source: 'Hub' },
    { displayName: 'কালুরঘাট ভারী শিল্প এলাকা ও কর্ণফুলী সেতু মোড়, চট্টগ্রাম', nameBn: 'কালুরঘাট', nameEn: 'Kalurghat', latitude: 22.3945, longitude: 91.8845, district: 'Chattogram', thana: 'Chandgaon', isHub: true, source: 'Hub' },
    { displayName: 'চট্টগ্রাম ইপিজেড (CEPZ) প্রধান গেট, চট্টগ্রাম', nameBn: 'চট্টগ্রাম ইপিজেড', nameEn: 'Chittagong EPZ', latitude: 22.2895, longitude: 91.7812, district: 'Chattogram', thana: 'EPZ', isHub: true, source: 'Hub' },
    { displayName: 'পতেঙ্গা সমুদ্র সৈকত ও নেভাল একাডেমি মোড়, চট্টগ্রাম', nameBn: 'পতেঙ্গা সমুদ্র সৈকত', nameEn: 'Patenga Sea Beach', latitude: 22.2385, longitude: 91.7912, district: 'Chattogram', thana: 'Patenga', isHub: true, source: 'Hub' },
    { displayName: 'বঙ্গবন্ধু শেখ মুজিবুর রহমান টানেল পতেঙ্গা প্রবেশদ্বার', nameBn: 'বঙ্গবন্ধু টানেল পতেঙ্গা', nameEn: 'Bangabandhu Tunnel Patenga', latitude: 22.2285, longitude: 91.8012, district: 'Chattogram', thana: 'Patenga', isHub: true, source: 'Hub' },
    { displayName: 'শাহ আমানত আন্তর্জাতিক বিমানবন্দর, পতেঙ্গা, চট্টগ্রাম', nameBn: 'শাহ আমানত বিমানবন্দর', nameEn: 'Shah Amanat Airport', latitude: 22.2495, longitude: 91.8132, district: 'Chattogram', thana: 'Patenga', isHub: true, source: 'Hub' },
    { displayName: 'শাহ আমানত সেতু (নতুন ব্রিজ বাস টার্মিনাল), বাকলিয়া, চট্টগ্রাম', nameBn: 'নতুন ব্রিজ শাহ আমানত সেতু', nameEn: 'Shah Amanat Bridge', latitude: 22.3245, longitude: 91.8542, district: 'Chattogram', thana: 'Bakalia', isHub: true, source: 'Hub' },
    { displayName: 'কদমতলী শুভপুর কেন্দ্রীয় বাস টার্মিনাল, চট্টগ্রাম', nameBn: 'কদমতলী চট্টগ্রাম', nameEn: 'Kadamtali CTG', latitude: 22.3385, longitude: 91.8245, district: 'Chattogram', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'জামালখান চেরাগী পাহাড় মোড় ও প্রেস ক্লাব, চট্টগ্রাম', nameBn: 'জামালখান', nameEn: 'Jamalkhan', latitude: 22.3475, longitude: 91.8345, district: 'Chattogram', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU) ১ নং গেট, হাটহাজারী', nameBn: 'চট্টগ্রাম বিশ্ববিদ্যালয়', nameEn: 'Chittagong University', latitude: 22.4645, longitude: 91.7915, district: 'Chattogram', thana: 'Hathazari', isHub: true, source: 'Hub' }
  ],
  coxsbazar: [
    { displayName: 'কলাতলী সুগন্ধা বিচ পয়েন্ট ও হোটেল মোটেল জোন, কক্সবাজার', nameBn: 'কলাতলী সুগন্ধা মোড়', nameEn: 'Kolatoli Sugandha Point', latitude: 21.4192, longitude: 91.9839, district: 'Coxsbazar', thana: 'Cox\'s Bazar Sadar', isHub: true, source: 'Hub' },
    { displayName: 'লাবণী বিচ পয়েন্ট ও ঝাউবন, কক্সবাজার', nameBn: 'লাবণী বিচ পয়েন্ট', nameEn: 'Laboni Beach Point', latitude: 21.4325, longitude: 91.9721, district: 'Coxsbazar', thana: 'Cox\'s Bazar Sadar', isHub: true, source: 'Hub' },
    { displayName: 'লারপাড়া কেন্দ্রীয় বাস টার্মিনাল, কক্সবাজার', nameBn: 'কক্সবাজার বাস টার্মিনাল', nameEn: 'Coxs Bazar Bus Terminal', latitude: 21.4398, longitude: 92.0084, district: 'Coxsbazar', thana: 'Cox\'s Bazar Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ঝাউতলা মোড় ও প্রধান সড়ক, কক্সবাজার', nameBn: 'ঝাউতলা', nameEn: 'Jhautala', latitude: 21.4372, longitude: 91.9814, district: 'Coxsbazar', thana: 'Cox\'s Bazar Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ডলফিন মোড় ও কলাতলী প্রবেশদ্বার, কক্সবাজার', nameBn: 'ডলফিন মোড়', nameEn: 'Dolphin Mor', latitude: 21.4185, longitude: 91.9852, district: 'Coxsbazar', thana: 'Cox\'s Bazar Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ইনানী পাথুরে সমুদ্র সৈকত ও মেরিন ড্রাইভ, উখিয়া', nameBn: 'ইনানী বিচ', nameEn: 'Inani Beach', latitude: 21.2385, longitude: 92.0512, district: 'Coxsbazar', thana: 'Ukhiya', isHub: true, source: 'Hub' },
    { displayName: 'টেকনাফ বাস টার্মিনাল ও সেন্টমার্টিন শিপ ঘাট, টেকনাফ', nameBn: 'টেকনাফ বাস স্ট্যান্ড', nameEn: 'Teknaf Bus Stand', latitude: 20.8652, longitude: 92.2985, district: 'Coxsbazar', thana: 'Teknaf', isHub: true, source: 'Hub' },
    { displayName: 'চকরিয়া পৌর বাস টার্মিনাল, কক্সবাজার', nameBn: 'চকরিয়া বাস টার্মিনাল', nameEn: 'Chakaria Bus Terminal', latitude: 21.7895, longitude: 92.0785, district: 'Coxsbazar', thana: 'Chakaria', isHub: true, source: 'Hub' }
  ],
  sylhet: [
    { displayName: 'কদমতলী কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, সিলেট', nameBn: 'কদমতলী বাস টার্মিনাল', nameEn: 'Kadamtali Bus Terminal', latitude: 24.8821, longitude: 91.8741, district: 'Sylhet', thana: 'Dakshin Surma', isHub: true, source: 'Hub' },
    { displayName: 'আম্বরখানা পয়েন্ট ও এয়ারপোর্ট রোড, সিলেট', nameBn: 'আম্বরখানা', nameEn: 'Amberkhana', latitude: 24.9082, longitude: 91.8703, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' },
    { displayName: 'জিন্দাবাজার পয়েন্ট ও সিটি সেন্টার, সিলেট', nameBn: 'জিন্দাবাজার', nameEn: 'Zindabazar', latitude: 24.8963, longitude: 91.8715, district: 'Sylhet', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'চৌহাট্টা পয়েন্ট ও কেন্দ্রীয় শহীদ মিনার, সিলেট', nameBn: 'চৌহাট্টা', nameEn: 'Chouhatta', latitude: 24.9008, longitude: 91.8696, district: 'Sylhet', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'কুমারগাঁও সুনামগঞ্জ বাস টার্মিনাল, সিলেট', nameBn: 'কুমারগাঁও বাস টার্মিনাল', nameEn: 'Kumargaon Bus Terminal', latitude: 24.9097, longitude: 91.8294, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' },
    { displayName: 'হযরত শাহজালাল (রহ.) মাজার শরীফ গেট, দরগাহ গেট, সিলেট', nameBn: 'হযরত শাহজালাল মাজার', nameEn: 'Hazrat Shahjalal Mazar', latitude: 24.9025, longitude: 91.8725, district: 'Sylhet', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (SUST) মেইন গেট, কুমারগাঁও', nameBn: 'শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়', nameEn: 'SUST Sylhet', latitude: 24.9185, longitude: 91.8315, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' },
    { displayName: 'টিলাগড় পয়েন্ট ও এমসি কলেজ গেট, সিলেট', nameBn: 'টিলাগড়', nameEn: 'Tilagarh', latitude: 24.8995, longitude: 91.9012, district: 'Sylhet', thana: 'Shah Poran', isHub: true, source: 'Hub' },
    { displayName: 'সুবিদবাজার পয়েন্ট ও লন্ডনি রোড, সিলেট', nameBn: 'সুবিদবাজার', nameEn: 'Subidbazar', latitude: 24.9042, longitude: 91.8585, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' }
  ],
  rajshahi: [
    { displayName: 'শিরোইল কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, রাজশাহী', nameBn: 'শিরোইল বাস টার্মিনাল', nameEn: 'Shiroil Bus Terminal', latitude: 24.3725, longitude: 88.6015, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' },
    { displayName: 'সাহেব বাজার জিরো পয়েন্ট ও বড়কুঠি, রাজশাহী', nameBn: 'সাহেব বাজার', nameEn: 'Saheb Bazar', latitude: 24.3638, longitude: 88.6012, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' },
    { displayName: 'তালাইমারী মোড় ও কাজলা গেট, রাজশাহী', nameBn: 'তালাইমারী', nameEn: 'Talaimari', latitude: 24.3642, longitude: 88.6258, district: 'Rajshahi', thana: 'Motihar', isHub: true, source: 'Hub' },
    { displayName: 'ভদ্রা মোড় ও বাইপাস গোলচত্বর, রাজশাহী', nameBn: 'ভদ্রা মোড়', nameEn: 'Bhadra Circle', latitude: 24.3739, longitude: 88.6186, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' },
    { displayName: 'রাজশাহী বিশ্ববিদ্যালয় (RU) প্রধান ফটক ও প্যারিস রোড', nameBn: 'রাজশাহী বিশ্ববিদ্যালয়', nameEn: 'Rajshahi University', latitude: 24.3705, longitude: 88.6385, district: 'Rajshahi', thana: 'Motihar', isHub: true, source: 'Hub' },
    { displayName: 'রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয় (RUET) প্রধান গেট', nameBn: 'রুয়েট গেট', nameEn: 'RUET Gate', latitude: 24.3685, longitude: 88.6285, district: 'Rajshahi', thana: 'Motihar', isHub: true, source: 'Hub' },
    { displayName: 'লক্ষ্মীপুর মোড় ও রাজশাহী মেডিকেল কলেজ হাসপাতাল (RMCH)', nameBn: 'লক্ষ্মীপুর রাজশাহী', nameEn: 'Laxmipur Rajshahi', latitude: 24.3712, longitude: 88.5862, district: 'Rajshahi', thana: 'Rajpara', isHub: true, source: 'Hub' },
    { displayName: 'নওদাপাড়া কেন্দ্রীয় বাস টার্মিনাল ও বিমানবন্দর রোড, রাজশাহী', nameBn: 'নওদাপাড়া', nameEn: 'Nowdapara', latitude: 24.4085, longitude: 88.6145, district: 'Rajshahi', thana: 'Shah Mokhdum', isHub: true, source: 'Hub' }
  ],
  khulna: [
    { displayName: 'সোনাডাঙ্গা কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, খুলনা', nameBn: 'সোনাডাঙ্গা বাস টার্মিনাল', nameEn: 'Sonadanga Bus Terminal', latitude: 22.8228, longitude: 89.5401, district: 'Khulna', thana: 'Sonadanga', isHub: true, source: 'Hub' },
    { displayName: 'শিববাড়ি মোড় ও জিয়া হল চত্বর, খুলনা', nameBn: 'শিববাড়ি খুলনা', nameEn: 'Shibbari Circle Khulna', latitude: 22.8225, longitude: 89.5539, district: 'Khulna', thana: 'Sonadanga', isHub: true, source: 'Hub' },
    { displayName: 'দৌলতপুর বাস স্ট্যান্ড ও বিএল কলেজ গেট, খুলনা', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur', latitude: 22.8794, longitude: 89.5244, district: 'Khulna', thana: 'Daulatpur', isHub: true, source: 'Hub' },
    { displayName: 'ডাকবাংলো মোড় ও পিকচার প্যালেস মোড়, খুলনা', nameBn: 'ডাকবাংলো', nameEn: 'Dakbangla Circle', latitude: 22.8122, longitude: 89.5621, district: 'Khulna', thana: 'Khulna Sadar', isHub: true, source: 'Hub' },
    { displayName: 'গল্লামারী মোড় ও খুলনা বিশ্ববিদ্যালয় (KU) গেট, খুলনা', nameBn: 'গল্লামারী', nameEn: 'Gollamari Khulna', latitude: 22.8015, longitude: 89.5342, district: 'Khulna', thana: 'Sonadanga', isHub: true, source: 'Hub' },
    { displayName: 'খালিশপুর নতুন রাস্তা মোড় ও বৈকালী মোড়, খুলনা', nameBn: 'খালিশপুর', nameEn: 'Khalishpur', latitude: 22.8542, longitude: 89.5385, district: 'Khulna', thana: 'Khalishpur', isHub: true, source: 'Hub' },
    { displayName: 'রূপসা ঘাট ও খান জাহান আলী সেতু (রূপসা সেতু), খুলনা', nameBn: 'রূপসা ঘাট', nameEn: 'Rupsha Ghat', latitude: 22.7945, longitude: 89.5785, district: 'Khulna', thana: 'Rupsha', isHub: true, source: 'Hub' }
  ],
  barishal: [
    { displayName: 'নথুল্লাবাদ কেন্দ্রীয় বাস টার্মিনাল, বরিশাল', nameBn: 'নথুল্লাবাদ বাস টার্মিনাল', nameEn: 'Nathullabad Bus Terminal', latitude: 22.7161, longitude: 90.3522, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'রূপাতলী বাস টার্মিনাল ও পটুয়াখালী সংযোগ মোড়, বরিশাল', nameBn: 'রূপাতলী বাস টার্মিনাল', nameEn: 'Rupatali Bus Terminal', latitude: 22.6789, longitude: 90.3442, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'সদর রোড চৌমাথা ও কাকলীর মোড়, বরিশাল', nameBn: 'সদর রোড', nameEn: 'Sadar Road', latitude: 22.7012, longitude: 90.3705, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বরিশাল নদী বন্দর ও কেন্দ্রীয় লঞ্চ ঘাট, বরিশাল', nameBn: 'বরিশাল লঞ্চ ঘাট', nameEn: 'Barishal Launch Ghat', latitude: 22.6985, longitude: 90.3795, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বরিশাল বিশ্ববিদ্যালয় (BU) গেট ও দপদপিয়া সেতু, বরিশাল', nameBn: 'বরিশাল বিশ্ববিদ্যালয়', nameEn: 'Barishal University', latitude: 22.6585, longitude: 90.3585, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' }
  ],
  rangpur: [
    { displayName: 'কামারপাড়া কেন্দ্রীয় বাস টার্মিনাল, রংপুর', nameBn: 'কামারপাড়া বাস টার্মিনাল', nameEn: 'Kamarpara Bus Terminal', latitude: 25.7512, longitude: 89.2485, district: 'Rangpur', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'জাহাজ কোম্পানি মোড় ও পায়রা চত্বর, রংপুর', nameBn: 'জাহাজ কোম্পানি মোড়', nameEn: 'Jahaj Company Mor', latitude: 25.7485, longitude: 89.2512, district: 'Rangpur', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'মডার্ন মোড় বাস স্ট্যান্ড ও ঢাকা রোড বাইপাস, রংপুর', nameBn: 'মডার্ন মোড়', nameEn: 'Modern Mor', latitude: 25.7195, longitude: 89.2785, district: 'Rangpur', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'রংপুর মেডিকেল কলেজ হাসপাতাল মোড়, রংপুর', nameBn: 'মেডিকেল মোড় রংপুর', nameEn: 'Medical Mor Rangpur', latitude: 25.7645, longitude: 89.2312, district: 'Rangpur', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) ও পার্কের মোড়, রংপুর', nameBn: 'বেগম রোকেয়া বিশ্ববিদ্যালয়', nameEn: 'BRUR Rangpur', latitude: 25.7285, longitude: 89.2612, district: 'Rangpur', thana: 'Kotwali', isHub: true, source: 'Hub' }
  ],
  mymensingh: [
    { displayName: 'মাসকান্দা কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, ময়মনসিংহ', nameBn: 'মাসকান্দা বাস টার্মিনাল', nameEn: 'Maskanda Bus Terminal', latitude: 24.7412, longitude: 90.3985, district: 'Mymensingh', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'গাঙ্গিনারপাড় মোড় ও বড় বাজার, ময়মনসিংহ', nameBn: 'গাঙ্গিনারপাড়', nameEn: 'Ganginarpar', latitude: 24.7562, longitude: 90.4085, district: 'Mymensingh', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'পাটগুদাম শম্ভুগঞ্জ ব্রিজ মোড় ও বাস টার্মিনাল, ময়মনসিংহ', nameBn: 'পাটগুদাম ব্রিজ', nameEn: 'Patgudam Bridge', latitude: 24.7545, longitude: 90.4245, district: 'Mymensingh', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'চরপাড়া মোড় ও ময়মনসিংহ মেডিকেল কলেজ হাসপাতাল (MMCH)', nameBn: 'চরপাড়া মেডিকেল মোড়', nameEn: 'Charpara Medical Mor', latitude: 24.7385, longitude: 90.4125, district: 'Mymensingh', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) প্রধান ফটক, ময়মনসিংহ', nameBn: 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয়', nameEn: 'BAU Mymensingh', latitude: 24.7245, longitude: 90.4312, district: 'Mymensingh', thana: 'Kotwali', isHub: true, source: 'Hub' }
  ],
  cumilla: [
    { displayName: 'কান্দিরপাড় টাউন হল ও প্রাণকেন্দ্র, কুমিল্লা', nameBn: 'কান্দিরপাড়', nameEn: 'Kandirpar', latitude: 23.4612, longitude: 91.1812, district: 'Cumilla', thana: 'Adarsha Sadar', isHub: true, source: 'Hub' },
    { displayName: 'শাসনগাছা কেন্দ্রীয় বাস টার্মিনাল ও রেলগেট, কুমিল্লা', nameBn: 'শাসনগাছা বাস টার্মিনাল', nameEn: 'Shashongacha Bus Terminal', latitude: 23.4689, longitude: 91.1712, district: 'Cumilla', thana: 'Adarsha Sadar', isHub: true, source: 'Hub' },
    { displayName: 'পদুয়ার বাজার বিশ্বরোড ফ্লাইওভার মোড়, কুমিল্লা', nameBn: 'পদুয়ার বাজার বিশ্বরোড', nameEn: 'Paduar Bazar', latitude: 23.4178, longitude: 91.1923, district: 'Cumilla', thana: 'Sadar South', isHub: true, source: 'Hub' },
    { displayName: 'জাঙ্গালিয়া আন্তঃজেলা বাস টার্মিনাল, কুমিল্লা', nameBn: 'জাঙ্গালিয়া বাস টার্মিনাল', nameEn: 'Jangalia Bus Terminal', latitude: 23.4398, longitude: 91.1789, district: 'Cumilla', thana: 'Sadar South', isHub: true, source: 'Hub' },
    { displayName: 'টমসম ব্রিজ মোড় ও লাকসাম রোড, কুমিল্লা', nameBn: 'টমসম ব্রিজ', nameEn: 'Tomsom Bridge', latitude: 23.4485, longitude: 91.1812, district: 'Cumilla', thana: 'Adarsha Sadar', isHub: true, source: 'Hub' },
    { displayName: 'কোটবাড়ী ময়নামতি শালবন বিহার মোড়, কুমিল্লা', nameBn: 'কোটবাড়ী', nameEn: 'Kotbari', latitude: 23.4312, longitude: 91.1345, district: 'Cumilla', thana: 'Adarsha Sadar', isHub: true, source: 'Hub' }
  ],
  bogura: [
    { displayName: 'চারমাথা কেন্দ্রীয় আন্তঃজেলা বাস টার্মিনাল, বগুড়া', nameBn: 'চারমাথা বাস টার্মিনাল', nameEn: 'Charmatha Bus Terminal', latitude: 24.8512, longitude: 89.3512, district: 'Bogura', thana: 'Bogura Sadar', isHub: true, source: 'Hub' },
    { displayName: 'সাতমাথা জিরো পয়েন্ট ও বীরশ্রেষ্ঠ চত্বর, বগুড়া', nameBn: 'সাতমাথা জিরো পয়েন্ট', nameEn: 'Satmatha Zero Point', latitude: 24.8465, longitude: 89.3723, district: 'Bogura', thana: 'Bogura Sadar', isHub: true, source: 'Hub' },
    { displayName: 'বনানী বাইপাস মোড় (ঢাকা-রংপুর মহাসড়ক), বগুড়া', nameBn: 'বনানী বগুড়া', nameEn: 'Banani Bogura', latitude: 24.8189, longitude: 89.3789, district: 'Bogura', thana: 'Shahjahanpur', isHub: true, source: 'Hub' },
    { displayName: 'ঠনঠনিয়া আন্তঃজেলা বাস টার্মিনাল, বগুড়া', nameBn: 'ঠনঠনিয়া', nameEn: 'Thanthania', latitude: 24.8385, longitude: 89.3685, district: 'Bogura', thana: 'Bogura Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মাটিডালি বিমানমোড় ও রংপুর রোড বাইপাস, বগুড়া', nameBn: 'মাটিডালি', nameEn: 'Matidali', latitude: 24.8812, longitude: 89.3625, district: 'Bogura', thana: 'Bogura Sadar', isHub: true, source: 'Hub' }
  ],
  rangamati: [
    { displayName: 'বনরূপা বাজার ও বাণিজ্যিক এলাকা, রাঙ্গামাটি', nameBn: 'বনরূপা বাজার', nameEn: 'Bonorupa Bazar', latitude: 22.655477, longitude: 92.178924, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'রিজার্ভ বাজার ও কাপ্তাই লেক লঞ্চ ঘাট, রাঙ্গামাটি', nameBn: 'রিজার্ভ বাজার', nameEn: 'Reserve Bazar', latitude: 22.6462, longitude: 92.1865, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'তবলছড়ি বাজার ও পর্যটন কমপ্লেক্স সংযোগ, রাঙ্গামাটি', nameBn: 'তবলছড়ি বাজার', nameEn: 'Tabalchhari', latitude: 22.6373, longitude: 92.1818, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ভেদভেদী আন্তঃজেলা বাস টার্মিনাল, রাঙ্গামাটি', nameBn: 'ভেদভেদী বাস টার্মিনাল', nameEn: 'Bhedbhedi Bus Terminal', latitude: 22.6598, longitude: 92.1645, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'আসামবস্তি কাপ্তাই লেক ব্রিজ রোড, রাঙ্গামাটি', nameBn: 'আসামবস্তি', nameEn: 'Asambosti', latitude: 22.6412, longitude: 92.1934, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'কাপ্তাই নতুন বাজার ও জলবিদ্যুৎ প্রকল্প এলাকা, রাঙ্গামাটি', nameBn: 'কাপ্তাই নতুন বাজার', nameEn: 'Kaptai Notun Bazar', latitude: 22.4962, longitude: 92.2229, district: 'Rangamati', thana: 'Kaptai', isHub: true, source: 'Hub' },
    { displayName: 'রাঙ্গামাটি পর্যটন কমপ্লেক্স ও ঝুলন্ত সেতু মোড়', nameBn: 'পর্যটন ঝুলন্ত সেতু', nameEn: 'Hanging Bridge Rangamati', latitude: 22.6285, longitude: 92.1952, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' }
  ],
  tangail: [
    { displayName: 'নতুন বাস টার্মিনাল ও নিরালা মোড়, টাঙ্গাইল', nameBn: 'নতুন বাস টার্মিনাল টাঙ্গাইল', nameEn: 'Tangail New Bus Terminal', latitude: 24.2585, longitude: 89.9212, district: 'Tangail', thana: 'Tangail Sadar', isHub: true, source: 'Hub' },
    { displayName: 'এলেঙ্গা মোড় ও যমুনা সেতু সংযোগ, টাঙ্গাইল', nameBn: 'এলেঙ্গা বাস স্ট্যান্ড', nameEn: 'Elenga Bus Stand', latitude: 24.3385, longitude: 89.9245, district: 'Tangail', thana: 'Kalihati', isHub: true, source: 'Hub' }
  ],
  narsingdi: [
    { displayName: 'ভেলানগর বাস স্ট্যান্ড ও ঢাকা-সিলেট হাইওয়ে, নরসিংদী', nameBn: 'ভেলানগর বাস স্ট্যান্ড', nameEn: 'Velanagar Bus Stand', latitude: 23.9285, longitude: 90.7145, district: 'Narsingdi', thana: 'Narsingdi Sadar', isHub: true, source: 'Hub' },
    { displayName: 'সাহেপ্রতাপ গোলচত্বর মোড়, নরসিংদী', nameBn: 'সাহেপ্রতাপ মোড়', nameEn: 'Sahepratap Mor', latitude: 23.9145, longitude: 90.6985, district: 'Narsingdi', thana: 'Narsingdi Sadar', isHub: true, source: 'Hub' }
  ],
  faridpur: [
    { displayName: 'নতুন বাস টার্মিনাল ও গোয়ালচামট, ফরিদপুর', nameBn: 'ফরিদপুর নতুন বাস টার্মিনাল', nameEn: 'Faridpur New Bus Terminal', latitude: 23.6125, longitude: 89.8315, district: 'Faridpur', thana: 'Faridpur Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ভাঙ্গা পদ্মা সেতু এক্সপ্রেসওয়ে গোলচত্বর, ফরিদপুর', nameBn: 'ভাঙ্গা গোলচত্বর', nameEn: 'Bhanga Circle', latitude: 23.3885, longitude: 89.9812, district: 'Faridpur', thana: 'Bhanga', isHub: true, source: 'Hub' }
  ],
  gopalganj: [
    { displayName: 'পুলিশ লাইন মোড় ও জেলা বাস টার্মিনাল, গোপালগঞ্জ', nameBn: 'গোপালগঞ্জ পুলিশ লাইন মোড়', nameEn: 'Gopalganj Police Line Mor', latitude: 23.0112, longitude: 89.8312, district: 'Gopalganj', thana: 'Gopalganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'টুঙ্গিপাড়া সমাধিসৌধ কমপ্লেক্স ও বাস স্ট্যান্ড, গোপালগঞ্জ', nameBn: 'টুঙ্গিপাড়া', nameEn: 'Tungipara', latitude: 22.9012, longitude: 89.9015, district: 'Gopalganj', thana: 'Tungipara', isHub: true, source: 'Hub' }
  ],
  kishoreganj: [
    { displayName: 'গাইটাল কেন্দ্রীয় বাস টার্মিনাল, কিশোরগঞ্জ', nameBn: 'গাইটাল বাস টার্মিনাল', nameEn: 'Gaital Bus Terminal', latitude: 24.4385, longitude: 90.7712, district: 'Kishoreganj', thana: 'Kishoreganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'একরামপুর মোড় ও স্টেশন রোড, কিশোরগঞ্জ', nameBn: 'একরামপুর মোড়', nameEn: 'Ekrampur Mor', latitude: 24.4412, longitude: 90.7845, district: 'Kishoreganj', thana: 'Kishoreganj Sadar', isHub: true, source: 'Hub' }
  ],
  madaripur: [
    { displayName: 'মোস্তফাপুর মোড় ও ঢাকা-বরিশাল মহাসড়ক, মাদারীপুর', nameBn: 'মোস্তফাপুর বাস স্ট্যান্ড', nameEn: 'Mostafapur Bus Stand', latitude: 23.1485, longitude: 90.1412, district: 'Madaripur', thana: 'Madaripur Sadar', isHub: true, source: 'Hub' },
    { displayName: 'পুরাতন বাস স্ট্যান্ড ও প্রধান বাজার, মাদারীপুর', nameBn: 'মাদারীপুর পুরাতন বাস স্ট্যান্ড', nameEn: 'Madaripur Old Bus Stand', latitude: 23.1685, longitude: 90.1985, district: 'Madaripur', thana: 'Madaripur Sadar', isHub: true, source: 'Hub' }
  ],
  manikganj: [
    { displayName: 'মানিকগঞ্জ বাস স্ট্যান্ড ও খালপাড় মোড়, মানিকগঞ্জ', nameBn: 'মানিকগঞ্জ বাস স্ট্যান্ড', nameEn: 'Manikganj Bus Stand', latitude: 23.8685, longitude: 90.0112, district: 'Manikganj', thana: 'Manikganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'পাটুরিয়া ফেরি ও লঞ্চ টার্মিনাল, মানিকগঞ্জ', nameBn: 'পাটুরিয়া ঘাট', nameEn: 'Paturia Ghat', latitude: 23.8245, longitude: 89.7912, district: 'Manikganj', thana: 'Shibalaya', isHub: true, source: 'Hub' }
  ],
  munshiganj: [
    { displayName: 'মুক্তারপুর ষষ্ঠ বাংলাদেশ-চীন মৈত্রী সেতু মোড়, মুন্সীগঞ্জ', nameBn: 'মুক্তারপুর ব্রিজ মোড়', nameEn: 'Mukterpur Bridge', latitude: 23.5785, longitude: 90.5185, district: 'Munshiganj', thana: 'Munshiganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মাওয়া পদ্মা সেতু উত্তর টোল প্লাজা ও গোলচত্বর, মুন্সীগঞ্জ', nameBn: 'মাওয়া ঘাট', nameEn: 'Mawa Ghat', latitude: 23.4785, longitude: 90.2612, district: 'Munshiganj', thana: 'Lohajang', isHub: true, source: 'Hub' }
  ],
  rajbari: [
    { displayName: 'গোয়ালন্দ মোড় ও দৌলতদিয়া ফেরি ঘাট সংযোগ, রাজবাড়ী', nameBn: 'গোয়ালন্দ মোড়', nameEn: 'Goalanda Mor', latitude: 23.7412, longitude: 89.7612, district: 'Rajbari', thana: 'Goalanda', isHub: true, source: 'Hub' },
    { displayName: 'রাজবাড়ী রেলওয়ে স্টেশন ও পুরাতন বাস স্ট্যান্ড', nameBn: 'রাজবাড়ী রেলওয়ে স্টেশন', nameEn: 'Rajbari Railway Station', latitude: 23.7615, longitude: 89.6512, district: 'Rajbari', thana: 'Rajbari Sadar', isHub: true, source: 'Hub' }
  ],
  shariatpur: [
    { displayName: 'শরীয়তপুর কেন্দ্রীয় বাস টার্মিনাল ও পৌর বাজার', nameBn: 'শরীয়তপুর বাস টার্মিনাল', nameEn: 'Shariatpur Bus Terminal', latitude: 23.2385, longitude: 90.4285, district: 'Shariatpur', thana: 'Shariatpur Sadar', isHub: true, source: 'Hub' },
    { displayName: 'জাজিরা পদ্মা সেতু দক্ষিণ টোল প্লাজা, শরীয়তপুর', nameBn: 'জাজিরা পদ্মা সেতু প্রান্ত', nameEn: 'Jajira Padma Bridge Point', latitude: 23.4412, longitude: 90.2985, district: 'Shariatpur', thana: 'Jajira', isHub: true, source: 'Hub' }
  ],
  feni: [
    { displayName: 'মহিপাল ফ্লাইওভার মোড় ও হাইওয়ে বাস টার্মিনাল, ফেনী', nameBn: 'মহিপাল ফ্লাইওভার মোড়', nameEn: 'Mahipal Flyover Mor', latitude: 23.0085, longitude: 91.3885, district: 'Feni', thana: 'Feni Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ট্রাঙ্ক রোড জিরো পয়েন্ট ও শহীদ মিনার, ফেনী', nameBn: 'ট্রাঙ্ক রোড ফেনী', nameEn: 'Trunk Road Feni', latitude: 23.0185, longitude: 91.3985, district: 'Feni', thana: 'Feni Sadar', isHub: true, source: 'Hub' }
  ],
  brahmanbaria: [
    { displayName: 'কাউতলী মোড় ও কেন্দ্রীয় বাস টার্মিনাল, ব্রাহ্মণবাড়িয়া', nameBn: 'কাউতলী মোড়', nameEn: 'Kautoli Mor', latitude: 23.9512, longitude: 91.1085, district: 'Brahmanbaria', thana: 'Brahmanbaria Sadar', isHub: true, source: 'Hub' },
    { displayName: 'খাঁটিহাতা বিশ্বরোড মোড় (ঢাকা-সিলেট ও কুমিল্লা হাইওয়ে)', nameBn: 'বিশ্বরোড ব্রাহ্মণবাড়িয়া', nameEn: 'Bishwa Road Brahmanbaria', latitude: 23.9985, longitude: 91.0785, district: 'Brahmanbaria', thana: 'Sarail', isHub: true, source: 'Hub' }
  ],
  chandpur: [
    { displayName: 'চাঁদপুর কেন্দ্রীয় বাস টার্মিনাল ও শপথ চত্বর', nameBn: 'চাঁদপুর বাস টার্মিনাল', nameEn: 'Chandpur Bus Terminal', latitude: 23.2285, longitude: 90.6612, district: 'Chandpur', thana: 'Chandpur Sadar', isHub: true, source: 'Hub' },
    { displayName: 'চাঁদপুর ত্রিনদী মোহনা ও কেন্দ্রীয় লঞ্চ টার্মিনাল', nameBn: 'চাঁদপুর লঞ্চ ঘাট', nameEn: 'Chandpur Launch Ghat', latitude: 23.2385, longitude: 90.6485, district: 'Chandpur', thana: 'Chandpur Sadar', isHub: true, source: 'Hub' }
  ],
  noakhali: [
    { displayName: 'সোনাপুর জিরো পয়েন্ট ও বাস টার্মিনাল, নোয়াখালী', nameBn: 'সোনাপুর জিরো পয়েন্ট', nameEn: 'Sonapur Zero Point', latitude: 22.8285, longitude: 91.0985, district: 'Noakhali', thana: 'Noakhali Sadar', isHub: true, source: 'Hub' },
    { displayName: 'চৌমুহনী চৌরাস্তা মোড় ও বড় বাজার, নোয়াখালী', nameBn: 'চৌমুহনী চৌরাস্তা', nameEn: 'Chowmuhani Chowrasta', latitude: 22.9412, longitude: 91.1012, district: 'Noakhali', thana: 'Begumganj', isHub: true, source: 'Hub' }
  ],
  lakshmipur: [
    { displayName: 'ঝুমুর সিনেমা হল মোড় ও কেন্দ্রীয় বাস টার্মিনাল, লক্ষ্মীপুর', nameBn: 'ঝুমুর মোড় লক্ষ্মীপুর', nameEn: 'Jhumur Mor Lakshmipur', latitude: 22.9485, longitude: 90.8385, district: 'Lakshmipur', thana: 'Lakshmipur Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মজুচৌধুরীর হাট মেঘনা ফেরি ঘাট, লক্ষ্মীপুর', nameBn: 'মজুচৌধুরীর হাট', nameEn: 'Moju Chowdhury Hat', latitude: 22.8812, longitude: 90.7585, district: 'Lakshmipur', thana: 'Lakshmipur Sadar', isHub: true, source: 'Hub' }
  ],
  bandarban: [
    { displayName: 'বান্দরবান কেন্দ্রীয় বাস স্টেশন ও ট্রাফিক মোড়', nameBn: 'বান্দরবান বাস স্টেশন', nameEn: 'Bandarban Bus Station', latitude: 22.1985, longitude: 92.2145, district: 'Bandarban', thana: 'Bandarban Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মেঘলা পর্যটন কমপ্লেক্স গেট, বান্দরবান', nameBn: 'মেঘলা পর্যটন কমপ্লেক্স', nameEn: 'Meghla Bandarban', latitude: 22.2185, longitude: 92.1885, district: 'Bandarban', thana: 'Bandarban Sadar', isHub: true, source: 'Hub' }
  ],
  khagrachhari: [
    { displayName: 'শাপলা চত্বর ও পৌর বাজার, খাগড়াছড়ি', nameBn: 'খাগড়াছড়ি শাপলা চত্বর', nameEn: 'Khagrachhari Shapla Chattar', latitude: 23.1145, longitude: 91.9812, district: 'Khagrachhari', thana: 'Khagrachhari Sadar', isHub: true, source: 'Hub' },
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল ও সাজেক জিপ স্টেশন, খাগড়াছড়ি', nameBn: 'খাগড়াছড়ি বাস টার্মিনাল', nameEn: 'Khagrachhari Bus Terminal', latitude: 23.1285, longitude: 91.9885, district: 'Khagrachhari', thana: 'Khagrachhari Sadar', isHub: true, source: 'Hub' }
  ],
  moulvibazar: [
    { displayName: 'শ্রীমঙ্গল চৌমুহনী মোড় ও চা বাগান এলাকা, মৌলভীবাজার', nameBn: 'শ্রীমঙ্গল চৌমুহনী', nameEn: 'Sreemangal Choumuhani', latitude: 24.3085, longitude: 91.7312, district: 'Moulvibazar', thana: 'Sreemangal', isHub: true, source: 'Hub' },
    { displayName: 'কুসুমবাগ মোড় ও কেন্দ্রীয় বাস স্ট্যান্ড, মৌলভীবাজার', nameBn: 'কুসুমবাগ মৌলভীবাজার', nameEn: 'Kusumbag Moulvibazar', latitude: 24.4885, longitude: 91.7712, district: 'Moulvibazar', thana: 'Moulvibazar Sadar', isHub: true, source: 'Hub' }
  ],
  habiganj: [
    { displayName: 'শায়েস্তাগঞ্জ নতুন ব্রিজ ও ঢাকা-সিলেট হাইওয়ে মোড়, হবিগঞ্জ', nameBn: 'শায়েস্তাগঞ্জ নতুন ব্রিজ', nameEn: 'Shaistaganj Notun Bridge', latitude: 24.2712, longitude: 91.4785, district: 'Habiganj', thana: 'Shaistaganj', isHub: true, source: 'Hub' },
    { displayName: 'পুরাতন বাস স্ট্যান্ড ও চৌধুরী বাজার, হবিগঞ্জ', nameBn: 'হবিগঞ্জ পুরাতন বাস স্ট্যান্ড', nameEn: 'Habiganj Old Bus Stand', latitude: 24.3785, longitude: 91.4112, district: 'Habiganj', thana: 'Habiganj Sadar', isHub: true, source: 'Hub' }
  ],
  sunamganj: [
    { displayName: 'পুরাতন বাস স্টেশন ও আলফাত স্কয়ার, সুনামগঞ্জ', nameBn: 'সুনামগঞ্জ পুরাতন বাস স্ট্যান্ড', nameEn: 'Sunamganj Old Bus Stand', latitude: 25.0685, longitude: 91.4012, district: 'Sunamganj', thana: 'Sunamganj Sadar', isHub: true, source: 'Hub' },
    { displayName: 'নতুন বাস টার্মিনাল ও আব্দুজ জহুর সেতু, সুনামগঞ্জ', nameBn: 'নতুন বাস টার্মিনাল সুনামগঞ্জ', nameEn: 'Sunamganj New Bus Terminal', latitude: 25.0745, longitude: 91.3885, district: 'Sunamganj', thana: 'Sunamganj Sadar', isHub: true, source: 'Hub' }
  ],
  pabna: [
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল ও এডওয়ার্ড কলেজ গেট, পাবনা', nameBn: 'পাবনা কেন্দ্রীয় বাস টার্মিনাল', nameEn: 'Pabna Central Bus Terminal', latitude: 24.0112, longitude: 89.2445, district: 'Pabna', thana: 'Pabna Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ঈশ্বরদী জংশন ও রূপপুর মোড়, পাবনা', nameBn: 'ঈশ্বরদী রেলওয়ে জংশন', nameEn: 'Ishwardi Railway Junction', latitude: 24.1385, longitude: 89.0685, district: 'Pabna', thana: 'Ishwardi', isHub: true, source: 'Hub' }
  ],
  sirajganj: [
    { displayName: 'হাটিকুমরুল গোলচত্বর (উত্তরবঙ্গ মহাসড়ক মোড়), সিরাজগঞ্জ', nameBn: 'হাটিকুমরুল গোলচত্বর', nameEn: 'Hatikumrul Circle', latitude: 24.4185, longitude: 89.5512, district: 'Sirajganj', thana: 'Ullapara', isHub: true, source: 'Hub' },
    { displayName: 'বাজার স্টেশন ও এস এস রোড, সিরাজগঞ্জ', nameBn: 'সিরাজগঞ্জ বাজার স্টেশন', nameEn: 'Sirajganj Bazar Station', latitude: 24.4585, longitude: 89.7112, district: 'Sirajganj', thana: 'Sirajganj Sadar', isHub: true, source: 'Hub' }
  ],
  naogaon: [
    { displayName: 'বালুডাঙ্গা আন্তঃউপজেলা বাস টার্মিনাল, নওগাঁ', nameBn: 'নওগাঁ বালুডাঙ্গা বাস টার্মিনাল', nameEn: 'Baludanga Bus Terminal Naogaon', latitude: 24.8012, longitude: 88.9385, district: 'Naogaon', thana: 'Naogaon Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মুক্তির মোড় ও ঢাকা বাস টার্মিনাল, নওগাঁ', nameBn: 'মুক্তির মোড় নওগাঁ', nameEn: 'Muktir Mor Naogaon', latitude: 24.7912, longitude: 88.9285, district: 'Naogaon', thana: 'Naogaon Sadar', isHub: true, source: 'Hub' }
  ],
  natore: [
    { displayName: 'মাদ্রাসা মোড় ও কেন্দ্রীয় বাস টার্মিনাল, নাটোর', nameBn: 'নাটোর মাদ্রাসা মোড়', nameEn: 'Natore Madrasa Mor', latitude: 24.4185, longitude: 88.9412, district: 'Natore', thana: 'Natore Sadar', isHub: true, source: 'Hub' },
    { displayName: 'বনপাড়া বাইপাস গোলচত্বর মোড়, নাটোর', nameBn: 'বনপাড়া বাইপাস', nameEn: 'Bonpara Bypass', latitude: 24.2885, longitude: 89.0785, district: 'Natore', thana: 'Baraigram', isHub: true, source: 'Hub' }
  ],
  chapainawabganj: [
    { displayName: 'শান্তিমোড় ও বিশ্বরোড বাস টার্মিনাল, চাঁপাইনবাবগঞ্জ', nameBn: 'শান্তিমোড় চাঁপাইনবাবগঞ্জ', nameEn: 'Shantimor Chapainawabganj', latitude: 24.5985, longitude: 88.2712, district: 'Chapainawabganj', thana: 'Chapainawabganj Sadar', isHub: true, source: 'Hub' }
  ],
  joypurhat: [
    { displayName: 'জিরো পয়েন্ট ও নতুন বাস টার্মিনাল, জয়পুরহাট', nameBn: 'জয়পুরহাট জিরো পয়েন্ট', nameEn: 'Joypurhat Zero Point', latitude: 25.1045, longitude: 89.0212, district: 'Joypurhat', thana: 'Joypurhat Sadar', isHub: true, source: 'Hub' }
  ],
  jashore: [
    { displayName: 'মনিহার সিনেমা হল মোড় ও কেন্দ্রীয় বাস টার্মিনাল, যশোর', nameBn: 'মনিহার মোড় যশোর', nameEn: 'Monihar Mor Jashore', latitude: 23.1612, longitude: 89.2215, district: 'Jashore', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'চাঁচড়া চেকপোস্ট মোড় (বেনাপোল রোড), যশোর', nameBn: 'চাঁচড়া চেকপোস্ট', nameEn: 'Chanchra Checkpost', latitude: 23.1512, longitude: 89.1885, district: 'Jashore', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'বেনাপোল আন্তর্জাতিক স্থলবন্দর ও বাস টার্মিনাল', nameBn: 'বেনাপোল বন্দর', nameEn: 'Benapole Port', latitude: 23.0385, longitude: 88.8985, district: 'Jashore', thana: 'Sharsha', isHub: true, source: 'Hub' }
  ],
  kushtia: [
    { displayName: 'মজমপুর রেলগেট মোড় ও এনএস রোড, কুষ্টিয়া', nameBn: 'মজমপুর গেট কুষ্টিয়া', nameEn: 'Mojompur Gate Kushtia', latitude: 23.9045, longitude: 89.1245, district: 'Kushtia', thana: 'Kushtia Sadar', isHub: true, source: 'Hub' },
    { displayName: 'চৌড়হাস মোড় ও কেন্দ্রীয় বাস টার্মিনাল, কুষ্টিয়া', nameBn: 'চৌড়হাস মোড়', nameEn: 'Chourhas Mor', latitude: 23.8885, longitude: 89.1112, district: 'Kushtia', thana: 'Kushtia Sadar', isHub: true, source: 'Hub' }
  ],
  jhenaidah: [
    { displayName: 'পায়রা চত্বর ও আরাপপুর বাস স্ট্যান্ড, ঝিনাইদহ', nameBn: 'পায়রা চত্বর ঝিনাইদহ', nameEn: 'Payra Chattar Jhenaidah', latitude: 23.5412, longitude: 89.1785, district: 'Jhenaidah', thana: 'Jhenaidah Sadar', isHub: true, source: 'Hub' }
  ],
  satkhira: [
    { displayName: 'খুলনা রোড মোড় ও কেন্দ্রীয় বাস টার্মিনাল, সাতক্ষীরা', nameBn: 'খুলনা রোড মোড় সাতক্ষীরা', nameEn: 'Khulna Road Mor Satkhira', latitude: 22.7212, longitude: 89.0785, district: 'Satkhira', thana: 'Satkhira Sadar', isHub: true, source: 'Hub' }
  ],
  bagerhat: [
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল ও ষাটগম্বুজ মসজিদ মোড়, বাগেরহাট', nameBn: 'বাগেরহাট কেন্দ্রীয় বাস টার্মিনাল', nameEn: 'Bagerhat Central Bus Terminal', latitude: 22.6585, longitude: 89.7912, district: 'Bagerhat', thana: 'Bagerhat Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মোংলা পোর্ট পৌরসভা ও বাস স্ট্যান্ড, বাগেরহাট', nameBn: 'মোংলা পোর্ট', nameEn: 'Mongla Port', latitude: 22.4885, longitude: 89.6012, district: 'Bagerhat', thana: 'Mongla', isHub: true, source: 'Hub' }
  ],
  chuadanga: [
    { displayName: 'বড় বাজার মোড় ও কেন্দ্রীয় বাস টার্মিনাল, চুয়াডাঙ্গা', nameBn: 'চুয়াডাঙ্গা বড় বাজার', nameEn: 'Chuadanga Borobazar', latitude: 23.6425, longitude: 88.8485, district: 'Chuadanga', thana: 'Chuadanga Sadar', isHub: true, source: 'Hub' }
  ],
  meherpur: [
    { displayName: 'হোটেল বাজার মোড় ও মুজিবনগর রোড, মেহেরপুর', nameBn: 'মেহেরপুর হোটেল বাজার', nameEn: 'Hotel Bazar Meherpur', latitude: 23.7685, longitude: 88.6385, district: 'Meherpur', thana: 'Meherpur Sadar', isHub: true, source: 'Hub' }
  ],
  magura: [
    { displayName: 'ঢাকা রোড মোড় ও ভায়না মোড় বাস টার্মিনাল, মাগুরা', nameBn: 'মাগুরা ঢাকা রোড মোড়', nameEn: 'Magura Dhaka Road Mor', latitude: 23.4912, longitude: 89.4245, district: 'Magura', thana: 'Magura Sadar', isHub: true, source: 'Hub' }
  ],
  narail: [
    { displayName: 'রূপগঞ্জ মোড় ও পুরাতন বাস টার্মিনাল, নড়াইল', nameBn: 'রূপগঞ্জ মোড় নড়াইল', nameEn: 'Rupganj Mor Narail', latitude: 23.1785, longitude: 89.5185, district: 'Narail', thana: 'Narail Sadar', isHub: true, source: 'Hub' }
  ],
  patuakhali: [
    { displayName: 'পৌর কেন্দ্রীয় বাস টার্মিনাল, পটুয়াখালী', nameBn: 'পটুয়াখালী বাস টার্মিনাল', nameEn: 'Patuakhali Bus Terminal', latitude: 22.3645, longitude: 90.3345, district: 'Patuakhali', thana: 'Patuakhali Sadar', isHub: true, source: 'Hub' },
    { displayName: 'কুয়াকাটা সমুদ্র সৈকত জিরো পয়েন্ট ও বাস স্ট্যান্ড', nameBn: 'কুয়াকাটা জিরো পয়েন্ট', nameEn: 'Kuakata Zero Point', latitude: 21.8185, longitude: 90.1185, district: 'Patuakhali', thana: 'Kalapara', isHub: true, source: 'Hub' }
  ],
  bhola: [
    { displayName: 'খেয়াঘাট মোড় ও বীরশ্রেষ্ঠ মোস্তফা কামাল বাস টার্মিনাল, ভোলা', nameBn: 'ভোলা খেয়াঘাট মোড়', nameEn: 'Bhola Kheyaghat Mor', latitude: 22.6912, longitude: 90.6512, district: 'Bhola', thana: 'Bhola Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ইলিশা লঞ্চ ঘাট ও ফেরি টার্মিনাল, ভোলা', nameBn: 'ইলিশা ঘাট', nameEn: 'Ilisha Ghat Bhola', latitude: 22.7845, longitude: 90.7185, district: 'Bhola', thana: 'Bhola Sadar', isHub: true, source: 'Hub' }
  ],
  pirojpur: [
    { displayName: 'পুরাতন বাস স্ট্যান্ড ও বলেশ্বর সেতু মোড়, পিরোজপুর', nameBn: 'পিরোজপুর পুরাতন বাস স্ট্যান্ড', nameEn: 'Pirojpur Old Bus Stand', latitude: 22.5885, longitude: 89.9785, district: 'Pirojpur', thana: 'Pirojpur Sadar', isHub: true, source: 'Hub' }
  ],
  barguna: [
    { displayName: 'পৌর কেন্দ্রীয় বাস টার্মিনাল ও ক্রোক মোড়, বরগুনা', nameBn: 'বরগুনা পৌর বাস টার্মিনাল', nameEn: 'Barguna Bus Terminal', latitude: 22.1012, longitude: 90.1185, district: 'Barguna', thana: 'Barguna Sadar', isHub: true, source: 'Hub' }
  ],
  jhalokathi: [
    { displayName: 'পৌর বাস টার্মিনাল ও গাবখান সেতু মোড়, ঝালকাঠি', nameBn: 'ঝালকাঠি বাস টার্মিনাল', nameEn: 'Jhalokathi Bus Terminal', latitude: 22.6445, longitude: 90.2012, district: 'Jhalokathi', thana: 'Jhalokathi Sadar', isHub: true, source: 'Hub' }
  ],
  dinajpur: [
    { displayName: 'চারু বাবুর মোড় ও ফুলবাড়ী বাস স্ট্যান্ড, দিনাজপুর', nameBn: 'দিনাজপুর চারু বাবুর মোড়', nameEn: 'Charu Babur Mor Dinajpur', latitude: 25.6285, longitude: 88.6412, district: 'Dinajpur', thana: 'Dinajpur Sadar', isHub: true, source: 'Hub' }
  ],
  kurigram: [
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল ও শাপলা চত্বর, কুড়িগ্রাম', nameBn: 'কুড়িগ্রাম কেন্দ্রীয় বাস টার্মিনাল', nameEn: 'Kurigram Central Bus Terminal', latitude: 25.8112, longitude: 89.6412, district: 'Kurigram', thana: 'Kurigram Sadar', isHub: true, source: 'Hub' }
  ],
  gaibandha: [
    { displayName: 'ডিবি রোড ১ নং রেলগেট ও কেন্দ্রীয় বাস টার্মিনাল, গাইবান্ধা', nameBn: 'গাইবান্ধা ডিবি রোড', nameEn: 'DB Road Gaibandha', latitude: 25.3312, longitude: 89.5485, district: 'Gaibandha', thana: 'Gaibandha Sadar', isHub: true, source: 'Hub' }
  ],
  nilphamari: [
    { displayName: 'সৈয়দপুর কেন্দ্রীয় বাস টার্মিনাল ও বিমানবন্দর মোড়, নীলফামারী', nameBn: 'সৈয়দপুর বাস টার্মিনাল', nameEn: 'Saidpur Bus Terminal', latitude: 25.7785, longitude: 88.8985, district: 'Nilphamari', thana: 'Saidpur', isHub: true, source: 'Hub' },
    { displayName: 'চৌরঙ্গী মোড় ও বড় বাজার, নীলফামারী', nameBn: 'নীলফামারী চৌরঙ্গী মোড়', nameEn: 'Nilphamari Chowrangi Mor', latitude: 25.9385, longitude: 88.8512, district: 'Nilphamari', thana: 'Nilphamari Sadar', isHub: true, source: 'Hub' }
  ],
  lalmonirhat: [
    { displayName: 'মিশন মোড় ও কেন্দ্রীয় বাস টার্মিনাল, লালমনিরহাট', nameBn: 'মিশন মোড় লালমনিরহাট', nameEn: 'Mission Mor Lalmonirhat', latitude: 25.9985, longitude: 89.2812, district: 'Lalmonirhat', thana: 'Lalmonirhat Sadar', isHub: true, source: 'Hub' }
  ],
  thakurgaon: [
    { displayName: 'পুরাতন বাস স্ট্যান্ড ও সত্যপীর ব্রিজ মোড়, ঠাকুরগাঁও', nameBn: 'ঠাকুরগাঁও পুরাতন বাস স্ট্যান্ড', nameEn: 'Thakurgaon Old Bus Stand', latitude: 26.0385, longitude: 88.4685, district: 'Thakurgaon', thana: 'Thakurgaon Sadar', isHub: true, source: 'Hub' }
  ],
  panchagarh: [
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল ও চৌরঙ্গী মোড়, পঞ্চগড়', nameBn: 'পঞ্চগড় কেন্দ্রীয় বাস টার্মিনাল', nameEn: 'Panchagarh Bus Terminal', latitude: 26.3485, longitude: 88.5585, district: 'Panchagarh', thana: 'Panchagarh Sadar', isHub: true, source: 'Hub' },
    { displayName: 'বাংলাবান্ধা স্থলবন্দর ও জিরো পয়েন্ট, পঞ্চগড়', nameBn: 'বাংলাবান্ধা জিরো পয়েন্ট', nameEn: 'Banglabandha Zero Point', latitude: 26.6485, longitude: 88.3585, district: 'Panchagarh', thana: 'Tentulia', isHub: true, source: 'Hub' }
  ],
  jamalpur: [
    { displayName: 'স্টেশন রোড ও দয়াময়ী মোড় বাস টার্মিনাল, জামালপুর', nameBn: 'জামালপুর স্টেশন রোড', nameEn: 'Jamalpur Station Road', latitude: 24.9412, longitude: 89.9412, district: 'Jamalpur', thana: 'Jamalpur Sadar', isHub: true, source: 'Hub' }
  ],
  netrokona: [
    { displayName: 'রাজুর বাজার কেন্দ্রীয় বাস টার্মিনাল, নেত্রকোণা', nameBn: 'রাজুর বাজার বাস টার্মিনাল', nameEn: 'Rajur Bazar Netrokona', latitude: 24.8785, longitude: 90.7312, district: 'Netrokona', thana: 'Netrokona Sadar', isHub: true, source: 'Hub' }
  ],
  sherpur: [
    { displayName: 'খোয়ারপাড় মোড় ও পৌর বাস টার্মিনাল, শেরপুর', nameBn: 'খোয়ারপাড় মোড় শেরপুর', nameEn: 'Khowarpar Mor Sherpur', latitude: 25.0245, longitude: 90.0185, district: 'Sherpur', thana: 'Sherpur Sadar', isHub: true, source: 'Hub' }
  ]
};
