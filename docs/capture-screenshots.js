const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, 'screenshots');

const mockUser = {
  id: 'user-1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  location: 'Pune, India',
  points: 2450,
  badge: 'gold',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  createdAt: '2024-01-15',
};

const mockOrg = {
  id: 'org-1',
  name: 'Hope Foundation',
  email: 'contact@hopefoundation.org',
  phone: '+91 20 2612 3456',
  description: 'Empowering underprivileged children through education and healthcare.',
  mission: 'To create a world where every child has access to quality education and healthcare, regardless of their economic background.',
  category: 'education',
  location: 'Pune, India',
  address: '123, MG Road, Koregaon Park, Pune - 411001',
  registrationNumber: 'NGO/MH/2010/12345',
  logoUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
  bannerUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=400&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
  ],
  donationNeeds: [
    { id: 'need-1', title: 'School Supplies', description: 'Notebooks, pens, and pencils for students', category: 'books', urgency: 'high' },
    { id: 'need-2', title: 'Educational Books', description: 'Textbooks and reference materials', category: 'books', urgency: 'medium' },
  ],
  totalDonations: 1250,
  createdAt: '2020-03-15',
};

const pages = [
  { name: '01-landing', path: '/', auth: 'none' },
  { name: '02-donor-login', path: '/login', auth: 'none' },
  { name: '03-donor-signup', path: '/signup', auth: 'none' },
  { name: '04-donor-forgot-password', path: '/forgot-password', auth: 'none' },
  { name: '05-donor-reset-password', path: '/reset-password', auth: 'none' },
  { name: '06-donor-dashboard', path: '/dashboard', auth: 'user' },
  { name: '07-donor-profile', path: '/profile', auth: 'user' },
  { name: '08-organization-details', path: '/org/org-1', auth: 'user' },
  { name: '09-donate', path: '/donate/org-1', auth: 'user' },
  { name: '10-leaderboard', path: '/leaderboard', auth: 'user' },
  { name: '11-org-login', path: '/org/login', auth: 'none' },
  { name: '12-org-signup', path: '/org/signup', auth: 'none' },
  { name: '13-org-verify-email', path: '/org/verify-email', auth: 'org' },
  { name: '14-org-forgot-password', path: '/org/forgot-password', auth: 'none' },
  { name: '15-org-reset-password', path: '/org/reset-password', auth: 'none' },
  { name: '16-org-dashboard', path: '/org/dashboard', auth: 'org' },
  { name: '17-org-donation-detail', path: '/org/donations/donation-1', auth: 'org' },
  { name: '18-org-profile', path: '/org/profile', auth: 'org' },
  { name: '19-not-found', path: '/this-page-does-not-exist', auth: 'none' },
];

async function setupAuth(page, auth) {
  if (auth === 'user') {
    await page.evaluate(({ user }) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token-user');
      localStorage.removeItem('organization');
      localStorage.removeItem('org_token');
    }, { user: mockUser });
  } else if (auth === 'org') {
    await page.evaluate(({ org }) => {
      localStorage.setItem('organization', JSON.stringify(org));
      localStorage.setItem('org_token', 'mock-token-org');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }, { org: mockOrg });
  } else {
    await page.evaluate(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('organization');
      localStorage.removeItem('org_token');
    });
  }
}

(async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  for (const pageInfo of pages) {
    const page = await context.newPage();
    try {
      await page.goto(`${TARGET_URL}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await setupAuth(page, pageInfo.auth);
      await page.goto(`${TARGET_URL}${pageInfo.path}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
      await page.waitForTimeout(1500);

      const filePath = path.join(OUTPUT_DIR, `${pageInfo.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Saved: ${pageInfo.name}.png`);
    } catch (error) {
      console.error(`Failed ${pageInfo.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Done capturing screenshots.');
})();
