import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      scope: ["profile", "email"],
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      try {
        // Kiểm tra xem user đã tồn tại chưa
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Nếu user đã tồn tại, cập nhật thông tin Google
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        // Nếu user chưa tồn tại, tạo mới
        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36),
          10
        );
        user = await User.create({
          email: profile.emails[0].value,
          first_name: profile.name.givenName || profile.displayName || "User",
          last_name: profile.name.familyName || "Google",
          password: hashedPassword,
          googleId: profile.id,
          email_verified: true, // Google email đã được xác thực
        });

        return done(null, user);
      } catch (error) {
        console.error("Google login error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
