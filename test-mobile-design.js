const { chromium } = require('@playwright/test');
const path = require('path');

async function testMobileDesign() {
    const browser = await chromium.launch({ headless: false });
    
    // 複数のモバイルデバイスサイズでテスト
    const devices = [
        { name: 'iPhone 14 Pro', width: 393, height: 852 },
        { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
        { name: 'iPhone SE', width: 375, height: 667 },
        { name: 'iPhone 12 mini', width: 375, height: 812 },
        { name: 'Android (Pixel 7)', width: 412, height: 915 }
    ];
    
    for (const device of devices) {
        const context = await browser.newContext({
            viewport: { width: device.width, height: device.height },
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true
        });
        
        const page = await context.newPage();
        const filepath = path.join(__dirname, 'novel_game_tap_start.html');
        
        console.log(`📱 Testing ${device.name} (${device.width}x${device.height})`);
        
        await page.goto(`file://${filepath}`);
        await page.waitForTimeout(2000);
        
        // 要素のサイズと位置を確認
        const tapContainer = await page.$('.tap-start-container');
        if (tapContainer) {
            const bbox = await tapContainer.boundingBox();
            console.log(`  Tap container: ${Math.round(bbox.width)}x${Math.round(bbox.height)}px`);
            console.log(`  Position: x=${Math.round(bbox.x)}, y=${Math.round(bbox.y)}`);
        }
        
        const tapText = await page.$('.tap-text');
        if (tapText) {
            const styles = await tapText.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    fontSize: computed.fontSize,
                    letterSpacing: computed.letterSpacing
                };
            });
            console.log(`  Font size: ${styles.fontSize}`);
            console.log(`  Letter spacing: ${styles.letterSpacing}`);
        }
        
        // 装飾要素の可視性確認
        const leftLine = await page.$('.decoration-line.left');
        const rightLine = await page.$('.decoration-line.right');
        if (leftLine && rightLine) {
            const leftVisible = await leftLine.isVisible();
            const rightVisible = await rightLine.isVisible();
            console.log(`  Decoration lines visible: ${leftVisible && rightVisible ? '✅' : '❌'}`);
        }
        
        // スクリーンショット保存
        const screenshotName = `screenshot-mobile-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        await page.screenshot({ path: screenshotName });
        console.log(`  📸 Screenshot saved: ${screenshotName}\n`);
        
        await context.close();
    }
    
    console.log('Press Ctrl+C to close browser...');
    await browser.pages()[0].waitForTimeout(5000);
    await browser.close();
}

testMobileDesign().catch(console.error);