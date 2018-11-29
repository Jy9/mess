const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const config = require("../config");

//配置邮箱
const params = {
  host: 'smtp.163.com', // 设置服务
  port: 465, // 端口
  sercure: true, // 是否使用TLS，true，端口为465，否则其他或者568
  auth: {
    user: config.mailBoxUser, // 邮箱和密码
    pass: config.emailPwd
  }
}

const transporter = nodemailer.createTransport(params)

// 向自己发送邮件
router.post("/giveme",function(req,res){
    // 邮件信息
    var mailOptions = {
      from: config.mailBoxUser, // 发送邮箱
      to: config.mailBoxUser, // 接受邮箱
      subject: req.body.name +" :: "+req.body.number, // 标题
      html: req.body.message // 内容
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send(error)
      }else{
        res.send("ok")
      }
    })
})
router.post("/givehim",function(req,res){
    // 邮件信息
    var mailOptions = {
      from: config.mailBoxUser, // 发送邮箱
      to: req.body.number, // 接受邮箱
      subject: req.body.name, // 标题
      html: req.body.message // 内容
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.send(error)
      }else{
        res.send("ok")
      }
    })
})

module.exports = router