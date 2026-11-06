import { MetroStation, BusRouteInfo } from '../models/transit-guide.model';

export const METRO_LINE_6_STATIONS: MetroStation[] = [
  { id: 'uttara-north', nameBn: 'উত্তরা উত্তর (দিয়াবাড়ী)', nameEn: 'Uttara North', order: 1, aliases: ['uttara north', 'diabari', 'দিয়াবাড়ী', 'উত্তরা উত্তর', 'sector 15', 'সেক্টর ১৫'] },
  { id: 'uttara-center', nameBn: 'উত্তরা সেন্টার', nameEn: 'Uttara Center', order: 2, aliases: ['uttara center', 'উত্তরা সেন্টার', 'sector 17', 'sector 18'] },
  { id: 'uttara-south', nameBn: 'উত্তরা দক্ষিণ', nameEn: 'Uttara South', order: 3, aliases: ['uttara south', 'উত্তরা দক্ষিণ', 'sector 10', 'sector 11'] },
  { id: 'pallabi', nameBn: 'পল্লবী', nameEn: 'Pallabi', order: 4, aliases: ['pallabi', 'পল্লবী', 'mirpur 12', 'মিরপুর ১২', 'purobi', 'পুরবী'] },
  { id: 'mirpur-11', nameBn: 'মিরপুর ১১', nameEn: 'Mirpur 11', order: 5, aliases: ['mirpur 11', 'মিরপুর ১১', 'benarasi polli', 'বেনারসী পল্লী'] },
  { id: 'mirpur-10', nameBn: 'মিরপুর ১০', nameEn: 'Mirpur 10', order: 6, aliases: ['mirpur 10', 'মিরপুর ১০', 'mirpur golchottor', 'মিরপুর গোলচত্বর', 'mirpur stadium', 'মিরপুর স্টেডিয়াম'] },
  { id: 'kazipara', nameBn: 'কাজীপাড়া', nameEn: 'Kazipara', order: 7, aliases: ['kazipara', 'কাজীপাড়া', 'kazi para', 'পশ্চিম কাজীপাড়া'] },
  { id: 'shewrapara', nameBn: 'শেওড়াপাড়া', nameEn: 'Shewrapara', order: 8, aliases: ['shewrapara', 'শেওড়াপাড়া', 'shewra para', 'পশ্চিম শেওড়াপাড়া'] },
  { id: 'agargaon', nameBn: 'আগারগাঁও', nameEn: 'Agargaon', order: 9, aliases: ['agargaon', 'আগারগাঁও', 'passport office', 'পাসপোর্ট অফিস', 'pangu hospital', 'পঙ্গু হাসপাতাল', 'shishu hospital', 'শিশু হাসপাতাল'] },
  { id: 'bijoy-sarani', nameBn: 'বিজয় সরণি', nameEn: 'Bijoy Sarani', order: 10, aliases: ['bijoy sarani', 'বিজয় সরণি', 'bijoy shoroni', 'military museum', 'মিলিটারি মিউজিয়াম', 'pm office'] },
  { id: 'farmgate', nameBn: 'ফার্মগেট', nameEn: 'Farmgate', order: 11, aliases: ['farmgate', 'ফার্মগেট', 'ananda cinema', 'আনন্দ সিনেমা', 'khamarbari', 'খামারবাড়ি', 'tejturi bazar', 'তেজতুরী বাজার'] },
  { id: 'karwan-bazar', nameBn: 'কারওয়ান বাজার', nameEn: 'Karwan Bazar', order: 12, aliases: ['karwan bazar', 'কারওয়ান বাজার', 'kawran bazar', 'petrobangla', 'বাংলামোটর', 'banglamotor', 'panthapath', 'পান্থপথ'] },
  { id: 'shahbagh', nameBn: 'শাহবাগ', nameEn: 'Shahbagh', order: 13, aliases: ['shahbagh', 'শাহবাগ', 'bsmmu', 'পিজি হাসপাতাল', 'dhaka club', 'ঢাকা ক্লাব', 'national museum', 'জাদুঘর'] },
  { id: 'dhaka-university', nameBn: 'ঢাকা বিশ্ববিদ্যালয়', nameEn: 'Dhaka University', order: 14, aliases: ['dhaka university', 'ঢাকা বিশ্ববিদ্যালয়', 'du', 'টিএসসি', 'tsc', 'curzon hall', 'কার্জন হল', 'doyel chottor', 'দোয়েল চত্বর', 'shahid minar', 'শহীদ মিনার'] },
  { id: 'secretariat', nameBn: 'বাংলাদেশ সচিবালয় (প্রেস ক্লাব)', nameEn: 'Bangladesh Secretariat', order: 15, aliases: ['secretariat', 'বাংলাদেশ সচিবালয়', 'press club', 'প্রেস ক্লাব', 'paltan', 'পল্টন', 'bijoynagar', 'বিজয় নগর', 'topkhana', 'তোপখানা'] },
  { id: 'motijheel', nameBn: 'মতিঝিল', nameEn: 'Motijheel', order: 16, aliases: ['motijheel', 'মতিঝিল', 'shapla chottor', 'শাপলা চত্বর', 'dilkusha', 'দিলকুশা', 'dainik bangla', 'দৈনিক বাংলা', 'bangladesh bank', 'বাংলাদেশ ব্যাংক'] }
];

