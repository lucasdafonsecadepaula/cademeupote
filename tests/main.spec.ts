import { test as it, expect } from '@playwright/test'

it('handles hero section page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page.locator('h1')).toContainText('Cadê meu pote??')
  await expect(page.getByText('cademeupoteLogin')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'EMPRESTE AGORA' }),
  ).toBeVisible()
})

it('handles not found pages', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByLabel('Email or phone').click()
  await page.getByLabel('Email or phone').fill('cademeupote.app@gmail.com')
  await page.getByLabel('Email or phone').press('Enter')
})

// it("handles not found pages for routes that don't match the middleware", async ({
//   page,
// }) => {
//   await page.goto('/test.png')
//   page.getByRole('heading', { name: 'This page could not be found.' })
//   await page.goto('/api/hello')
//   page.getByRole('heading', { name: 'This page could not be found.' })
// })

// it('sets caching headers', async ({ request }) => {
//   for (const pathname of ['/en', '/pt']) {
//     expect((await request.get(pathname)).headers()['cache-control']).toBe(
//       's-maxage=31536000, stale-while-revalidate',
//     )
//   }
// })

// it('can be used to configure metadata', async ({ page }) => {
//   await page.goto('/en')
//   await expect(page).toHaveTitle('Lucas de Paula - Frontend Developer | React & TypeScript Specialist')

//   await page.goto('/pt')
//   await expect(page).toHaveTitle('Lucas de Paula - Frontend Developer | React & TypeScript Specialist')
// })

// it('can be used to localize the page', async ({ page }) => {
//   await page.goto('/en')
//   page.getByRole('heading', { name: 'next-intl example' })

//   await page.goto('/de')
//   page.getByRole('heading', { name: 'next-intl Beispiel' })
// })

// it('sets a cookie', async ({ page }) => {
//   function getCookieValue() {
//     return page.evaluate(() => document.cookie)
//   }

//   const responseEn = await page.goto('/en')
//   const valueEn = await responseEn?.headerValue('set-cookie')
//   expect(valueEn).toContain('NEXT_LOCALE=en;')
//   expect(valueEn).toContain('Path=/;')
//   expect(valueEn).toContain('SameSite=lax')
//   expect(valueEn).toContain('Max-Age=31536000;')
//   expect(valueEn).toContain('Expires=')
//   expect(await getCookieValue()).toBe('NEXT_LOCALE=en')

//   const responsePt = await page.goto('/pt')
//   const valuePt = await responsePt?.headerValue('set-cookie')
//   expect(valuePt).toContain('NEXT_LOCALE=pt;')
//   expect(valuePt).toContain('Path=/;')
//   expect(valuePt).toContain('SameSite=lax')
//   expect(valuePt).toContain('Max-Age=31536000;')
//   expect(valuePt).toContain('Expires=')
//   expect(await getCookieValue()).toBe('NEXT_LOCALE=pt')
// })

// it('serves a robots.txt', async ({ page }) => {
//   const response = await page.goto('/robots.txt')
//   const body = await response?.body()
//   expect(body?.toString()).toEqual('User-Agent: *\nAllow: *\n')
// })

// it('serves a sitemap.xml', async ({ page }) => {
//   const response = await page.goto('/sitemap.xml')
//   const body = await response!.body()

//   const isThereFirstRoute = body.toString().includes('<xhtml:link rel="alternate" hreflang="pt" href="http://localhost:3000/pt" />')
//   const isThereSecondRoute = body.toString().includes('<xhtml:link rel="alternate" hreflang="en" href="http://localhost:3000/en" />')
//   const isThereThirdRoute = body.toString().includes('<loc>http://localhost:3000/pt</loc>')

//   expect(isThereFirstRoute).toBe(true)
//   expect(isThereSecondRoute).toBe(true)
//   expect(isThereThirdRoute).toBe(true)
// })

// it('provides a manifest', async ({ page }) => {
//   const response = await page.goto('/manifest.webmanifest')
//   const body = await response!.json()
//   expect(body).toEqual({
//     name: 'Portfólio de Lucas de Paula',
//     start_url: '/',
//     theme_color: '#050505',
//   })
// })
