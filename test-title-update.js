const { chromium } = require('@playwright/test');
const path = require('path');

async function testTitleVisibility() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 }, // iPhone size
    });
    const page = await context.newPage();
    
    const filepath = path.join(__dirname, 'novel_game_start_final_working.html');
    
    console.log('📱 Testing title visibility on mobile...\n');
    
    await page.goto(`file://${filepath}`);
    await page.waitForTimeout(2000);
    
    // タイトル要素の情報を取得
    const titleElement = await page.$('.game-title');
    if (titleElement) {
        const styles = await titleElement.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                color: computed.color,
                background: computed.background.substring(0, 150),
                letterSpacing: computed.letterSpacing
            };
        });
        
        console.log('📊 Title styles:');
        console.log(`  • Font Size: ${styles.fontSize}`);
        console.log(`  • Font Weight: ${styles.fontWeight}`);
        console.log(`  • Letter Spacing: ${styles.letterSpacing}`);
        console.log(`  • Background: ${styles.background}...`);
        
        const bbox = await titleElement.boundingBox();
        if (bbox) {
            console.log(`  • Size: ${Math.round(bbox.width)}x${Math.round(bbox.height)}px`);
        }
    }
    
    // サブタイトル要素の情報を取得
    const subtitleElement = await page.$('.subtitle');
    if (subtitleElement) {
        const styles = await subtitleElement.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
                fontSize: computed.fontSize,
                fontWeight: computed.fontWeight,
                letterSpacing: computed.letterSpacing
            };
        });
        
        console.log('\n📊 Subtitle styles:');
        console.log(`  • Font Size: ${styles.fontSize}`);
        console.log(`  • Font Weight: ${styles.fontWeight}`);
        console.log(`  • Letter Spacing: ${styles.letterSpacing}`);
    }
    
    // スクリーンショットを撮る
    await page.screenshot({ path: 'screenshot-title-updated.png', fullPage: false });
    console.log('\n📸 Screenshot saved: screenshot-title-updated.png');
    
    // デスクトップサイズでもテスト
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-title-desktop.png', fullPage: false });
    console.log('📸 Desktop screenshot saved: screenshot-title-desktop.png');
    
    console.log('\nPress Ctrl+C to close browser...');
    await page.waitForTimeout(10000);
    
    await browser.close();
}

testTitleVisibility().catch(console.error);