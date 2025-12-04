
import { API_BASE_URL, AUTH_URL, CORS_PROXY } from '../constants';
import { ParticipantProfile, Skill, Project, Badge, Logtime, Feedback, XPHistoryItem, Course, Coalition, Workstation } from '../types';

export class ApiService {
  private static token: string | null = localStorage.getItem('s21_token');

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('s21_token', token);
  }

  static getToken() {
    return this.token;
  }

  static logout() {
    this.token = null;
    localStorage.removeItem('s21_token');
  }

  static async authenticate(username: string, pass: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Sanitize inputs
      const cleanUsername = username.trim().toLowerCase();
      // DO NOT trim password - some passwords contain spaces
      const cleanPass = pass; 

      const params = new URLSearchParams();
      params.append('client_id', 's21-open-api');
      params.append('username', cleanUsername);
      params.append('password', cleanPass);
      params.append('grant_type', 'password');
      params.append('scope', 'openid'); 

      const doFetch = async (url: string) => {
          return fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
          });
      };

      console.log(`Authenticating user: ${cleanUsername}...`);

      // Try Direct first
      let response = await doFetch(AUTH_URL).catch(() => null);

      // Try Proxy if Direct failed (Network/CORS error)
      if (!response) {
         console.warn("Direct Auth failed (Network Error). Retrying with proxy...");
         
         // Fix: Correctly append query param with ? since AUTH_URL has no params
         const targetUrl = `${AUTH_URL}?_t=${Date.now()}`;
         const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
         
         response = await doFetch(proxyUrl).catch(e => {
             console.error("Proxy Auth failed:", e);
             return null;
         });
      }

      if (!response) {
          return { success: false, error: 'Network Error. Could not connect to Auth server.' };
      }

      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        // Not JSON
      }

      if (!response.ok) {
        console.error("Auth Failed Status:", response.status);
        console.error("Auth Response Body:", text);

        let errorMsg = `Server Error: ${response.status}`;
        
        // Extract error message from Keycloak response
        if (data.error_description) errorMsg = data.error_description;
        else if (data.error) errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        else if (data.message) errorMsg = data.message;
        
        // Handle specific 401/403
        if (response.status === 401 || response.status === 403) {
           if (errorMsg.toLowerCase().includes('invalid')) {
             return { success: false, error: 'Invalid Credentials. (Check: 2FA must be OFF, CapsLock)' };
           }
           return { success: false, error: errorMsg || 'Invalid credentials or 2FA enabled.' };
        }
        
        return { success: false, error: errorMsg };
      }

      if (data.access_token) {
        this.setToken(data.access_token);
        return { success: true };
      }
      return { success: false, error: 'No access token received in response.' };
    } catch (e: any) {
      console.error("Auth Exception:", e);
      return { success: false, error: e.message || 'Unknown Auth Error' };
    }
  }

  private static async fetchWithAuth(endpoint: string) {
    if (!this.token) throw new Error("No token provided");

    const url = `${API_BASE_URL}${endpoint}`;
    
    // We try direct fetch first. If it fails, we assume CORS and try proxy.
    let res: Response;
    
    try {
        res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        // Direct failed, try proxy
        // Fix: Determine correct separator (? or &)
        const separator = url.includes('?') ? '&' : '?';
        const targetUrl = `${url}${separator}_t=${Date.now()}`;
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
        
        res = await fetch(proxyUrl, {
             headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
        });
    }

    if (!res.ok) {
      if (res.status === 401) {
        this.logout();
        throw new Error("Unauthorized");
      }
      // Improved error message including endpoint
      throw new Error(`API Error: ${res.status} at ${endpoint}`);
    }
    return res.json();
  }

  // Safe fetch wrapper: returns null instead of throwing if endpoint fails
  private static async safeFetch(endpoint: string) {
    try {
      return await this.fetchWithAuth(endpoint);
    } catch (e) {
      // Optional: Log warning only if it's not a common 404
      // console.warn(`Failed to fetch optional endpoint ${endpoint}`, e);
      return null;
    }
  }

  static async getParticipant(login: string): Promise<ParticipantProfile> {
    const cleanLogin = login.toLowerCase().trim();

    try {
      // Parallel fetch for performance. 
      // Only the basic info fetch is strict. All sub-resources are safe fetched.
      const [
        info, 
        skillsRes, 
        projectsRes, 
        badgesRes, 
        logtimeRes,
        feedbackRes,
        xpHistoryRes,
        coursesRes,
        coalitionRes,
        workstationRes
      ] = await Promise.all([
        this.fetchWithAuth(`/participants/${cleanLogin}`), // Strict: User must exist
        this.safeFetch(`/participants/${cleanLogin}/skills`),
        this.safeFetch(`/participants/${cleanLogin}/projects`),
        this.safeFetch(`/participants/${cleanLogin}/badges`),
        this.safeFetch(`/participants/${cleanLogin}/logtime`),
        this.safeFetch(`/participants/${cleanLogin}/feedback`),
        this.safeFetch(`/participants/${cleanLogin}/experience-history`),
        this.safeFetch(`/participants/${cleanLogin}/courses`),
        this.safeFetch(`/participants/${cleanLogin}/coalition`),
        this.safeFetch(`/participants/${cleanLogin}/workstation`)
      ]);

      // --- Helpers ---

      const extractName = (data: any): string => {
        if (!data) return '-';
        if (typeof data === 'string') return data;
        if (typeof data === 'object') {
          return data.shortName || data.name || data.id?.toString() || '-';
        }
        return String(data);
      };

      // Map Skills
      const mapSkills = (data: any): Skill[] => {
        const list = data?.skills || (Array.isArray(data) ? data : []);
        return list.map((item: any, idx: number) => ({
          id: idx,
          name: item.name || 'Unknown',
          level: item.points || item.level || 0 
        }));
      };

      // Map Projects
      const mapProjects = (data: any): Project[] => {
        const list = data?.projects || (Array.isArray(data) ? data : []);
        return list.map((item: any) => {
          // Extract team members
          let team: string[] = [];
          if (item.team && Array.isArray(item.team.users)) {
            team = item.team.users.map((u: any) => u.login);
          } else if (Array.isArray(item.teamMembers)) {
            // Handle raw array or object array
            team = item.teamMembers.map((m: any) => (typeof m === 'string' ? m : m.login));
          }

          return {
            id: item.id || Math.random(),
            name: item.title || item.name || 'Unknown Project',
            status: item.status || 'unavailable',
            finalMark: item.finalPercentage,
            updatedAt: item.completionDateTime || item.updatedAt || new Date().toISOString(),
            team: team
          };
        });
      };

      // Map Badges
      const mapBadges = (data: any): Badge[] => {
        const list = data?.badges || (Array.isArray(data) ? data : []);
        return list.map((item: any) => {
          let imageUrl = item.iconUrl || item.image || '';
          if (imageUrl && imageUrl.startsWith('/')) {
            imageUrl = `https://platform.21-school.ru${imageUrl}`;
          }
          return {
            id: Math.random(),
            name: item.name || 'Badge',
            image: imageUrl,
            description: item.description || item.name || '',
            awardedAt: item.receiptDateTime || item.awardedAt || new Date().toISOString()
          };
        });
      };

      // Map Logtime
      let averageLogtime = 0;
      let logtimeHistory: Logtime[] = [];
      if (typeof logtimeRes === 'number') {
        averageLogtime = logtimeRes;
      } else if (logtimeRes?.logtime && Array.isArray(logtimeRes.logtime)) {
        logtimeHistory = logtimeRes.logtime;
      } else if (logtimeRes?.average) {
          averageLogtime = logtimeRes.average;
      }

      // Map Extra Features
      const feedback: Feedback | undefined = feedbackRes ? {
        punctuality: feedbackRes.punctuality || 0,
        interest: feedbackRes.interest || 0,
        thoroughness: feedbackRes.thoroughness || 0,
        friendliness: feedbackRes.friendliness || 0,
      } : undefined;

      const xpHistory: XPHistoryItem[] = xpHistoryRes ? 
        (Array.isArray(xpHistoryRes) ? xpHistoryRes : []).map((x: any) => ({
            date: x.date || x.awardedAt,
            expValue: x.expValue || x.value
        })) : [];

      const courses: Course[] = coursesRes ? 
        (Array.isArray(coursesRes) ? coursesRes : []).map((c: any) => ({
            id: c.id,
            title: c.title || c.name,
            status: c.status
        })) : [];

      const coalition: Coalition | undefined = coalitionRes ? {
          name: coalitionRes.name || 'Unknown',
          imageUrl: coalitionRes.coverUrl || coalitionRes.imageUrl || '',
          color: coalitionRes.color || '#ffffff',
          score: coalitionRes.score || 0,
          rank: coalitionRes.rank || 0
      } : undefined;

      const workstation: Workstation | undefined = workstationRes ? {
          location: workstationRes.location || workstationRes.host || 'Unknown',
          host: workstationRes.host || '-',
          isActive: workstationRes.isActive || false
      } : undefined;

      return {
        login: info.login || login,
        className: extractName(info.class || info.className),
        parallelName: extractName(info.parallel || info.parallelName),
        campus: extractName(info.campus),
        email: info.email || `${login}@student.21-school.ru`,
        level: info.level || 0,
        expValue: info.expValue || 0,
        expToNextLevel: info.expToNextLevel || 0,
        avatarUrl: info.avatarUrl,
        
        skills: mapSkills(skillsRes),
        projects: mapProjects(projectsRes),
        badges: mapBadges(badgesRes),
        logtime: logtimeHistory,
        averageLogtime: averageLogtime,
        
        feedback,
        xpHistory,
        courses,
        coalition,
        workstation,

        loadedAt: Date.now(),
      };
    } catch (error: any) {
      // If error is a 404 on the main profile, handle gracefully without logging as "Failed"
      if (error.message && (error.message.includes('404') || error.message.includes('Participant not found'))) {
        throw new Error('Participant not found');
      }
      
      console.error("Failed to fetch real profile:", error);
      throw error;
    }
  }
}
