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
  rangamati: [
    { displayName: 'বনরূপা বাজার, রাঙ্গামাটি', nameBn: 'বনরূপা বাজার', nameEn: 'Bonorupa Bazar', latitude: 22.655477, longitude: 92.178924, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'রিজার্ভ বাজার, রাঙ্গামাটি', nameBn: 'রিজার্ভ বাজার', nameEn: 'Reserve Bazar', latitude: 22.646200, longitude: 92.186500, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'তবলছড়ি বাজার, রাঙ্গামাটি', nameBn: 'তবলছড়ি', nameEn: 'Tabalchhari', latitude: 22.637300, longitude: 92.181800, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'ভেদভেদী বাস টার্মিনাল, রাঙ্গামাটি', nameBn: 'ভেদভেদী বাস টার্মিনাল', nameEn: 'Bhedbhedi Bus Terminal', latitude: 22.659800, longitude: 92.164500, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'আসামবস্তি, রাঙ্গামাটি', nameBn: 'আসামবস্তি', nameEn: 'Asambosti', latitude: 22.641200, longitude: 92.193400, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'মানিকছড়ি, রাঙ্গামাটি', nameBn: 'মানিকছড়ি', nameEn: 'Manikchhari', latitude: 22.668500, longitude: 92.138700, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' },
    { displayName: 'কাপ্তাই নতুন বাজার, রাঙ্গামাটি', nameBn: 'কাপ্তাই নতুন বাজার', nameEn: 'Kaptai Notun Bazar', latitude: 22.496200, longitude: 92.222900, district: 'Rangamati', thana: 'Kaptai', isHub: true, source: 'Hub' },
    { displayName: 'হাসপাতাল রোড, রাঙ্গামাটি', nameBn: 'হাসপাতাল রোড', nameEn: 'Hospital Road', latitude: 22.658700, longitude: 92.168200, district: 'Rangamati', thana: 'Rangamati Sadar', isHub: true, source: 'Hub' }
  ],
  chattogram: [
    { displayName: 'জিইসি মোড়, চট্টগ্রাম', nameBn: 'জিইসি মোড়', nameEn: 'GEC Circle', latitude: 22.3585, longitude: 91.8222, district: 'Chattogram', thana: 'Panchlaish', isHub: true, source: 'Hub' },
    { displayName: 'বহদ্দারহাট বাস টার্মিনাল, চট্টগ্রাম', nameBn: 'বহদ্দারহাট বাস টার্মিনাল', nameEn: 'Bahaddarhat Bus Terminal', latitude: 22.3683, longitude: 91.8443, district: 'Chattogram', thana: 'Chandgaon', isHub: true, source: 'Hub' },
    { displayName: 'অলংকার মোড়, চট্টগ্রাম', nameBn: 'অলংকার মোড়', nameEn: 'Alankar Circle', latitude: 22.3705, longitude: 91.7828, district: 'Chattogram', thana: 'Pahartali', isHub: true, source: 'Hub' },
    { displayName: 'এ কে খান বাস টার্মিনাল, চট্টগ্রাম', nameBn: 'এ কে খান গেট', nameEn: 'A.K. Khan Gate', latitude: 22.3789, longitude: 91.7778, district: 'Chattogram', thana: 'Pahartali', isHub: true, source: 'Hub' },
    { displayName: 'নিউ মার্কেট মোড়, চট্টগ্রাম', nameBn: 'নিউ মার্কেট', nameEn: 'New Market', latitude: 22.3353, longitude: 91.8329, district: 'Chattogram', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম', nameBn: 'আগ্রাবাদ', nameEn: 'Agrabad C/A', latitude: 22.3276, longitude: 91.8123, district: 'Chattogram', thana: 'Double Mooring', isHub: true, source: 'Hub' }
  ],
  coxsbazar: [
    { displayName: 'কলাতলী সুগন্ধা মোড়, কক্সবাজার', nameBn: 'কলাতলী মোড়', nameEn: 'Kolatoli Circle', latitude: 21.4192, longitude: 91.9839, district: "Cox's Bazar", thana: "Cox's Bazar Sadar", isHub: true, source: 'Hub' },
    { displayName: 'লাবণী বিচ পয়েন্ট, কক্সবাজার', nameBn: 'লাবণী পয়েন্ট', nameEn: 'Laboni Point', latitude: 21.4325, longitude: 91.9721, district: "Cox's Bazar", thana: "Cox's Bazar Sadar", isHub: true, source: 'Hub' },
    { displayName: 'কেন্দ্রীয় বাস টার্মিনাল (লারপাড়া), কক্সবাজার', nameBn: 'কক্সবাজার বাস টার্মিনাল', nameEn: 'Coxs Bazar Bus Terminal', latitude: 21.4398, longitude: 92.0084, district: "Cox's Bazar", thana: "Cox's Bazar Sadar", isHub: true, source: 'Hub' },
    { displayName: 'ঝাউতলা মোড়, কক্সবাজার', nameBn: 'ঝাউতলা', nameEn: 'Jhautala', latitude: 21.4372, longitude: 91.9814, district: "Cox's Bazar", thana: "Cox's Bazar Sadar", isHub: true, source: 'Hub' }
  ],
  sylhet: [
    { displayName: 'কদমতলী কেন্দ্রীয় বাস টার্মিনাল, সিলেট', nameBn: 'কদমতলী বাস টার্মিনাল', nameEn: 'Kadamtali Bus Terminal', latitude: 24.8821, longitude: 91.8741, district: 'Sylhet', thana: 'Dakshin Surma', isHub: true, source: 'Hub' },
    { displayName: 'আম্বরখানা পয়েন্ট, সিলেট', nameBn: 'আম্বরখানা', nameEn: 'Amberkhana', latitude: 24.9082, longitude: 91.8703, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' },
    { displayName: 'জিন্দাবাজার পয়েন্ট, সিলেট', nameBn: 'জিন্দাবাজার', nameEn: 'Zindabazar', latitude: 24.8963, longitude: 91.8715, district: 'Sylhet', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'চৌহাট্টা পয়েন্ট, সিলেট', nameBn: 'চৌহাট্টা', nameEn: 'Chouhatta', latitude: 24.9008, longitude: 91.8696, district: 'Sylhet', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'কুমারগাঁও বাস টার্মিনাল, সিলেট', nameBn: 'কুমারগাঁও বাস টার্মিনাল', nameEn: 'Kumargaon Bus Terminal', latitude: 24.9097, longitude: 91.8294, district: 'Sylhet', thana: 'Sylhet Sadar', isHub: true, source: 'Hub' }
  ],
  rajshahi: [
    { displayName: 'শিরোইল কেন্দ্রীয় বাস টার্মিনাল, রাজশাহী', nameBn: 'শিরোইল বাস টার্মিনাল', nameEn: 'Shiroil Bus Terminal', latitude: 24.3725, longitude: 88.6015, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' },
    { displayName: 'সাহেব বাজার জিরো পয়েন্ট, রাজশাহী', nameBn: 'সাহেব বাজার জিরো পয়েন্ট', nameEn: 'Saheb Bazar Zero Point', latitude: 24.3638, longitude: 88.6012, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' },
    { displayName: 'তালাইমারী মোড়, রাজশাহী', nameBn: 'তালাইমারী', nameEn: 'Talaimari', latitude: 24.3642, longitude: 88.6258, district: 'Rajshahi', thana: 'Motihar', isHub: true, source: 'Hub' },
    { displayName: 'ভদ্রা মোড়, রাজশাহী', nameBn: 'ভদ্রা মোড়', nameEn: 'Bhadra Circle', latitude: 24.3739, longitude: 88.6186, district: 'Rajshahi', thana: 'Boalia', isHub: true, source: 'Hub' }
  ],
  khulna: [
    { displayName: 'সোনাডাঙ্গা কেন্দ্রীয় বাস টার্মিনাল, খুলনা', nameBn: 'সোনাডাঙ্গা বাস টার্মিনাল', nameEn: 'Sonadanga Bus Terminal', latitude: 22.8228, longitude: 89.5401, district: 'Khulna', thana: 'Sonadanga', isHub: true, source: 'Hub' },
    { displayName: 'শিববাড়ি মোড়, খুলনা', nameBn: 'শিববাড়ি মোড়', nameEn: 'Shibbari Circle', latitude: 22.8225, longitude: 89.5539, district: 'Khulna', thana: 'Sonadanga', isHub: true, source: 'Hub' },
    { displayName: 'দৌলতপুর বাস স্ট্যান্ড, খুলনা', nameBn: 'দৌলতপুর', nameEn: 'Daulatpur', latitude: 22.8794, longitude: 89.5244, district: 'Khulna', thana: 'Daulatpur', isHub: true, source: 'Hub' },
    { displayName: 'ডাকবাংলো মোড়, খুলনা', nameBn: 'ডাকবাংলো মোড়', nameEn: 'Dakbangla Circle', latitude: 22.8122, longitude: 89.5621, district: 'Khulna', thana: 'Khulna Sadar', isHub: true, source: 'Hub' }
  ],
  barishal: [
    { displayName: 'নথুল্লাবাদ কেন্দ্রীয় বাস টার্মিনাল, বরিশাল', nameBn: 'নথুল্লাবাদ বাস টার্মিনাল', nameEn: 'Nathullabad Bus Terminal', latitude: 22.7161, longitude: 90.3522, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'রূপাতলী বাস টার্মিনাল, বরিশাল', nameBn: 'রূপাতলী বাস টার্মিনাল', nameEn: 'Rupatali Bus Terminal', latitude: 22.6789, longitude: 90.3442, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' },
    { displayName: 'সদর রোড চৌমাথা, বরিশাল', nameBn: 'সদর রোড', nameEn: 'Sadar Road', latitude: 22.7012, longitude: 90.3705, district: 'Barishal', thana: 'Kotwali', isHub: true, source: 'Hub' }
  ],
  dhaka: [
    { displayName: 'মিরপুর ১০ গোলচত্বর, ঢাকা', nameBn: 'মিরপুর ১০', nameEn: 'Mirpur 10', latitude: 23.8069, longitude: 90.3687, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'ফার্মগেট মোড়, ঢাকা', nameBn: 'ফার্মগেট', nameEn: 'Farmgate', latitude: 23.7561, longitude: 90.3872, district: 'Dhaka', thana: 'Tejgaon', isHub: true, source: 'Hub' },
    { displayName: 'উত্তরা রাজলক্ষ্মী, ঢাকা', nameBn: 'উত্তরা', nameEn: 'Uttara', latitude: 23.8681, longitude: 90.3995, district: 'Dhaka', thana: 'Uttara', isHub: true, source: 'Hub' },
    { displayName: 'মতিঝিল শাপলা চত্বর, ঢাকা', nameBn: 'মতিঝিল', nameEn: 'Motijheel', latitude: 23.7289, longitude: 90.4182, district: 'Dhaka', thana: 'Motijheel', isHub: true, source: 'Hub' },
    { displayName: 'মহাখালী বাস টার্মিনাল, ঢাকা', nameBn: 'মহাখালী', nameEn: 'Mohakhali', latitude: 23.7778, longitude: 90.4005, district: 'Dhaka', thana: 'Mohakhali', isHub: true, source: 'Hub' },
    { displayName: 'শাহবাগ মোড়, ঢাকা', nameBn: 'শাহবাগ', nameEn: 'Shahbagh', latitude: 23.7383, longitude: 90.3957, district: 'Dhaka', thana: 'Shahbagh', isHub: true, source: 'Hub' },
    { displayName: 'ধানমন্ডি ২৭ (সোবহানবাগ), ঢাকা', nameBn: 'ধানমন্ডি ২৭', nameEn: 'Dhanmondi 27', latitude: 23.7534, longitude: 90.3768, district: 'Dhaka', thana: 'Dhanmondi', isHub: true, source: 'Hub' },
    { displayName: 'গুলশান ২ গোলচত্বর, ঢাকা', nameBn: 'গুলশান ২', nameEn: 'Gulshan 2', latitude: 23.7949, longitude: 90.4143, district: 'Dhaka', thana: 'Gulshan', isHub: true, source: 'Hub' },
    { displayName: 'গাবতলী আন্তঃজেলা বাস টার্মিনাল, ঢাকা', nameBn: 'গাবতলী', nameEn: 'Gabtoli', latitude: 23.7828, longitude: 90.3458, district: 'Dhaka', thana: 'Mirpur', isHub: true, source: 'Hub' },
    { displayName: 'সায়েদাবাদ জনপথ মোড়, ঢাকা', nameBn: 'সায়েদাবাদ', nameEn: 'Sayedabad', latitude: 23.7153, longitude: 90.4286, district: 'Dhaka', thana: 'Jatrabari', isHub: true, source: 'Hub' }
  ]
};
