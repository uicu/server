import nodeMailer from 'nodemailer';
import config from  '../config';

const { smtp  } = config;

const transporter = nodeMailer.createTransport({
    secure: true, // true for 465, false for other ports
    service: 'qq',
    port: 465,
    auth: {
        user: smtp.user,
        pass: smtp.password
    }
});

// pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
// 邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码
export default function sendMail(email: string, subject: string, html: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
    const mailOptions = {
        from: `"Express" <${smtp.user}>`,
        to: email,
        subject,  // 标题
        html
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            reject(false);
        } else {
            resolve(true);
        }
    });
}