import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import db from "../../models/index.cjs";

const { User, Candidate } = db;

// ─── Shared: găsește sau creează user OAuth ────────────────────────────────────
async function findOrCreateOAuthUser({ provider, oauthId, email, name, photoUrl }) {
  // 1. Caută după oauth_provider + oauth_id
  let user = await User.findOne({ where: { oauth_provider: provider, oauth_id: oauthId } });

  if (!user && email) {
    // 2. Caută după email — utilizatorul poate deja să aibă cont classic
    user = await User.findOne({ where: { email } });
    if (user) {
      // Leagă contul OAuth de contul existent
      await user.update({ oauth_provider: provider, oauth_id: oauthId, is_verified: true });
    }
  }

  if (!user) {
    // 3. Cont nou complet
    user = await User.create({
      email: email || `${provider}_${oauthId}@oauth.local`,
      password_hash: null,
      oauth_provider: provider,
      oauth_id: oauthId,
      role: "candidate",
      is_active: true,
      is_verified: true,
    });
  }

  // Creează profilul de candidate dacă nu există
  const exists = await Candidate.findOne({ where: { user_id: user.id } });
  if (!exists) {
    await Candidate.create({
      user_id: user.id,
      name: name || email?.split("@")[0] || "Utilizator",
      profile_picture_url: photoUrl || null,
    });
  } else if (photoUrl && !exists.profile_picture_url) {
    // Completează poza dacă nu are una
    await exists.update({ profile_picture_url: photoUrl });
  }

  return user;
}

// ─── Google Strategy ───────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your-google-client-id") {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_ORIGIN || "http://localhost:8081"}/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || null;
          const photoUrl = profile.photos?.[0]?.value || null;
          const user = await findOrCreateOAuthUser({
            provider: "google",
            oauthId: profile.id,
            email,
            name: profile.displayName,
            photoUrl,
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// ─── LinkedIn Strategy (OpenID Connect via OAuth2) ────────────────────────────
// passport-linkedin-oauth2 uses the old /v2/me endpoint which is incompatible
// with the new "Sign In with LinkedIn using OpenID Connect" product.
// We use passport-oauth2 directly and fetch from /v2/userinfo instead.
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_ID !== "your-linkedin-client-id") {
  class LinkedInOIDCStrategy extends OAuth2Strategy {
    userProfile(accessToken, done) {
      fetch("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => r.json())
        .then((info) => {
          done(null, {
            id: info.sub,
            displayName: info.name || `${info.given_name || ""} ${info.family_name || ""}`.trim(),
            emails: info.email ? [{ value: info.email }] : [],
            photos: info.picture ? [{ value: info.picture }] : [],
          });
        })
        .catch(done);
    }
  }

  passport.use(
    "linkedin",
    new LinkedInOIDCStrategy(
      {
        authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
        tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_ORIGIN || "http://localhost:8081"}/auth/linkedin/callback`,
        scope: ["openid", "profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || null;
          const photoUrl = profile.photos?.[0]?.value || null;

          const user = await findOrCreateOAuthUser({
            provider: "linkedin",
            oauthId: profile.id,
            email,
            name: profile.displayName,
            photoUrl,
          });

          const candidate = await Candidate.findOne({ where: { user_id: user.id } });
          if (candidate && !candidate.linkedin_url) {
            await candidate.update({ linkedin_url: `https://www.linkedin.com/in/${profile.id}` });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

export default passport;
