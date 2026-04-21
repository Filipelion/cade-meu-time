const { test, expect } = require('./fixtures');
const { setup } = require('./helpers/page-setup');

const NEWS_LINKS = [
  ['Sport Club do Recife', 'https://sportrecife.com.br/noticias/'],
  ['Globo Esporte',        'https://ge.globo.com/pe/futebol/times/sport/'],
  ['FolhaPE',              'https://www.folhape.com.br/esportes/sport/'],
  ['JC',                   'https://jc.ne10.uol.com.br/esportes/sport'],
  ['Meu Sport',            'https://meusport.com/'],
];

const VIDEO_LINKS = [
  ['/TVSport',      'https://www.youtube.com/@tvsportrecife/videos?view=0&sort=dd&shelf_id=1'],
  ['Globo Esporte', 'https://ge.globo.com/pe/futebol/times/sport/videos/'],
  ['@sportrecife',  'https://www.instagram.com/sportrecife/'],
];

test.describe('Hyperlinks', () => {
  test.describe('News tab', () => {
    for (const [title, href] of NEWS_LINKS) {
      test(`"${title}" links correctly`, async ({ page, extensionId }) => {
        await setup(page, extensionId);
        await page.click('#tab-news');
        const link = page.locator(`.news-card:has(.news-title:text("${title}"))`);
        await expect(link).toHaveAttribute('href', href);
        await expect(link).toHaveAttribute('target', '_blank');
      });
    }
  });

  test.describe('Videos tab', () => {
    for (const [title, href] of VIDEO_LINKS) {
      test(`"${title}" links correctly`, async ({ page, extensionId }) => {
        await setup(page, extensionId);
        await page.click('#tab-videos');
        const link = page.locator(`.video-card:has(.video-title:text("${title}"))`);
        await expect(link).toHaveAttribute('href', href);
        await expect(link).toHaveAttribute('target', '_blank');
      });
    }
  });
});