export const DHAKA_BUS_ROUTES: BusRouteInfo[] = [
  {
    nameBn: 'বিহঙ্গ পরিবহন',
    nameEn: 'Bihanga Paribahan',
    stops: ['mirpur 12', 'mirpur 11', 'mirpur 10', 'kazipara', 'shewrapara', 'agargaon', 'bijoy sarani', 'farmgate', 'banglamotor', 'shahbagh', 'paltan', 'motijheel', 'azimpur'],
    stopsBn: ['মিরপুর ১২', 'মিরপুর ১১', 'মিরপুর ১০', 'কাজীপাড়া', 'শেওড়াপাড়া', 'আগারগাঁও', 'বিজয় সরণি', 'ফার্মগেট', 'বাংলামোটর', 'শাহবাগ', 'পল্টন', 'মতিঝিল', 'আজিমপুর']
  },
  {
    nameBn: 'শিখর পরিবহন',
    nameEn: 'Shikor Paribahan',
    stops: ['mirpur 12', 'mirpur 11', 'mirpur 10', 'kazipara', 'shewrapara', 'agargaon', 'farmgate', 'banglamotor', 'shahbagh', 'press club', 'paltan', 'motijheel', 'sayedabad', 'jatrabari'],
    stopsBn: ['মিরপুর ১২', 'মিরপুর ১১', 'মিরপুর ১০', 'কাজীপাড়া', 'শেওড়াপাড়া', 'আগারগাঁও', 'ফার্মগেট', 'বাংলামোটর', 'শাহবাগ', 'প্রেস ক্লাব', 'পল্টন', 'মতিঝিল', 'সায়েদাবাদ', 'যাত্রাবাড়ী']
  },
  {
    nameBn: 'বিকল্প অটো সার্ভিস',
    nameEn: 'Bikolpo Auto Service',
    stops: ['mirpur 14', 'mirpur 10', 'kazipara', 'shewrapara', 'agargaon', 'farmgate', 'banglamotor', 'shahbagh', 'paltan', 'motijheel', 'sayedabad'],
    stopsBn: ['মিরপুর ১৪', 'মিরপুর ১০', 'কাজীপাড়া', 'শেওড়াপাড়া', 'আগারগাঁও', 'ফার্মগেট', 'বাংলামোটর', 'শাহবাগ', 'পল্টন', 'মতিঝিল', 'সায়েদাবাদ']
  },
  {
    nameBn: 'মিরপুর মেট্রো সার্ভিস',
    nameEn: 'Mirpur Metro Service',
    stops: ['mirpur 1', 'mirpur 2', 'mirpur 10', 'kazipara', 'shewrapara', 'agargaon', 'farmgate', 'shahbagh', 'press club', 'motijheel'],
    stopsBn: ['মিরপুর ১', 'মিরপুর ২', 'মিরপুর ১০', 'কাজীপাড়া', 'শেওড়াপাড়া', 'আগারগাঁও', 'ফার্মগেট', 'শাহবাগ', 'প্রেস ক্লাব', 'মতিঝিল']
  },
  {
    nameBn: 'প্রজাপতি পরিবহন',
    nameEn: 'Projapoti Paribahan',
    stops: ['mohammadpur', 'shyamoli', 'technical', 'mirpur 1', 'mirpur 2', 'mirpur 10', 'mirpur 14', 'ecb', 'kalshi', 'airport', 'abdullahpur'],
    stopsBn: ['মোহাম্মদপুর', 'শ্যামলী', 'টেকনিক্যাল', 'মিরপুর ১', 'মিরপুর ২', 'মিরপুর ১০', 'মিরপুর ১৪', 'ইসিবি', 'কালশী', 'এয়ারপোর্ট', 'আবদুল্লাহপুর']
  },
  {
    nameBn: 'পরিস্থান পরিবহন',
    nameEn: 'Paristhan Paribahan',
    stops: ['ghatarchar', 'mohammadpur', 'asad gate', 'shyamoli', 'technical', 'mirpur 1', 'mirpur 10', 'ecb', 'airport', 'abdullahpur'],
    stopsBn: ['ঘাটারচর', 'মোহাম্মদপুর', 'আসাদ গেট', 'শ্যামলী', 'টেকনিক্যাল', 'মিরপুর ১', 'মিরপুর ১০', 'ইসিবি', 'এয়ারপোর্ট', 'আবদুল্লাহপুর']
  },
  {
    nameBn: 'তুরাগ পরিবহন',
    nameEn: 'Turag Paribahan',
    stops: ['jatrabari', 'sayedabad', 'malibagh', 'rampura', 'badda', 'natun bazar', 'kuril', 'khilkhet', 'airport', 'uttara', 'tongi'],
    stopsBn: ['যাত্রাবাড়ী', 'সায়েদাবাদ', 'মালিবাগ', 'রামপুরা', 'বাড্ডা', 'নতুন বাজার', 'কুড়িল', 'খিলক্ষেত', 'এয়ারপোর্ট', 'উত্তরা', 'টঙ্গী']
  },
  {
    nameBn: 'রাইদা পরিবহন',
    nameEn: 'Raida Paribahan',
    stops: ['postogola', 'jatrabari', 'mugda', 'khilgaon', 'malibagh', 'rampura', 'badda', 'natun bazar', 'kuril', 'airport', 'diabari'],
    stopsBn: ['পোস্তগোলা', 'যাত্রাবাড়ী', 'মুগদা', 'খিলগাঁও', 'মালিবাগ', 'রামপুরা', 'বাড্ডা', 'নতুন বাজার', 'কুড়িল', 'এয়ারপোর্ট', 'দিয়াবাড়ী']
  },
  {
    nameBn: 'অনাবিল পরিবহন',
    nameEn: 'Anabil Paribahan',
    stops: ['signboard', 'jatrabari', 'rampura', 'badda', 'kuril', 'airport', 'uttara', 'gazipur chowrasta'],
    stopsBn: ['সাইনবোর্ড', 'যাত্রাবাড়ী', 'রামপুরা', 'বাড্ডা', 'কুড়িল', 'এয়ারপোর্ট', 'উত্তরা', 'গাজীপুর চৌরাস্তা']
  },
  {
    nameBn: 'ভিক্টর ক্লাসিক',
    nameEn: 'Victor Classic',
    stops: ['sadarghat', 'gulistan', 'paltan', 'kakrail', 'malibagh', 'rampura', 'badda', 'kuril', 'airport', 'abdullahpur'],
    stopsBn: ['সদরঘাট', 'গুলিস্তান', 'পল্টন', 'কাকরাইল', 'মালিবাগ', 'রামপুরা', 'বাড্ডা', 'কুড়িল', 'এয়ারপোর্ট', 'আবদুল্লাহপুর']
  },
  {
    nameBn: 'বিকাশ পরিবহন',
    nameEn: 'Bikash Paribahan',
    stops: ['azimpur', 'new market', 'science lab', 'kalabagan', 'dhanmondi', 'asad gate', 'shyamoli', 'technical', 'gabtoli'],
    stopsBn: ['আজিমপুর', 'নিউ মার্কেট', 'সায়েন্স ল্যাব', 'কলাবাগান', 'ধানমন্ডি', 'আসাদ গেট', 'শ্যামলী', 'টেকনিক্যাল', 'গাবতলী']
  },
  {
    nameBn: 'মিডলাইন পরিবহন',
    nameEn: 'Midline Paribahan',
    stops: ['mohammadpur', 'shankar', 'dhanmondi 27', 'kalabagan', 'science lab', 'shahbagh', 'press club', 'motijheel'],
    stopsBn: ['মোহাম্মদপুর', 'শংকর', 'ধানমন্ডি ২৭', 'কলাবাগান', 'সায়েন্স ল্যাব', 'শাহবাগ', 'প্রেস ক্লাব', 'মতিঝিল']
  },
  {
    nameBn: 'তরঙ্গ প্লাস',
    nameEn: 'Taranga Plus',
    stops: ['mohammadpur', 'asad gate', 'dhanmondi 27', 'sukrabad', 'farmgate', 'mogbazar', 'malibagh', 'khilgaon', 'sayedabad'],
    stopsBn: ['মোহাম্মদপুর', 'আসাদ গেট', 'ধানমন্ডি ২৭', 'শুক্রাবাদ', 'ফার্মগেট', 'মগবাজার', 'মালিবাগ', 'খিলগাঁও', 'সায়েদাবাদ']
  },
  {
    nameBn: 'বোরাক পরিবহন',
    nameEn: 'Borak Paribahan',
    stops: ['dhanmondi', 'kalabagan', 'science lab', 'shahbagh', 'press club', 'motijheel', 'kamalapur'],
    stopsBn: ['ধানমন্ডি', 'কলাবাগান', 'সায়েন্স ল্যাব', 'শাহবাগ', 'প্রেস ক্লাব', 'মতিঝিল', 'কমলাপুর']
  },
  {
    nameBn: 'আজমিরী গ্লোরি',
    nameEn: 'Azmiri Glory',
    stops: ['sadarghat', 'gulistan', 'shahbagh', 'farmgate', 'mohakhali', 'banani', 'airport', 'uttara', 'gazipur chowrasta'],
    stopsBn: ['সদরঘাট', 'গুলিস্তান', 'শাহবাগ', 'ফার্মগেট', 'মহাখালী', 'বনানী', 'এয়ারপোর্ট', 'উত্তরা', 'গাজীপুর চৌরাস্তা']
  },
  {
    nameBn: 'লাব্বাইক পরিবহন',
    nameEn: 'Labbaik Paribahan',
    stops: ['savar', 'gabtoli', 'technical', 'shyamoli', 'asad gate', 'farmgate', 'mogbazar', 'malibagh', 'sayedabad'],
    stopsBn: ['সাভার', 'গাবতলী', 'টেকনিক্যাল', 'শ্যামলী', 'আসাদ গেট', 'ফার্মগেট', 'মগবাজার', 'মালিবাগ', 'সায়েদাবাদ']
  },
  {
    nameBn: 'আলিফ পরিবহন',
    nameEn: 'Alif Paribahan',
    stops: ['mirpur 1', 'mirpur 10', 'mirpur 14', 'kochukhet', 'banani', 'kakoli', 'gulshan 2', 'natun bazar', 'badda', 'rampura'],
    stopsBn: ['মিরপুর ১', 'মিরপুর ১০', 'মিরপুর ১৪', 'কচুক্ষেত', 'বনানী', 'কাকলী', 'গুলশান ২', 'নতুন বাজার', 'বাড্ডা', 'রামপুরা']
  },
  {
    nameBn: 'বৈশাখী পরিবহন',
    nameEn: 'Baishakhi Paribahan',
    stops: ['savar', 'gabtoli', 'mirpur 1', 'mirpur 10', 'kochukhet', 'banani', 'gulshan 1', 'badda', 'natun bazar'],
    stopsBn: ['সাভার', 'গাবতলী', 'মিরপুর ১', 'মিরপুর ১০', 'কচুক্ষেত', 'বনানী', 'গুলশান ১', 'বাড্ডা', 'নতুন বাজার']
  },
  {
    nameBn: 'রবরব পরিবহন',
    nameEn: 'Robrob Paribahan',
    stops: ['mirpur 12', 'mirpur 11', 'mirpur 10', 'mirpur 14', 'banani', 'gulshan 2', 'badda', 'rampura'],
    stopsBn: ['মিরপুর ১২', 'মিরপুর ১১', 'মিরপুর ১০', 'মিরপুর ১৪', 'বনানী', 'গুলশান ২', 'বাড্ডা', 'রামপুরা']
  },
  {
    nameBn: 'দিশারী পরিবহন',
    nameEn: 'Dishari Paribahan',
    stops: ['mirpur 1', 'mirpur 10', 'farmgate', 'banglamotor', 'shahbagh', 'gulistan', 'sadarghat'],
    stopsBn: ['মিরপুর ১', 'মিরপুর ১০', 'ফার্মগেট', 'বাংলামোটর', 'শাহবাগ', 'গুলিস্তান', 'সদরঘাট']
  },
  {
    nameBn: 'ট্রান্সসিলভা পরিবহন',
    nameEn: 'Transilva Paribahan',
    stops: ['mirpur 1', 'technical', 'shyamoli', 'asad gate', 'science lab', 'shahbagh', 'press club', 'motijheel', 'jatrabari'],
    stopsBn: ['মিরপুর ১', 'টেকনিক্যাল', 'শ্যামলী', 'আসাদ গেট', 'সায়েন্স ল্যাব', 'শাহবাগ', 'প্রেস ক্লাব', 'মতিঝিল', 'যাত্রাবাড়ী']
  },
  {
    nameBn: 'বসুমতী পরিবহন',
    nameEn: 'Basumati Paribahan',
    stops: ['gabtoli', 'technical', 'mirpur 1', 'mirpur 10', 'kalshi', 'ecb', 'airport', 'uttara', 'abdullahpur', 'gazipur chowrasta'],
    stopsBn: ['গাবতলী', 'টেকনিক্যাল', 'মিরপুর ১', 'মিরপুর ১০', 'কালশী', 'ইসিবি', 'এয়ারপোর্ট', 'উত্তরা', 'আবদুল্লাহপুর', 'গাজীপুর']
  },
  {
    nameBn: 'স্বাধীন এক্সপ্রেস',
    nameEn: 'Swadhin Express',
    stops: ['gabtoli', 'technical', 'shyamoli', 'asad gate', 'science lab', 'shahbagh', 'press club', 'gulistan', 'motijheel'],
    stopsBn: ['গাবতলী', 'টেকনিক্যাল', 'শ্যামলী', 'আসাদ গেট', 'সায়েন্স ল্যাব', 'শাহবাগ', 'প্রেস ক্লাব', 'গুলিস্তান', 'মতিঝিল']
  },
  {
    nameBn: '৮ নম্বর বাস',
    nameEn: '8 Number Bus',
    stops: ['gabtoli', 'technical', 'shyamoli', 'asad gate', 'new market', 'azimpur', 'sadarghat', 'jatrabari'],
    stopsBn: ['গাবতলী', 'টেকনিক্যাল', 'শ্যামলী', 'আসাদ গেট', 'নিউ মার্কেট', 'আজিমপুর', 'সদরঘাট', 'যাত্রাবাড়ী']
  },
  {
    nameBn: 'আকাশ পরিবহন',
    nameEn: 'Akash Paribahan',
    stops: ['kadamtali', 'jatrabari', 'sayedabad', 'malibagh', 'rampura', 'badda', 'kuril', 'airport', 'uttara', 'tongi'],
    stopsBn: ['কদমতলী', 'যাত্রাবাড়ী', 'সায়েদাবাদ', 'মালিবাগ', 'রামপুরা', 'বাড্ডা', 'কুড়িল', 'এয়ারপোর্ট', 'উত্তরা', 'টঙ্গী']
  },
  {
    nameBn: 'উইনার পরিবহন',
    nameEn: 'Winner Paribahan',
    stops: ['azimpur', 'nilkhet', 'science lab', 'dhanmondi', 'farmgate', 'mohakhali', 'banani', 'kuril', 'airport', 'uttara'],
    stopsBn: ['আজিমপুর', 'নীলক্ষেত', 'সায়েন্স ল্যাব', 'ধানমন্ডি', 'ফার্মগেট', 'মহাখালী', 'বনানী', 'কুড়িল', 'এয়ারপোর্ট', 'উত্তরা']
  },
  {
    nameBn: 'ঢাকা চাকা / গুলশান চাকা',
    nameEn: 'Dhaka Chaka AC Bus',
    stops: ['police plaza', 'gulshan 1', 'gulshan 2', 'natun bazar'],
    stopsBn: ['পুলিশ প্লাজা', 'গুলশান ১', 'গুলশান ২', 'নতুন বাজার']
  }
];

