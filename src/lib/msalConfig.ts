import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "5a85e056-9f5f-45c0-a9c5-02dd2a9f7655", // Tu Application (client) ID
    authority: "https://accessmanagercloudnative1.b2clogin.com/accessmanagercloudnative1.onmicrosoft.com/B2C_1_singinsignup_rukayun",
    knownAuthorities: ["accessmanagercloudnative1.b2clogin.com"],
    redirectUri: "http://localhost:5173/dashboard", // O tu URL de producción
  },
};