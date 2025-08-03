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
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const firstName =
          profile.name.givenName || profile.displayName || "User";
        const lastName = profile.name.familyName || "Google";
        const avatar = profile.photos[0].value;
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.googleId = profile.id;
          user.avatar = avatar;
          await user.save();
          return done(null, user);
        }

        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36),
          10
        );
        user = await User.create({
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: hashedPassword,
          googleId: googleId,
          avatar: avatar,
          email_verified: true,
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
