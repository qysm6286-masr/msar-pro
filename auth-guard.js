import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabase = createClient('https://dqjtmxdclpipiisfrkjr.supabase.co','sb_publishable_c2mjopyiLYe9vRi1hUIBsA_NLadWVob');

window.signOut = () => {
  localStorage.removeItem('msar_auth');
  window.location.href = 'index.html';
};

function reveal() {
  document.documentElement.style.visibility = 'visible';
}

// عداد زوار GoatCounter — يعمل على كل صفحة تحمّل auth-guard.js (المحمية والمجانية)
(function(){
  const s = document.createElement('script');
  s.async = true;
  s.setAttribute('data-goatcounter', 'https://masr-pro.goatcounter.com/count');
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);
})();

const WA_LINK = 'https://wa.me/218935845255?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D9%85%D8%B3%D8%A7%D8%B1%20PRO';

function remainingText(ms) {
  const h = Math.floor(ms / 3600000);
  if (h >= 48) return Math.floor(h / 24) + ' أيام';
  if (h >= 24) return 'يوم واحد';
  if (h >= 1) return h + ' ساعة';
  return Math.max(1, Math.ceil(ms / 60000)) + ' دقيقة';
}

function endTrial() {
  localStorage.removeItem('msar_auth');
  window.location.href = 'index.html?trial=expired';
}

// شريط صغير يظهر لصاحب كود التجربة فقط، ويغلق عليه الموقع عند انتهاء المدة
function showTrialBar(expiresAt) {
  if (!expiresAt) return;
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) { endTrial(); return; }
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:99999;display:flex;align-items:center;gap:10px;background:#0d1630;border:1px solid #f0a868;color:#e2e8f0;padding:8px 14px;border-radius:999px;font-family:Tajawal,sans-serif;font-size:12.5px;box-shadow:0 4px 24px rgba(0,0,0,0.5);white-space:nowrap;max-width:94vw';
  bar.innerHTML = '<span>⏳ تجربة مجانية — المتبقي: <b>' + remainingText(ms) + '</b></span>' +
    '<a href="' + WA_LINK + '" target="_blank" rel="noopener" style="background:#2563eb;color:#fff;text-decoration:none;padding:5px 12px;border-radius:999px;font-weight:700">اشترك</a>';
  const add = () => document.body.appendChild(bar);
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
  setTimeout(endTrial, Math.min(ms, 2147483647));
}

(async function () {
  const raw = localStorage.getItem('msar_auth');
  if (!raw) { window.location.href = 'index.html'; return; }

  let auth;
  try { auth = JSON.parse(raw); } catch (e) { window.location.href = 'index.html'; return; }

  if (!auth.email || !auth.code) { window.location.href = 'index.html'; return; }

  try {
    const { data, error } = await supabase.rpc('check_session', { p_email: auth.email, p_code: auth.code });
    if (error || !data || !data.ok) {
      if (data && data.reason === 'expired' && data.code_type === 'trial') { endTrial(); return; }
      localStorage.removeItem('msar_auth');
      window.location.href = 'index.html';
      return;
    }
    reveal();
    if (data.code_type === 'trial') showTrialBar(data.expires_at);
  } catch (e) {
    // شبكة معطلة أو خطأ مؤقت: ما نطردش المستخدم، بس نسيب الفحص المحلي القديم يتكفل بالحد الأدنى
    reveal();
  }
})();