export const CHITTAGONG_BUS_ROUTES: BusRouteInfo[] = [
  {
    nameBn: '১০ নম্বর বাস',
    nameEn: 'Route 10 Bus',
    stops: ['kalurghat', 'bahaddarhat', 'muradpur', 'gec', 'lalkhan bazar', 'tigerpass', 'agrabad', 'barik building', 'customs', 'patenga'],
    stopsBn: ['কালুরঘাট', 'বহদ্দারহাট', 'মুরাদপুর', 'জিইসি', 'লালখান বাজার', 'টাইগারপাস', 'আগ্রাবাদ', 'বারিক বিল্ডিং', 'কাস্টমস', 'পতেঙ্গা']
  },
  {
    nameBn: '৪ নম্বর বাস',
    nameEn: 'Route 4 Bus',
    stops: ['new market', 'kotwali', 'anderkilla', 'chawkbazar', 'bahaddarhat', 'kalurghat'],
    stopsBn: ['নিউ মার্কেট', 'কোতোয়ালী', 'আন্দরকিল্লা', 'চকবাজার', 'বহদ্দারহাট', 'কালুরঘাট']
  },
  {
    nameBn: '৭ নম্বর বাস',
    nameEn: 'Route 7 Bus',
    stops: ['bhatiari', 'ak khan', 'alankar', 'naya bazar', 'barik building', 'agrabad'],
    stopsBn: ['ভাটিয়ারী', 'এ কে খান', 'অলংকার', 'নয়া বাজার', 'বারিক বিল্ডিং', 'আগ্রাবাদ']
  },
  {
    nameBn: '৩ নম্বর বাস',
    nameEn: 'Route 3 Bus',
    stops: ['oxygen', 'muradpur', 'gec', 'tigerpass', 'agrabad', 'sea beach'],
    stopsBn: ['অক্সিজেন', 'মুরাদপুর', 'জিইসি', 'টাইগারপাস', 'আগ্রাবাদ', 'সী বিচ']
  },
  {
    nameBn: '৮ নম্বর বাস',
    nameEn: 'Route 8 Bus',
    stops: ['new market', 'tigerpass', 'gec', 'bayezid', 'oxygen'],
    stopsBn: ['নিউ মার্কেট', 'টাইগারপাস', 'জিইসি', 'বায়েজিদ', 'অক্সিজেন']
  }
];

