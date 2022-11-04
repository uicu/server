import path from'path';
import svgCaptcha from 'svg-captcha';

// 图片验证码
export default (expr?: boolean) => {
    const options = {
        noise: 3,
        color: true,
        background: '#fff',
        fontSize: 38
    };
    svgCaptcha.loadFont(path.join( __dirname, './fonts/Trajan.otf'));
    if (expr) {
        return svgCaptcha.createMathExpr({
            ...options,
            mathMin: 1,
            mathMax: 9,
            mathOperator: '+-'
        });
    }
    return svgCaptcha.create({
        ...options,
        size: 4,
        ignoreChars: '0oilIi',
    });
};
