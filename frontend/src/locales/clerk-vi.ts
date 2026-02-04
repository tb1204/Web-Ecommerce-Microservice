import { enUS } from "@clerk/localizations";

export const viLocalization = {
  ...enUS,
  signUp: {
    start: {
      title: "Đăng ký tài khoản",
      subtitle: "Chào mừng bạn! Vui lòng điền thông tin để bắt đầu.",
    },
  },

  userButton: {
    action__manageAccount: "Quản lý tài khoản",
    action__signOut: "Đăng xuất",
  },

  userProfile: {
    navbar: {
      title: "Tài khoản",
      description: "Quản lý thông tin tài khoản của bạn.",
      account: "Hồ sơ",
      security: "Bảo mật",
    },

    start: {
      headerTitle__account: "Thông tin tài khoản",
      headerSubtitle__account:
        "Quản lý thông tin cá nhân, ảnh đại diện, tên người dùng và email",
      headerTitle__security: "Bảo mật",
      profileSection__title: "Hồ sơ",
    },
  },
};