export const INTER_DISTRICT_TERMINALS: Record<string, { terminalBn: string; terminalEn: string; coachesBn: string[] }> = {
  // Chattogram Division
  chattogram: { terminalBn: 'সায়েদাবাদ / আরামবাগ বাস টার্মিনাল', terminalEn: 'Sayedabad / Arambagh', coachesBn: ['শ্যামলী এন আর', 'হানিফ এন্টারপ্রাইজ', 'সেন্টমার্টিন ট্রাভেলস', 'সৌদিয়া', 'গ্রীন লাইন'] },
  rangamati: { terminalBn: 'সায়েদাবাদ / ফকিরাপুল বাস টার্মিনাল', terminalEn: 'Sayedabad / Fakirapool', coachesBn: ['শ্যামলী পরিবহন', 'সেন্টমার্টিন পরিবহন', 'হানিফ এন্টারপ্রাইজ', 'এস আলম'] },
  coxsbazar: { terminalBn: 'সায়েদাবাদ / আরামবাগ বাস টার্মিনাল', terminalEn: 'Sayedabad / Arambagh', coachesBn: ['সেন্টমার্টিন ট্রাভেলস', 'শ্যামলী', 'হানিফ', 'দেশ ট্রাভেলস', 'গ্রীন লাইন'] },
  cumilla: { terminalBn: 'সায়েদাবাদ বাস টার্মিনাল', terminalEn: 'Sayedabad', coachesBn: ['তিশা প্লাস', 'এশিয়া এয়ারকন', 'রয়েল কোচ'] },
  feni: { terminalBn: 'সায়েদাবাদ বাস টার্মিনাল', terminalEn: 'Sayedabad', coachesBn: ['স্টার লাইন', 'এনা', 'শ্যামলী'] },
  bandarban: { terminalBn: 'সায়েদাবাদ / কলাবাগান', terminalEn: 'Sayedabad / Kalabagan', coachesBn: ['শ্যামলী', 'হানিফ', 'সেন্টমার্টিন', 'সৌদিয়া'] },
  khagrachhari: { terminalBn: 'সায়েদাবাদ / গাবতলী', terminalEn: 'Sayedabad / Gabtoli', coachesBn: ['শান্তি পরিবহন', 'শ্যামলী', 'সেন্টমার্টিন', 'হানিফ'] },

  // Sylhet Division
  sylhet: { terminalBn: 'সায়েদাবাদ / মহাখালী বাস টার্মিনাল', terminalEn: 'Sayedabad / Mohakhali', coachesBn: ['এনা পরিবহন', 'শ্যামলী', 'গ্রীন লাইন', 'লন্ডন এক্সপ্রেস', 'হানিফ'] },
  moulvibazar: { terminalBn: 'সায়েদাবাদ বাস টার্মিনাল', terminalEn: 'Sayedabad', coachesBn: ['এনা পরিবহন', 'শ্যামলী', 'মিতালী'] },
  sunamganj: { terminalBn: 'সায়েদাবাদ বাস টার্মিনাল', terminalEn: 'Sayedabad', coachesBn: ['এনা পরিবহন', 'শ্যামলী', 'মামুন এন্টারপ্রাইজ'] },

  // Rajshahi Division
  rajshahi: { terminalBn: 'গাবতলী / কল্যাণপুর বাস টার্মিনাল', terminalEn: 'Gabtoli / Kalyanpur', coachesBn: ['দেশ ট্রাভেলস', 'ন্যাশনাল ট্রাভেলস', 'হানিফ', 'শ্যামলী', 'একতা'] },
  bogura: { terminalBn: 'গাবতলী / মহাখালী বাস টার্মিনাল', terminalEn: 'Gabtoli / Mohakhali', coachesBn: ['শ্যামলী', 'হানিফ', 'শাহ ফতেহ আলী', 'এস আর ট্রাভেলস'] },
  pabna: { terminalBn: 'গাবতলী বাস টার্মিনাল', terminalEn: 'Gabtoli', coachesBn: ['পাবনা এক্সপ্রেস', 'শ্যামলী', 'সি-লাইন'] },

  // Khulna Division
  khulna: { terminalBn: 'সায়েদাবাদ / গাবতলী বাস টার্মিনাল', terminalEn: 'Sayedabad / Gabtoli', coachesBn: ['টুঙ্গিপাড়া এক্সপ্রেস', 'হানিফ', 'গ্রীন লাইন', 'ঈগল পরিবহন', 'সোহাগ'] },
  jashore: { terminalBn: 'সায়েদাবাদ / গাবতলী বাস টার্মিনাল', terminalEn: 'Sayedabad / Gabtoli', coachesBn: ['গ্রীন লাইন', 'হানিফ', 'শ্যামলী', 'সোহাগ'] },
  kushtia: { terminalBn: 'গাবতলী / কল্যাণপুর বাস টার্মিনাল', terminalEn: 'Gabtoli / Kalyanpur', coachesBn: ['এস বি পরিবহন', 'শ্যামলী', 'হানিফ'] },

  // Barishal Division
  barishal: { terminalBn: 'সায়েদাবাদ / কেরানীগঞ্জ বাস টার্মিনাল', terminalEn: 'Sayedabad / Keraniganj', coachesBn: ['সাকুরা পরিবহন', 'হানিফ', 'গ্রীন লাইন', 'ঈগল', 'বিআরটিসি'] },
  patuakhali: { terminalBn: 'সায়েদাবাদ বাস টার্মিনাল', terminalEn: 'Sayedabad', coachesBn: ['সাকুরা পরিবহন', 'কুয়াকাটা এক্সপ্রেস', 'হানিফ'] },

  // Rangpur Division
  rangpur: { terminalBn: 'গাবতলী / মহাখালী বাস টার্মিনাল', terminalEn: 'Gabtoli / Mohakhali', coachesBn: ['এস আর ট্রাভেলস', 'হানিফ', 'শ্যামলী', 'ডিপজল এন্টারপ্রাইজ'] },
  dinajpur: { terminalBn: 'গাবতলী বাস টার্মিনাল', terminalEn: 'Gabtoli', coachesBn: ['নাবিল পরিবহন', 'এস আর ট্রাভেলস', 'হানিফ', 'শ্যামলী'] },

  // Mymensingh Division
  mymensingh: { terminalBn: 'মহাখালী বাস টার্মিনাল', terminalEn: 'Mohakhali', coachesBn: ['এনা পরিবহন', 'শৌখিন এক্সপ্রেস', 'আলম এশিয়া'] }
};
