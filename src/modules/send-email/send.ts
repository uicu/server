import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import sendMail from './index';
import config from  '../config';
const { domain } = config;

const UNIVERSAL = {
  domain,
  productName: 'UICU CLUB',
  companyName: 'UICU'
};
interface ConfigType {
  [propName: string]: string;
}
export function buildEmailHtml(templatePath?: string, config?: ConfigType) {
  const viewPath = `../../views/email/${templatePath}`;
  const fn = ejs.compile(fs.readFileSync(path.resolve(__dirname, viewPath), 'utf-8'), {client: true});
  const template = fn({...config, ...UNIVERSAL}, undefined, function(includePath, data) { // include callback
    let templateStr = fs.readFileSync(path.resolve(__dirname, '../../views/email', includePath), 'utf-8');
    if (!!data) {
      templateStr = templateStr.replace(/<%=(.*?)%>/g, (...props) => {
        return data[props[1].trim()];
      });
    }
    return templateStr;
  });
  return template;
}

// 欢迎
export function sendWelcomeMail ({email, name}) {
  return new Promise((resolve, reject) => {
    sendMail(
      email,
      'welcome',
      buildEmailHtml('welcome.ejs', {name}),
      resolve,
      reject
    );
  });
}

// 验证码
export async function sendCodeMail({email, code, name}) {
  return new Promise((resolve, reject) => {
      sendMail(
        email,
        'invitation code',
        buildEmailHtml('code.ejs', {code, name}),
        resolve,
        reject
      );
  });
}

// 发送密码重置邮件
export async function sendPasswordResetEmail({email, name, url, osName, browserName }) {
  return new Promise((resolve, reject) => {
      sendMail(
        email,
        'password reset',
        buildEmailHtml('password-reset.ejs', {name, url, osName, browserName }),
        resolve,
        reject
      );
  });
}

// 发送密码重置帮助（发错邮箱了，数据库里没有）
export async function sendPasswordResetEmailHelp({email, osName, browserName }) {
  return new Promise((resolve, reject) => {
      sendMail(
        email,
        'password reset help',
        buildEmailHtml('password-reset-help.ejs', {email, osName, browserName }),
        resolve,
        reject
      );
  });
}
