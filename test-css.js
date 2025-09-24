const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function testButtonCSS() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 }, // iPhone size
    });
    const page = await context.newPage();
    
    // テストするHTMLファイルのリスト
    const htmlFiles = [
        'novel_game_start_mobile_complete.html',
        'novel_game_start_fixed.html',
        'novel_game_start_fully_fixed.html'
    ];
    
    console.log('Starting CSS testing...\n');
    
    for (const filename of htmlFiles) {
        const filepath = path.join(__dirname, filename);
        if (!fs.existsSync(filepath)) {
            console.log(`❌ ${filename} not found, skipping...`);
            continue;
        }
        
        console.log(`\n📄 Testing: ${filename}`);
        console.log('─'.repeat(50));
        
        await page.goto(`file://${filepath}`);
        await page.waitForTimeout(1000);
        
        // ボタン要素を取得
        const buttons = await page.$$('.game-button');
        console.log(`Found ${buttons.length} buttons`);
        
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            
            // 計算済みスタイルを取得
            const styles = await button.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    display: computed.display,
                    background: computed.background.substring(0, 100) + '...',
                    padding: computed.padding,
                    color: computed.color,
                    borderRadius: computed.borderRadius,
                    clipPath: computed.clipPath,
                    transform: computed.transform,
                    width: computed.width,
                    fontSize: computed.fontSize,
                    fontFamily: computed.fontFamily,
                    position: computed.position,
                    boxShadow: computed.boxShadow
                };
            });
            
            console.log(`\n  Button ${i + 1} computed styles:`);
            console.log(`  • Display: ${styles.display}`);
            console.log(`  • Position: ${styles.position}`);
            console.log(`  • Width: ${styles.width}`);
            console.log(`  • Padding: ${styles.padding}`);
            console.log(`  • Font Size: ${styles.fontSize}`);
            console.log(`  • Color: ${styles.color}`);
            console.log(`  • Background: ${styles.background}`);
            console.log(`  • Border Radius: ${styles.borderRadius}`);
            console.log(`  • Clip Path: ${styles.clipPath}`);
            console.log(`  • Transform: ${styles.transform}`);
            console.log(`  • Box Shadow: ${styles.boxShadow ? 'Present' : 'None'}`);
            
            // ボタンの実際のレンダリングサイズ
            const bbox = await button.boundingBox();
            if (bbox) {
                console.log(`  • Actual size: ${bbox.width}x${bbox.height}`);
                console.log(`  • Position: x=${bbox.x}, y=${bbox.y}`);
            }
            
            // ボタンが見えるか確認
            const isVisible = await button.isVisible();
            console.log(`  • Visible: ${isVisible ? '✅' : '❌'}`);
        }
        
        // スクリーンショットを撮る
        const screenshotPath = `screenshot-${filename.replace('.html', '')}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
    }
    
    console.log('\n\nPress Ctrl+C to close browser...');
    // ブラウザを開いたままにして確認できるようにする
    await page.waitForTimeout(30000);
    
    await browser.close();
}

testButtonCSS().catch(console.error);