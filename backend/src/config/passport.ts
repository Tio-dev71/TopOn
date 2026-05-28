import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import prisma from './prisma';

export const initPassport = () => {
  // JWT Strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
      },
      async (payload, done) => {
        try {
          const user = await prisma.user.findUnique({
            where: { id: payload.sub },
          });
          if (!user || !user.isActive) return done(null, false);
          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) return done(new Error('No email from Google'), false);

            let user = await prisma.user.findFirst({
              where: { OR: [{ googleId: profile.id }, { email }] },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email,
                  googleId: profile.id,
                  isVerified: true,
                  profile: {
                    create: {
                      fullName: profile.displayName,
                      avatarUrl: profile.photos?.[0]?.value,
                    },
                  },
                },
              });
            } else if (!user.googleId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id },
              });
            }

            return done(null, user);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }

  // Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
          profileFields: ['id', 'emails', 'name', 'picture'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) return done(new Error('No email from Facebook'), false);

            let user = await prisma.user.findFirst({
              where: { OR: [{ facebookId: profile.id }, { email }] },
            });

            if (!user) {
              user = await prisma.user.create({
                data: {
                  email,
                  facebookId: profile.id,
                  isVerified: true,
                  profile: {
                    create: {
                      fullName: `${profile.name?.givenName} ${profile.name?.familyName}`,
                    },
                  },
                },
              });
            } else if (!user.facebookId) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { facebookId: profile.id },
              });
            }

            return done(null, user);
          } catch (err) {
            return done(err, false);
          }
        }
      )
    );
  }
};
