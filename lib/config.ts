export interface AppConfig {
  apiUrl: string;
  // appUrl:string;
  // appName:string
}

const config: AppConfig = {
  apiUrl: "https://yurban-server-2.onrender.com/api",
  //   appUrl: process.env.REACT_APP_APP_URL as string,
  //   appName: process.env.REACT_APP_APP_NAME as string,
};

export default config;
