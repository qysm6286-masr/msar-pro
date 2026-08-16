import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabase = createClient('https://dqjtmxdclpipiisfrkjr.supabase.co','sb_publishable_c2mjopyiLYe9vRi1hUIBsA_NLadWVob');

window.signOut = () => {
  localStorage.removeItem('msar_auth');
  window.location.href = 'index.html';
};

function reveal() {
  document.documentElement.style.visibility = 'visible';
}

// صفحات المعاينة المجانية: يُسمح بمشاهدتها بدون تسجيل دخول، بدون أي تأثير على نظام دخول المشتركين
const FREE_PAGES = [
  'viewer-a032.html',
  'viewer-a205.html',
  'viewer-huawei-y6-2018.html',
  'viewer-huawei-nova-3.html',
  'viewer-infinix-hot-10-x682b.html',
  'viewer-redmi-10-4G.html',
  'viewer-POCO-X3.html',
  'viewer-tecno-spark-10-pro.html',
  'viewer-a125.html'
];

(async function () {
  const currentPage = window.location.pathname.split('/').pop();
  if (FREE_PAGES.includes(currentPage)) { reveal(); return; }

  const raw = localStorage.getItem('msar_auth');
  if (!raw) { window.location.href = 'index.html'; return; }

  let auth;
  try { auth = JSON.parse(raw); } catch (e) { window.location.href = 'index.html'; return; }

  if (!auth.email || !auth.code) { window.location.href = 'index.html'; return; }

  try {
    const { data, error } = await supabase.rpc('check_session', { p_email: auth.email, p_code: auth.code });
    if (error || !data || !data.ok) {
      localStorage.removeItem('msar_auth');
      window.location.href = 'index.html';
      return;
    }
    reveal();
  } catch (e) {
    // شبكة معطلة أو خطأ مؤقت: ما نطردش المستخدم، بس نسيب الفحص المحلي القديم يتكفل بالحد الأدنى
    reveal();
  }
})();
