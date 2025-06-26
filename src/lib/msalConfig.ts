import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "ce14b156-1e4a-4e31-bdc0-6b61de980f95", // Tu Application (client) ID
    authority: "https://accessmanagercloudnative1.b2clogin.com/accessmanagercloudnative1.onmicrosoft.com/B2C_1_singinsignup_rukayun",
    knownAuthorities: ["accessmanagercloudnative1.b2clogin.com"],
    redirectUri: "http://localhost:5173/dashboard", // O tu URL de producción
  },
};