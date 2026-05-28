"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const prisma_1 = __importDefault(require("./prisma"));
const initPassport = () => {
    // JWT Strategy
    passport_1.default.use(new passport_jwt_1.Strategy({
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }, async (payload, done) => {
        try {
            const user = await prisma_1.default.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user || !user.isActive)
                return done(null, false);
            return done(null, user);
        }
        catch (err) {
            return done(err, false);
        }
    }));
    // Google Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport_1.default.use(new passport_google_oauth20_1.Strategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email)
                    return done(new Error('No email from Google'), false);
                let user = await prisma_1.default.user.findFirst({
                    where: { OR: [{ googleId: profile.id }, { email }] },
                });
                if (!user) {
                    user = await prisma_1.default.user.create({
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
                }
                else if (!user.googleId) {
                    user = await prisma_1.default.user.update({
                        where: { id: user.id },
                        data: { googleId: profile.id },
                    });
                }
                return done(null, user);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    }
    // Facebook Strategy
    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
        passport_1.default.use(new passport_facebook_1.Strategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name', 'picture'],
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email)
                    return done(new Error('No email from Facebook'), false);
                let user = await prisma_1.default.user.findFirst({
                    where: { OR: [{ facebookId: profile.id }, { email }] },
                });
                if (!user) {
                    user = await prisma_1.default.user.create({
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
                }
                else if (!user.facebookId) {
                    user = await prisma_1.default.user.update({
                        where: { id: user.id },
                        data: { facebookId: profile.id },
                    });
                }
                return done(null, user);
            }
            catch (err) {
                return done(err, false);
            }
        }));
    }
};
exports.initPassport = initPassport;
//# sourceMappingURL=passport.js.map