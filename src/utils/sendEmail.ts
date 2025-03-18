import transporter from "../config/email.config";

const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    // Trích xuất mã OTP từ text (giả định text có format "Your OTP is 123456")
    const otpMatch = text.match(/\d{6}/);
    const otpCode = otpMatch ? otpMatch[0] : "------"; // Lấy mã 6 chữ số hoặc dùng dấu gạch nếu không tìm thấy

    const info = await transporter.sendMail({
      from: "SUDES - Yến Sào Khánh Hoà Cao Cấp <dinhminhquang913@gmail.com>", // Nhớ thêm dấu < >
      to: email,
      subject: subject,
      text: text,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác thực OTP - SUDES Yến Sào</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
            .header {
              text-align: center;
              padding: 25px 20px 20px;
              background-color: #8b4513;
            }
            .logo {
              max-width: 180px;
              height: auto;
            }
            .content {
              padding: 30px 30px 20px;
              text-align: center;
            }
            .otp-container {
              margin: 25px auto;
              padding: 15px;
              background-color: #f8f4e6;
              border: 1px dashed #d4b78f;
              border-radius: 8px;
              text-align: center;
              width: 60%;
            }
            .otp-code {
              font-family: 'Courier New', monospace;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              color: #8b4513;
              margin: 5px 0;
            }
            .product-image {
              margin: 20px auto;
              display: block;
              max-width: 220px;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .footer {
              background-color: #f7f3eb;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
            }
            .highlight {
              color: #8b4513;
              font-weight: 600;
            }
            .button {
              display: inline-block;
              background-color: #8b4513;
              color: white;
              text-decoration: none;
              padding: 10px 25px;
              border-radius: 5px;
              margin-top: 15px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://bizweb.dktcdn.net/100/506/650/themes/944598/assets/logo.png?1739018973665" alt="SUDES Logo" class="logo">
            </div>
            
            <div class="content">
              <h2>Xác thực tài khoản</h2>
              <p>Kính chào Quý khách,</p>
              <p>Cảm ơn Quý khách đã đăng ký tài khoản tại <span class="highlight">SUDES - Yến sào Khánh Hòa cao cấp</span>. Vui lòng sử dụng mã OTP sau để hoàn tất quá trình xác thực:</p>
              
              <div class="otp-container">
                <p class="otp-code">${otpCode}</p>
                <p style="font-size: 12px; margin: 0;">Mã xác thực có hiệu lực trong 5 phút</p>
              </div>
              
              <p>Nếu Quý khách không thực hiện yêu cầu này, xin vui lòng bỏ qua email này.</p>
              
             
              
              <p><strong>SUDES - Cam kết chất lượng, uy tín hàng đầu</strong></p>
              <a href="https://sudes.vn" class="button">Truy cập website</a>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} SUDES - Yến sào Khánh Hòa cao cấp. Tất cả quyền được bảo lưu.</p>
              <p>Địa chỉ: 123 Nguyễn Huệ, Phường Tân Lập, Nha Trang, Khánh Hòa</p>
              <p>Email: support@sudes.vn | Hotline: 0905.123.456</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

export default sendEmail;
