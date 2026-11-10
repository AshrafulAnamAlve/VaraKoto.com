import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocationDto, DistanceResultDto } from '../models/location.model';
import { DISTRICT_HUBS } from '../data/districts.data';
import { environment } from '../../../environments/environment';
import { NativeMobileService } from './native-mobile.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly nativeMobile = inject(NativeMobileService);
  private readonly apiUrl = environment.apiUrl;


    /**
   * Helper function to convert Bengali digits to English digits
   */
  private toEnglishDigits(str: string): string {
    return str.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
  }

  /**
   * Helper function to convert English digits to Bengali digits
   */
  private toBanglaDigits(str: string): string {
    return str.replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
  }

  /**
   * Performs an instant (0ms latency) bilingual and phonetic match against
   * all pre-seeded transit hubs, landmarks, and bus terminals in Bangladesh.
   */
  searchLocalHubs(query: string, districtId?: string, limit: number = 8): LocationDto[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.trim().toLowerCase();
    const qBnDigits = this.toBanglaDigits(q);
    const qEnDigits = this.toEnglishDigits(q);

    // Mapping for common English/Bangla aliases & phonetic transliterations
    const aliases: Record<string, string[]> = {
      'mirpur': ['মিরপুর'],
      'মিরপুর': ['mirpur'],
      'farm': ['ফার্মগেট', 'farmgate'],
      'farmgate': ['ফার্মগেট'],
      'ফার্মগেট': ['farmgate'],
      'uttara': ['উত্তরা'],
      'উত্তরা': ['uttara'],
      'dhanmondi': ['ধানমন্ডি'],
      'ধানমন্ডি': ['dhanmondi'],
      'gulshan': ['গুলশান'],
      'গুলশান': ['gulshan'],
      'banani': ['বনানী'],
      'বনানী': ['banani'],
      'motijheel': ['মতিঝিল'],
      'motijhil': ['মতিঝিল'],
      'মতিঝিল': ['motijheel'],
      'mohakhali': ['মহাখালী'],
      'মহাখালী': ['mohakhali'],
      'shahbagh': ['শাহবাগ'],
      'shahbag': ['শাহবাগ'],
      'শাহবাগ': ['shahbagh'],
      'airport': ['বিমানবন্দর', 'শাহজালাল'],
      'বিমানবন্দর': ['airport'],
      'railway': ['কমলাপুর', 'রেলওয়ে'],
      'kamalapur': ['কমলাপুর'],
      'komlapur': ['কমলাপুর'],
      'কমলাপুর': ['kamalapur'],
      'rampura': ['রামপুরা'],
      'রামপুরা': ['rampura'],
      'badda': ['বাড্ডা'],
      'বাড্ডা': ['badda'],
      'bonosree': ['বনশ্রী'],
      'banasree': ['বনশ্রী'],
      'bonoshri': ['বনশ্রী'],
      'বনশ্রী': ['bonosree', 'banasree'],
      'aftabnagar': ['আফতাবনগর'],
      'আফতাবনগর': ['aftabnagar'],
      'bosila': ['বসিলা'],
      'boshila': ['বসিলা'],
      'বসিলা': ['bosila'],
      'shankar': ['শংকর'],
      'songkor': ['শংকর'],
      'শংকর': ['shankar'],
      'jhigatola': ['ঝিগাতলা'],
      'jigatola': ['ঝিগাতলা'],
      'ঝিগাতলা': ['jhigatola'],
      'kalabagan': ['কলাবাগান'],
      'kolabagan': ['কলাবাগান'],
      'কলাবাগান': ['kalabagan'],
      'shukrabad': ['শুক্রাবাদ'],
      'শুক্রাবাদ': ['shukrabad'],
      'sobhanbag': ['সোবহানবাগ'],
      'সোবহানবাগ': ['sobhanbag'],
      'panthapath': ['পান্থপথ'],
      'পান্থপথ': ['panthapath'],
      'green road': ['গ্রিন রোড'],
      'গ্রিন রোড': ['green road'],
      'hatirpool': ['হাতিরপুল'],
      'হাতিরপুল': ['hatirpool'],
      'elephant road': ['এলিফ্যান্ট রোড'],
      'এলিফ্যান্ট রোড': ['elephant road'],
      'nilkhet': ['নীলক্ষেত'],
      'নীলক্ষেত': ['nilkhet'],
      'palashi': ['পলাশী'],
      'polashi': ['পলাশী'],
      'পলাশী': ['palashi'],
      'katabon': ['কাঁটাবন'],
      'কাঁটাবন': ['katabon'],
      'chankharpul': ['চাঁনখারপুল'],
      'চাঁনখারপুল': ['chankharpul'],
      'bakshibazar': ['বকশীবাজার'],
      'বকশীবাজার': ['bakshibazar'],
      'shewrapara': ['শেওড়াপাড়া'],
      'sewrapara': ['শেওড়াপাড়া'],
      'শেওড়াপাড়া': ['shewrapara'],
      'kazipara': ['কাজীপাড়া'],
      'কাজীপাড়া': ['kazipara'],
      'pallabi': ['পল্লবী'],
      'পল্লবী': ['pallabi'],
      'kalshi': ['কালশী'],
      'কালশী': ['kalshi'],
      'rupnagar': ['রূপনগর'],
      'রূপনগর': ['rupnagar'],
      'bauniabandh': ['বাউনিয়াবাঁধ'],
      'বাউনিয়াবাঁধ': ['bauniabandh'],
      'ibrahimpur': ['ইব্রাহিমপুর'],
      'ইব্রাহিমপুর': ['ibrahimpur'],
      'kochukhet': ['কচুক্ষেত'],
      'কচুক্ষেত': ['kochukhet'],
      'kafrul': ['কাফরুল'],
      'কাফরুল': ['kafrul'],
      'bijoy sarani': ['বিজয় সরণী'],
      'বিজয় সরণী': ['bijoy sarani'],
      'satrasta': ['সাতরাস্তা'],
      'সাতরাস্তা': ['satrasta'],
      'nabisco': ['নাবিস্কো'],
      'নাবিস্কো': ['nabisco'],
      'tibet': ['তিব্বত'],
      'তিব্বত': ['tibet'],
      'moghbazar': ['মগবাজার'],
      'মগবাজার': ['moghbazar'],
      'karwan': ['কারওয়ান'],
      'কারওয়ান': ['karwan'],
      'paltan': ['পল্টন'],
      'পল্টন': ['paltan'],
      'new market': ['নিউ মার্কেট'],
      'নিউ মার্কেট': ['new market'],
      'azimpur': ['আজিমপুর'],
      'আজিমপুর': ['azimpur'],
      'mohammadpur': ['মোহাম্মদপুর'],
      'মোহাম্মদপুর': ['mohammadpur'],
      'shyamoli': ['শ্যামলী'],
      'শ্যামলী': ['shyamoli'],
      'kalyanpur': ['কল্যাণপুর'],
      'কল্যাণপুর': ['kalyanpur'],
      'gabtoli': ['গাবতলী'],
      'গাবতলী': ['gabtoli'],
      'sayedabad': ['সায়েদাবাদ'],
      'সায়েদাবাদ': ['sayedabad'],
      'jatrabari': ['যাত্রাবাড়ী'],
      'যাত্রাবাড়ী': ['jatrabari'],
      'kuril': ['কুড়িল'],
      'কুড়িল': ['kuril'],
      'bashundhara': ['বসুন্ধরা'],
      'বসুন্ধরা': ['bashundhara'],
      'agargaon': ['আগারগাঁও'],
      'আগারগাঁও': ['agargaon'],
      'notun bazar': ['নতুন বাজার'],
      'নতুন বাজার': ['notun bazar'],
      'ecb': ['ইসিবি'],
      'ইসিবি': ['ecb'],
      'diabari': ['দিয়াবাড়ী'],
      'দিয়াবাড়ী': ['diabari'],
      'shantinagar': ['শান্তিনগর'],
      'শান্তিনগর': ['shantinagar'],
      'kakrail': ['কাকরাইল'],
      'কাকরাইল': ['kakrail'],
      'malibagh': ['মালিবাগ'],
      'মালিবাগ': ['malibagh'],
      'mouchak': ['মৌচাক'],
      'মৌচাক': ['mouchak'],
      'segunbagicha': ['সেগুনবাগিচা'],
      'সেগুনবাগিচা': ['segunbagicha'],
      'wari': ['ওয়ারী'],
      'ওয়ারী': ['wari'],
      'tikatuli': ['টিকাটুলি'],
      'টিকাটুলি': ['tikatuli'],
      'mugda': ['মুগদা'],
      'মুগদা': ['mugda'],
      'sadarghat': ['সদরঘাট'],
      'সদরঘাট': ['sadarghat'],
      'chawkbazar': ['চকবাজার'],
      'চকবাজার': ['chawkbazar'],
      'lalbagh': ['লালবাগ'],
      'লালবাগ': ['lalbagh'],
      'postogola': ['পোস্তগোলা'],
      'পোস্তগোলা': ['postogola'],
      'jurain': ['জুরাইন'],
      'জুরাইন': ['jurain'],
      'dholairpar': ['ধোলাইপাড়'],
      'ধোলাইপাড়': ['dholairpar'],
      'demra': ['ডেমরা'],
      'ডেমরা': ['demra'],
      'signboard': ['সাইনবোর্ড'],
      'সাইনবোর্ড': ['signboard'],
      'savar': ['সাভার'],
      'সাভার': ['savar'],
      'tongi': ['টঙ্গী'],
      'টঙ্গী': ['tongi'],
      'chashara': ['চাষাড়া'],
      'চাষাড়া': ['chashara'],
      'chattogram': ['চট্টগ্রাম'],
      'চট্টগ্রাম': ['chattogram'],
      'gec': ['জিইসি'],
      'জিইসি': ['gec'],
      'agrabad': ['আগ্রাবাদ'],
      'আগ্রাবাদ': ['agrabad'],
      'cox': ['কক্সবাজার'],
      'কক্সবাজার': ['cox'],
      'sylhet': ['সিলেট'],
      'saheb': ['সাহেব', 'shaheb'],
      'shaheb': ['সাহেব', 'saheb'],
      'সাহেব': ['saheb', 'shaheb'],
      'shiroil': ['শিরোইল'],
      'শিরোইল': ['shiroil'],
      'সিলেট': ['sylhet'],
      'rajshahi': ['রাজশাহী'],
      'রাজশাহী': ['rajshahi'],
      'khulna': ['খুলনা'],
      'খুলনা': ['khulna'],
      'barishal': ['বরিশাল'],
      'বরিশাল': ['barishal'],
      'gazipur': ['গাজীপুর'],
      'গাজীপুর': ['gazipur'],
      'narayanganj': ['নারায়ণগঞ্জ'],
      'নারায়ণগঞ্জ': ['narayanganj'],
      'cumilla': ['কুমিল্লা'],
      'কুমিল্লা': ['cumilla'],
      'bogura': ['বগুড়া'],
      'বগুড়া': ['bogura'],
      'rangamati': ['রাঙ্গামাটি'],
      'রাঙ্গামাটি': ['rangamati'],
      'kuakata': ['কুয়াকাটা'],
      'কুয়াকাটা': ['kuakata']
    };

    const matchedAliasTerms = aliases[q] || aliases[qBnDigits] || aliases[qEnDigits] || [];
    const qTokens = q.split(/[\s,/-]+/).filter(t => t.length > 0);

    const allHubsList: LocationDto[] = [];
    const distKey = (districtId || 'dhaka').toLowerCase();

    // 1. Current district hubs first
    if (DISTRICT_HUBS[distKey]) {
      allHubsList.push(...DISTRICT_HUBS[distKey]);
    }
    // 2. Add other district hubs
    for (const [key, hubs] of Object.entries(DISTRICT_HUBS)) {
      if (key !== distKey) {
        allHubsList.push(...hubs);
      }
    }

    const scored: { loc: LocationDto; score: number }[] = [];

    for (const loc of allHubsList) {
      let score = 0;
      const bn = (loc.nameBn || '').toLowerCase();
      const en = (loc.nameEn || '').toLowerCase();
      const dn = (loc.displayName || '').toLowerCase();
      const thana = (loc.thana || '').toLowerCase();
      const dist = (loc.district || '').toLowerCase();

      const bnEnDigits = this.toEnglishDigits(bn);
      const enBnDigits = this.toBanglaDigits(en);
      const dnEnDigits = this.toEnglishDigits(dn);

      // Exact matches get top priority
      if (bn === q || en === q || bn === qBnDigits || en === qEnDigits || bnEnDigits === qEnDigits) {
        score += 150;
      }
      // Starts with query
      else if (bn.startsWith(q) || en.startsWith(q) || bn.startsWith(qBnDigits) || en.startsWith(qEnDigits) || bnEnDigits.startsWith(qEnDigits)) {
        score += 100;
      }
      // Substring match
      else if (bn.includes(q) || en.includes(q) || bn.includes(qBnDigits) || en.includes(qEnDigits) || bnEnDigits.includes(qEnDigits)) {
        score += 70;
      } else if (dn.includes(q) || dn.includes(qBnDigits) || dnEnDigits.includes(qEnDigits) || thana.includes(q)) {
        score += 50;
      }

      // Check aliases
      for (const alias of matchedAliasTerms) {
        const al = alias.toLowerCase();
        if (bn.includes(al) || en.includes(al)) {
          score += 85;
        }
      }

      // Check multi-word tokens
      if (qTokens.length > 1) {
        const allTokensMatch = qTokens.every(tok => {
          const tokBn = this.toBanglaDigits(tok);
          const tokEn = this.toEnglishDigits(tok);
          const aliasList = aliases[tok] || aliases[tokBn] || aliases[tokEn] || [];
          const directMatch = bn.includes(tok) || en.includes(tok) || dn.includes(tok) ||
                              bn.includes(tokBn) || en.includes(tokEn) || dn.includes(tokBn) ||
                              bnEnDigits.includes(tokEn);
          if (directMatch) return true;
          return aliasList.some(al => bn.includes(al.toLowerCase()) || en.includes(al.toLowerCase()));
        });

        if (allTokensMatch) {
          score += 80;
        }
      }

      if (score > 0) {
        // Boost if matches user's current district
        if (distKey && dist.includes(distKey)) score += 30;
        // Boost transit hubs
        if (loc.isHub) score += 15;
        scored.push({ loc, score });
      }
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // De-duplicate by nameBn / displayName
    const seen = new Set<string>();
    const results: LocationDto[] = [];
    for (const item of scored) {
      const key = (item.loc.nameBn || item.loc.displayName).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push(item.loc);
        if (results.length >= limit) break;
      }
    }

    return results;
  }

  search(
    query: string,
    limit: number = 8,
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): Observable<LocationDto[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const trimmed = query.trim();
    let params = new HttpParams()
      .set('q', trimmed)
      .set('limit', limit.toString());

    if (districtName) {
      params = params.set('district', districtName);
    }

    return this.http.get<LocationDto[]>(`${this.apiUrl}/locations/search`, { params }).pipe(
      map(results => {
        return this.rankByDistrict(results, districtName, centerCoords);
      }),
      catchError(error => {
        console.warn('Backend location search error, attempting direct client fallback:', error);
        return this.searchPhotonDirect(trimmed, limit, districtName, centerCoords);
      })
    );
  }

  private searchPhotonDirect(
    query: string,
    limit: number,
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): Observable<LocationDto[]> {
    let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&bbox=88.0,20.5,92.7,26.7&limit=${limit * 2}`;
    if (centerCoords) {
      photonUrl += `&lat=${centerCoords.lat}&lon=${centerCoords.lng}`;
    }

    return this.http.get<any>(photonUrl).pipe(
      map(data => {
        const features = data?.features || [];
        const mapped: LocationDto[] = features
          .filter((f: any) => {
            const props = f.properties || {};
            const country = (props.country || '').toLowerCase();
            const countryCode = (props.countrycode || '').toLowerCase();
            // Discard foreign results outside Bangladesh
            if (countryCode === 'in' || country.includes('india') || country.includes('ভারত')) {
              return false;
            }
            const coords = f.geometry?.coordinates || [0, 0];
            const lng = coords[0];
            const lat = coords[1];
            // Must be strictly within Bangladesh coordinate bounds
            return lat >= 20.5 && lat <= 26.7 && lng >= 88.0 && lng <= 92.7;
          })
          .map((f: any) => {
            const coords = f.geometry?.coordinates || [0, 0];
            const props = f.properties || {};
            const name = props.name || query;
            const district = props.city || props.district || props.county || props.state || districtName || 'Bangladesh';
            return {
              nameEn: name,
              nameBn: name,
              displayName: `${name}, ${district}`,
              latitude: coords[1],
              longitude: coords[0],
              district: district,
              isHub: false,
              source: 'Geocoding'
            };
          });

        return this.rankByDistrict(mapped, districtName, centerCoords).slice(0, limit);
      }),
      catchError(() => of([]))
    );
  }

  private rankByDistrict(
    results: LocationDto[],
    districtName?: string,
    centerCoords?: { lat: number; lng: number }
  ): LocationDto[] {
    if (!results || results.length <= 1) return results;
    if (!districtName && !centerCoords) return results;

    const normDistrict = (districtName || '').toLowerCase().trim();

    return [...results].sort((a, b) => {
      // 1. Check direct district text matching
      const aMatchesDistrict = (
        (a.district && a.district.toLowerCase().includes(normDistrict)) ||
        (a.displayName && a.displayName.toLowerCase().includes(normDistrict)) ||
        (a.nameBn && a.nameBn.toLowerCase().includes(normDistrict)) ||
        (a.nameEn && a.nameEn.toLowerCase().includes(normDistrict))
      ) ? 1 : 0;

      const bMatchesDistrict = (
        (b.district && b.district.toLowerCase().includes(normDistrict)) ||
        (b.displayName && b.displayName.toLowerCase().includes(normDistrict)) ||
        (b.nameBn && b.nameBn.toLowerCase().includes(normDistrict)) ||
        (b.nameEn && b.nameEn.toLowerCase().includes(normDistrict))
      ) ? 1 : 0;

      if (aMatchesDistrict !== bMatchesDistrict) {
        return bMatchesDistrict - aMatchesDistrict; // District matches come first!
      }

      // 2. If center coords available, sort closer locations first
      if (centerCoords) {
        const distA = Math.hypot(a.latitude - centerCoords.lat, a.longitude - centerCoords.lng);
        const distB = Math.hypot(b.latitude - centerCoords.lat, b.longitude - centerCoords.lng);
        return distA - distB;
      }

      return 0;
    });
  }

  reverse(lat: number, lng: number): Observable<LocationDto | null> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString());

    return this.http.get<LocationDto>(`${this.apiUrl}/locations/reverse`, { params }).pipe(
      catchError(error => {
        console.warn('Reverse geocoding error:', error);
        return of(null);
      })
    );
  }

  getDistance(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    fromId?: number | null,
    toId?: number | null
  ): Observable<DistanceResultDto> {
    let params = new HttpParams()
      .set('fromLat', fromLat.toString())
      .set('fromLng', fromLng.toString())
      .set('toLat', toLat.toString())
      .set('toLng', toLng.toString());

    if (fromId) params = params.set('fromId', fromId.toString());
    if (toId) params = params.set('toId', toId.toString());

    return this.http.get<DistanceResultDto>(`${this.apiUrl}/routes/distance`, { params }).pipe(
      catchError(error => {
        console.warn('Distance calculation error, computing client fallback:', error);
        const clientDist = this.calculateHaversine(fromLat, fromLng, toLat, toLng);
        return of({
          distanceKm: clientDist,
          durationMinutes: Math.round((clientDist / 20) * 60),
          source: 'ClientHaversineFallback',
          isEstimatedRoute: true
        });
      })
    );
  }

  detectBrowserLocation(): Observable<{ latitude: number; longitude: number }> {
    return from(this.nativeMobile.getCurrentPosition());
  }

  private calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const factor = 1.28; // Road curvature
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(Math.max(R * c * factor, 0.5) * 100) / 100;
  }
}
