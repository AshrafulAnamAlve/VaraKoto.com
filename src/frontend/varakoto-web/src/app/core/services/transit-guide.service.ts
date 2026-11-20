import { Injectable } from '@angular/core';
import { LocationDto } from '../models/location.model';
import { TransitGuide, MetroStation, BusRouteInfo } from '../models/transit-guide.model';
import { METRO_LINE_6_STATIONS, DHAKA_BUS_ROUTES, CHITTAGONG_BUS_ROUTES, INTER_DISTRICT_TERMINALS } from '../data/transit-routes.data';
import { DISTRICT_HUBS } from '../data/districts.data';

@Injectable({
  providedIn: 'root'
})
export class TransitGuideService {

  generateGuide(fromLoc: LocationDto | null, toLoc: LocationDto | null, distanceKm: number, currentDistrictId?: string): TransitGuide {
    const guide: TransitGuide = {
      isShortDistance: false,
      hasMetroOption: false,
      hasDirectBus: false,
      directBuses: [],
      isInterDistrict: false,
      interDistrictCoaches: [],
      hasTransferOption: false,
      summaryRecommendation: ''
    };

    if (!fromLoc || !toLoc) {
      return guide;
    }

    const fromText = this.normalizeText(`${fromLoc.nameBn} ${fromLoc.nameEn} ${fromLoc.displayName}`);
    const toText = this.normalizeText(`${toLoc.nameBn} ${toLoc.nameEn} ${toLoc.displayName}`);

    const fromDistrict = (fromLoc.district || currentDistrictId || '').toLowerCase().trim();
    const toDistrict = (toLoc.district || currentDistrictId || '').toLowerCase().trim();

    // 1. Check Inter-District Travel
    if (fromDistrict && toDistrict && fromDistrict !== toDistrict && distanceKm > 30) {
      const targetTerminalInfo = INTER_DISTRICT_TERMINALS[toDistrict] || INTER_DISTRICT_TERMINALS[fromDistrict];
      if (targetTerminalInfo) {
        guide.isInterDistrict = true;
        guide.departureTerminal = targetTerminalInfo.terminalBn;
        guide.interDistrictCoaches = targetTerminalInfo.coachesBn;
        guide.destinationDistrict = toLoc.district || toLoc.nameBn;
        guide.summaryRecommendation = `${targetTerminalInfo.terminalBn} থেকে দূরপাল্লার বাসে সরাসরি যেতে পারবেন।`;
        return guide;
      }
    }

    // 2. Check Short Distance (<= 2.2 km)
    if (distanceKm > 0 && distanceKm <= 2.2) {
      guide.isShortDistance = true;
      guide.shortDistanceAdvice = 'স্বল্প দূরত্ব: সরাসরি রিকশায় যাওয়া সবচেয়ে দ্রুত ও সুবিধাজনক। বাসের প্রয়োজন নেই।';
      guide.summaryRecommendation = 'রিকশায় সরাসরি যাওয়া সবচেয়ে সুবিধাজনক।';
      return guide;
    }

    // 3. Check Metro Rail (MRT Line-6) Corridor
    const fromStation = this.findMatchingMetroStation(fromText);
    const toStation = this.findMatchingMetroStation(toText);

    if (fromStation && toStation && fromStation.id !== toStation.id) {
      const stationDelta = Math.abs(fromStation.order - toStation.order);
      guide.hasMetroOption = true;
      guide.metroBoardingStation = fromStation.nameBn;
      guide.metroAlightingStation = toStation.nameBn;
      guide.metroDurationMinutes = Math.round(stationDelta * 2.2 + 3);
      guide.metroFare = stationDelta <= 2 ? 20 : Math.min(100, 20 + (stationDelta - 2) * 10);
    }

    // 4. Check Direct City Buses (Dhaka & Chittagong)
    const busPool = (currentDistrictId === 'chattogram' || fromDistrict.includes('chattogram'))
      ? CHITTAGONG_BUS_ROUTES
      : DHAKA_BUS_ROUTES;

    const fromStops = this.expandLocationToStops(fromLoc, fromText);
    const toStops = this.expandLocationToStops(toLoc, toText);

    const matchedBuses = this.findMatchingBuses(fromStops, toStops, busPool);
    if (matchedBuses.length > 0) {
      guide.hasDirectBus = true;
      guide.directBuses = matchedBuses;
      guide.nearestBoardingStop = fromLoc.nameBn || fromLoc.displayName;
      guide.nearestAlightingStop = toLoc.nameBn || toLoc.displayName;
      guide.summaryRecommendation = `${matchedBuses.slice(0, 3).join(', ')} বাসে সরাসরি যাওয়া যায়।`;
    }

    // 5. Transfer / Connecting Option if neither direct bus nor metro
    if (!guide.hasDirectBus && !guide.hasMetroOption) {
      guide.hasTransferOption = true;
      guide.transferHub = this.determineTransferHub(fromLoc, toLoc, currentDistrictId);
      guide.nearestBoardingStop = fromLoc.nameBn || fromLoc.displayName;
      guide.summaryRecommendation = `${guide.transferHub} হয়ে এক ট্রান্সফারে পৌঁছানো যাবে।`;
    }

    return guide;
  }

