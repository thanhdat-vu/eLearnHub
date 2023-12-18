import { collection } from "firebase/firestore";
import { set } from "mobx";

export const vn = {
  auth: {
    heading: "Chào mừng bạn! 👋",
    signInSubHeading: "Đăng nhập để tiếp tục",
    signUpSubHeading: "Đăng ký để tiếp tục",
    forgotPassword: "Quên mật khẩu?",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    haveAccount: "Bạn đã có tài khoản?",
    haveNoAccount: "Bạn chưa có tài khoản?",
    repeatPassword: "Nhập lại mật khẩu",
    forgotPasswordSubHeading: "Nhập email để lấy lại mật khẩu",
    sendEmail: "Gửi email",
    backToSignIn: "Quay lại đăng nhập",
    invalidEmail: "Email không hợp lệ",
    requiredEmail: "Email không được để trống",
    invalidPassword: "Mật khẩu phải có ít nhất 6 ký tự",
    requiredPassword: "Mật khẩu không được để trống",
    invalidRepeatPassword: "Mật khẩu nhập lại không khớp",
    requiredRepeatPassword: "Mật khẩu nhập lại không được để trống",
    emailExists: "Email đã được sử dụng",
    wrongPassword: "Mật khẩu không chính xác",
    userNotFound: "Không tồn tại tài khoản với email này",
    weakPassword: "Mật khẩu phải có ít nhất 6 ký tự",
    unknownError: "Đã có lỗi xảy ra",
    invalidLoginCredentials: "Email hoặc mật khẩu không chính xác",
    checkEmail: "Vui lòng kiểm tra email của bạn để lấy lại mật khẩu.",
  },
  form: {
    email: "Email",
    password: "Mật khẩu",
  },
  screens: {
    home: "Trang chủ",
    collection: "Thư viện",
    notifications: "Thông báo",
    settings: "Cài đặt",
  },
  common: {
    continue: "Tiếp tục",
    success: "Thành công",
  },
  settings: {
    signOut: "Đăng xuất",
  },
};