  private findMatchingMetroStation(text: string): MetroStation | null {
    for (const st of METRO_LINE_6_STATIONS) {
      if (st.aliases.some(alias => text.includes(this.normalizeText(alias)))) {
        return st;
      }
    }
    return null;
  }

  private findMatchingBuses(fromStops: string[], toStops: string[], busList: BusRouteInfo[]): string[] {
    const directBuses: string[] = [];

    for (const bus of busList) {
      const fromIndex = bus.stops.findIndex((s, i) => {
        const sBn = this.normalizeText(bus.stopsBn[i] || '');
        return fromStops.some(fs => fs.includes(s) || (sBn && fs.includes(sBn)) || s.includes(fs));
      });

      const toIndex = bus.stops.findIndex((s, i) => {
        const sBn = this.normalizeText(bus.stopsBn[i] || '');
        return toStops.some(ts => ts.includes(s) || (sBn && ts.includes(sBn)) || s.includes(ts));
      });

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        if (!directBuses.includes(bus.nameBn)) {
          directBuses.push(bus.nameBn);
        }
      }
    }

    return directBuses;
  }

  private expandLocationToStops(loc: LocationDto, text: string): string[] {
    const stops: string[] = [text];
    const t = text.toLowerCase();

    // Map sub-neighborhoods to their primary transit corridors
    if (t.includes('bosila') || t.includes('বসিলা')) {
      stops.push('bosila', 'বসিলা', 'mohammadpur', 'মোহাম্মদপুর', 'ghatarchar', 'ঘাটারচর');
    }
    if (t.includes('shankar') || t.includes('শংকর')) {
      stops.push('shankar', 'শংকর', 'mohammadpur', 'মোহাম্মদপুর', 'dhanmondi 27', 'ধানমন্ডি ২৭');
    }
    if (t.includes('bonosree') || t.includes('banasree') || t.includes('বনশ্রী') || t.includes('aftabnagar') || t.includes('আফতাবনগর')) {
      stops.push('rampura', 'রামপুরা', 'badda', 'বাড্ডা');
    }
    if (t.includes('lalbagh') || t.includes('লালবাগ') || t.includes('chawkbazar') || t.includes('চকবাজার')) {
      stops.push('sadarghat', 'সদরঘাট', 'azimpur', 'আজিমপুর', 'gulistan', 'গুলিস্তান');
    }
    if (t.includes('wari') || t.includes('ওয়ারী') || t.includes('sutrapur') || t.includes('সূত্রাপুর')) {
      stops.push('sadarghat', 'সদরঘাট', 'sayedabad', 'সায়েদাবাদ', 'gulistan', 'গুলিস্তান');
    }
    if (t.includes('postogola') || t.includes('পোস্তগোলা') || t.includes('gandaria') || t.includes('গেন্ডারিয়া')) {
      stops.push('postogola', 'পোস্তগোলা', 'jatrabari', 'যাত্রাবাড়ী', 'sayedabad', 'সায়েদাবাদ');
    }
    if (t.includes('savar') || t.includes('সাভার') || t.includes('aminbazar') || t.includes('আমিনবাজার') || t.includes('hemayetpur') || t.includes('হেমায়েতপুর')) {
      stops.push('savar', 'সাভার', 'gabtoli', 'গাবতলী', 'technical', 'টেকনিক্যাল');
    }
    if (t.includes('tongi') || t.includes('টঙ্গী') || t.includes('gazipur') || t.includes('গাজীপুর')) {
      stops.push('tongi', 'টঙ্গী', 'uttara', 'উত্তরা', 'airport', 'এয়ারপোর্ট', 'abdullahpur', 'আবদুল্লাহপুর');
    }
    if (t.includes('kalshi') || t.includes('কালশী')) {
      stops.push('kalshi', 'কালশী', 'ecb', 'ইসিবি', 'mirpur 10', 'মিরপুর ১০', 'mirpur 11', 'মিরপুর ১১');
    }
    if (t.includes('nikunja') || t.includes('নিকুঞ্জ') || t.includes('khilkhet') || t.includes('খিলক্ষেত')) {
      stops.push('khilkhet', 'খিলক্ষেত', 'kuril', 'কুড়িল', 'airport', 'এয়ারপোর্ট');
    }
    if (t.includes('bashundhara') || t.includes('বসুন্ধরা') || t.includes('baridhara') || t.includes('বারিধারা')) {
      stops.push('kuril', 'কুড়িল', 'natun bazar', 'নতুন বাজার', 'badda', 'বাড্ডা');
    }
    if (t.includes('sukrabad') || t.includes('শুক্রাবাদ') || t.includes('sobhanbag') || t.includes('সোবহানবাগ')) {
      stops.push('dhanmondi 27', 'ধানমন্ডি ২৭', 'dhanmondi', 'ধানমন্ডি', 'farmgate', 'ফার্মগেট');
    }
    if (t.includes('panthapath') || t.includes('পান্থপথ') || t.includes('green road') || t.includes('গ্রিন রোড')) {
      stops.push('panthapath', 'পান্থপথ', 'farmgate', 'ফার্মগেট', 'karwan bazar', 'কারওয়ান বাজার', 'science lab', 'সায়েন্স ল্যাব');
    }
    if (t.includes('elephant road') || t.includes('এলিফ্যান্ট রোড') || t.includes('nilkhet') || t.includes('নীলক্ষেত') || t.includes('new market') || t.includes('নিউ মার্কেট')) {
      stops.push('science lab', 'সায়েন্স ল্যাব', 'new market', 'নিউ মার্কেট', 'azimpur', 'আজিমপুর');
    }
    if (t.includes('khilgaon') || t.includes('খিলগাঁও') || t.includes('goran') || t.includes('গোড়ান') || t.includes('basabo') || t.includes('বাসাবো')) {
      stops.push('khilgaon', 'খিলগাঁও', 'malibagh', 'মালিবাগ', 'mugda', 'মুগদা');
    }

    return stops;
  }

  determineTransferHub(fromLoc: LocationDto, toLoc: LocationDto, currentDistrictId?: string): string {
    const fDist = (fromLoc.district || currentDistrictId || 'dhaka').toLowerCase().trim();
    const tDist = (toLoc.district || currentDistrictId || 'dhaka').toLowerCase().trim();

    // 1. Non-Dhaka Districts: return local central junction, NEVER Farmgate
    if (fDist !== 'dhaka' && fDist !== 'dhaka metro') {
      if (fDist.includes('chattogram') || fDist.includes('chittagong')) return 'জিইসি মোড় ও বহদ্দারহাট';
      if (fDist.includes('sylhet')) return 'কোর্ট পয়েন্ট ও জিন্দাবাজার';
      if (fDist.includes('rajshahi')) return 'সাহেব বাজার জিরো পয়েন্ট ও শিরোইল';
      if (fDist.includes('khulna')) return 'শিববাড়ি মোড় ও রয়েল চত্বর';
      if (fDist.includes('barishal')) return 'নথুল্লাবাদ কেন্দ্রীয় বাস টার্মিনাল';
      if (fDist.includes('rangpur')) return 'পায়রা চত্বর ও জাহাজ কোম্পানি মোড়';
      if (fDist.includes('cumilla') || fDist.includes('comilla')) return 'কান্দিরপাড় ও শাসনগাছা বাস টার্মিনাল';
      if (fDist.includes('mymensingh')) return 'গাঙ্গিনারপাড় ও মাসকান্দা টার্মিনাল';
      if (fDist.includes('bogura') || fDist.includes('bogra')) return 'সাতমাথা জিরো পয়েন্ট';

      const hubList = DISTRICT_HUBS[fDist] || DISTRICT_HUBS[tDist];
      if (hubList && hubList.length > 0) {
        return hubList[0].nameBn;
      }
      return `${fromLoc.district || 'জেলা'} কেন্দ্রীয় বাস টার্মিনাল`;
    }

    // 2. Dhaka Metro Area - Dynamic Corridor Hub based on Origin & Destination
    const fZone = this.classifyDhakaZone(fromLoc);
    const tZone = this.classifyDhakaZone(toLoc);

    // If both in the same zone, use local neighborhood junction
    if (fZone === tZone) {
      return this.getZoneLocalHub(fZone);
    }

    const transferMap: Record<string, string> = {
      // South-West (Mohammadpur, Bosila, Dhanmondi, Shankar)
      'south_west_east': 'হাতিরঝিল লিংক রোড ও মগবাজার মোড়',
      'south_west_north': 'আসাদ গেট ও মহাখালী ফ্লাইওভার',
      'south_west_north_east': 'মহাখালী আমতলী ও গুলশান ১',
      'south_west_south_east': 'সায়েন্স ল্যাব মোড় ও শাহবাগ',
      'south_west_south_central': 'সায়েন্স ল্যাব মোড় ও নিউ মার্কেট',
      'south_west_south': 'আজিমপুর মোড় ও নিউ মার্কেট',
      'south_west_north_west': 'শ্যামলী ও কল্যাণপুর বাস স্ট্যান্ড',
      'south_west_central': 'পান্থপথ মোড় ও রাসেল স্কয়ার',

      // North-West (Mirpur, Pallabi, Agargaon)
      'north_west_east': 'কাকলী / বনানী ও নতুন বাজার',
      'north_west_north': 'কালশী ফ্লাইওভার ও ইসিবি চত্বর',
      'north_west_north_east': 'কুড়িল বিশ্বরোড ও কালশী',
      'north_west_south_east': 'আগারগাঁও ও বিজয় সরণি',
      'north_west_south_central': 'ফার্মগেট মোড় ও শাহবাগ',
      'north_west_south': 'ফার্মগেট মোড় ও শাহবাগ',
      'north_west_central': 'বিজয় সরণি ও খামারবাড়ি',

      // North (Uttara, Airport, Tongi, Gazipur)
      'north_east': 'কুড়িল বিশ্বরোড ও নতুন বাজার',
      'north_south_east': 'বিমানবন্দর মহাসড়ক ও মহাখালী',
      'north_south_central': 'মহাখালী ও বিমানবন্দর সড়ক',
      'north_south': 'মহাখালী বাস টার্মিনাল ও কাকরাইল',
      'north_central': 'মহাখালী আমতলী ও তেজগাঁও',

      // East (Rampura, Badda, Banasree, Aftabnagar)
      'east_south_east': 'মালিবাগ রেলগেট ও কাকরাইল মোড়',
      'east_south_central': 'মৌচাক মোড় ও মালিবাগ',
      'east_south': 'সায়েদাবাদ বাস টার্মিনাল ও খিলগাঁও',
      'east_central': 'হাতিরঝিল সংযোগ ও তেজগাঁও',

      // West (Gabtoli, Savar, Technical)
      'west_east': 'টেকনিক্যাল, শ্যামলী ও মহাখালী',
      'west_north': 'মিরপুর ১ ও কালশী ফ্লাইওভার',
      'west_south_east': 'আসাদ গেট, সায়েন্স ল্যাব ও গুলিস্তান',
      'west_south_central': 'আসাদ গেট ও সায়েন্স ল্যাব মোড়',
      'west_south': 'গাবতলী ও মিরপুর রোড',
      'west_central': 'আসাদ গেট ও ফার্মগেট মোড়',

      // South-Central & South-East (Shahbagh, Paltan, Motijheel)
      'south_central_east': 'মৌচাক মোড় ও মালিবাগ',
      'south_central_north': 'শাহবাগ ও ফার্মগেট মোড়',
      'south_east_central': 'বাংলামোটর ও মৎস্য ভবন',
      'south_central': 'গুলিস্তান জিরো পয়েন্ট ও পল্টন মোড়'
    };

    const key1 = `${fZone}_${tZone}`;
    const key2 = `${tZone}_${fZone}`;
    if (transferMap[key1]) return transferMap[key1];
    if (transferMap[key2]) return transferMap[key2];

    // Coordinate-based centroid calculation
    if (fromLoc.latitude && fromLoc.longitude && toLoc.latitude && toLoc.longitude) {
      const midLat = (fromLoc.latitude + toLoc.latitude) / 2;
      const midLng = (fromLoc.longitude + toLoc.longitude) / 2;
      if (midLat > 23.82) return 'কুড়িল বিশ্বরোড / বিমানবন্দর মোড়';
      if (midLat > 23.78) return 'মহাখালী বাস টার্মিনাল / বনানী';
      if (midLng > 90.41) return 'মালিবাগ রেলগেট / রামপুরা ব্রিজ';
      if (midLng < 90.37) return 'আসাদ গেট / সায়েন্স ল্যাব মোড়';
      return 'বাংলামোটর ও শাহবাগ মোড়';
    }

    return 'মহাখালী বা শাহবাগ কেন্দ্রীয় সংযোগস্থল';
  }

  private classifyDhakaZone(loc: LocationDto): string {
    const t = `${loc.nameBn || ''} ${loc.nameEn || ''} ${loc.displayName || ''}`.toLowerCase();

    if (t.includes('uttara') || t.includes('উত্তরা') || t.includes('airport') || t.includes('বিমানবন্দর') ||
        t.includes('tongi') || t.includes('টঙ্গী') || t.includes('abdullahpur') || t.includes('আবদুল্লাহপুর') ||
        t.includes('diabari') || t.includes('দিয়াবাড়ী') || t.includes('gazipur') || t.includes('গাজীপুর')) {
      return 'north';
    }
    if (t.includes('kuril') || t.includes('কুড়িল') || t.includes('khilkhet') || t.includes('খিলক্ষেত') ||
        t.includes('bashundhara') || t.includes('বসুন্ধরা') || t.includes('baridhara') || t.includes('বারিধারা') ||
        t.includes('natun bazar') || t.includes('নতুন বাজার')) {
      return 'north_east';
    }
    if (t.includes('mirpur') || t.includes('মিরপুর') || t.includes('pallabi') || t.includes('পল্লবী') ||
        t.includes('kazipara') || t.includes('কাজীপাড়া') || t.includes('shewrapara') || t.includes('শেওড়াপাড়া') ||
        t.includes('agargaon') || t.includes('আগারগাঁও') || t.includes('kalshi') || t.includes('কালশী')) {
      return 'north_west';
    }
    if (t.includes('gabtoli') || t.includes('গাবতলী') || t.includes('technical') || t.includes('টেকনিক্যাল') ||
        t.includes('shyamoli') || t.includes('শ্যামলী') || t.includes('kallyanpur') || t.includes('কল্যাণপুর') ||
        t.includes('savar') || t.includes('সাভার') || t.includes('aminbazar') || t.includes('আমিনবাজার')) {
      return 'west';
    }
    if (t.includes('mohammadpur') || t.includes('মোহাম্মদপুর') || t.includes('bosila') || t.includes('বসিলা') ||
        t.includes('shankar') || t.includes('শংকর') || t.includes('dhanmondi') || t.includes('ধানমন্ডি') ||
        t.includes('rayerbazar') || t.includes('রায়েরবাজার') || t.includes('hazaribagh') || t.includes('হাজারীবাগ')) {
      return 'south_west';
    }
    if (t.includes('gulshan') || t.includes('গুলশান') || t.includes('banani') || t.includes('বনানী') ||
        t.includes('mohakhali') || t.includes('মহাখালী') || t.includes('tejgaon') || t.includes('তেজগাঁও')) {
      return 'central_north';
    }
    if (t.includes('badda') || t.includes('বাড্ডা') || t.includes('rampura') || t.includes('রামপুরা') ||
        t.includes('bonosree') || t.includes('banasree') || t.includes('বনশ্রী') ||
        t.includes('aftabnagar') || t.includes('আফতাবনগর') || t.includes('khilgaon') || t.includes('খিলগাঁও') ||
        t.includes('malibagh') || t.includes('মালিবাগ') || t.includes('moghbazar') || t.includes('মগবাজার')) {
      return 'east';
    }
    if (t.includes('farmgate') || t.includes('ফার্মগেট') || t.includes('karwan bazar') || t.includes('কারওয়ান বাজার') ||
        t.includes('banglamotor') || t.includes('বাংলামোটর') || t.includes('panthapath') || t.includes('পান্থপথ') ||
        t.includes('green road') || t.includes('গ্রিন রোড')) {
      return 'central';
    }
    if (t.includes('shahbagh') || t.includes('শাহবাগ') || t.includes('science lab') || t.includes('সায়েন্স ল্যাব') ||
        t.includes('new market') || t.includes('নিউ মার্কেট') || t.includes('nilkhet') || t.includes('নীলক্ষেত') ||
        t.includes('azimpur') || t.includes('আজিমপুর') || t.includes('dhaka university') || t.includes('ঢাকা বিশ্ববিদ্যালয়')) {
      return 'south_central';
    }
    if (t.includes('motijheel') || t.includes('মতিঝিল') || t.includes('paltan') || t.includes('পল্টন') ||
        t.includes('kamalapur') || t.includes('কমলাপুর') || t.includes('kakrail') || t.includes('কাকরাইল')) {
      return 'south_east';
    }
    if (t.includes('jatrabari') || t.includes('যাত্রাবাড়ী') || t.includes('sayedabad') || t.includes('সায়েদাবাদ') ||
        t.includes('postogola') || t.includes('পোস্তগোলা') || t.includes('sadarghat') || t.includes('সদরঘাট') ||
        t.includes('wari') || t.includes('ওয়ারী') || t.includes('chawkbazar') || t.includes('চকবাজার') ||
        t.includes('lalbagh') || t.includes('লালবাগ')) {
      return 'south';
    }

    if (loc.latitude && loc.longitude) {
      if (loc.latitude > 23.84) return 'north';
      if (loc.latitude < 23.72) return 'south';
      if (loc.longitude > 90.43) return 'east';
      if (loc.longitude < 90.35) return 'south_west';
      if (loc.latitude > 23.77) return 'central_north';
      return 'central';
    }

    return 'central';
  }

  private getZoneLocalHub(zone: string): string {
    switch (zone) {
      case 'north': return 'জসীমউদ্দীন মোড় ও হাউজবিল্ডিং';
      case 'north_east': return 'কুড়িল বিশ্বরোড ও নতুন বাজার';
      case 'north_west': return 'মিরপুর ১০ গোলচত্বর';
      case 'west': return 'গাবতলী বাস টার্মিনাল';
      case 'south_west': return 'আসাদ গেট ও ধানমন্ডি ২৭';
      case 'central_north': return 'মহাখালী আমতলী';
      case 'east': return 'রামপুরা ব্রিজ মোড়';
      case 'central': return 'কারওয়ান বাজার ও বাংলামোটর';
      case 'south_central': return 'সায়েন্স ল্যাব মোড়';
      case 'south_east': return 'মতিঝিল শাপলা চত্বর';
      case 'south': return 'সদরঘাট ও যাত্রাবাড়ী মোড়';
      default: return 'প্রধান সংযোগ সড়ক মোড়';
    }
  }

  private normalizeText(text: string): string {
    return (text || '').toLowerCase().replace(/[-_,/()]/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
